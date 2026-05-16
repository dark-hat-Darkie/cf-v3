"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import type { JSONContent } from "@tiptap/core";
import { sharedExtensions } from "@/lib/editor/schema";
import { extractPlainText, wordCountOf } from "@/lib/editor/plain-text";
import { analyze, type AnalysisResult } from "@/lib/seo/analyzer";
import { buildStructure } from "@/lib/seo/context";
import type { AnalysisInput } from "@/lib/seo/types";
import { metaFromFirstParagraph } from "@/lib/seo/auto-fixes";
import {
  DEFAULT_DECORATION_SETTINGS,
  SeoDecorations,
  setDecorationSettings,
  type DecorationSettings,
} from "@/lib/editor/decorations";
import {
  deletePostAction,
  publishAction,
  saveDraftAction,
  scheduleAction,
  unpublishAction,
  updateMetaAction,
} from "@/app/(admin)/admin/(app)/posts/actions";
import { findCannibalizationAction } from "@/app/(admin)/admin/(app)/posts/cannibalization";
import { EditorToolbar } from "./EditorToolbar";
import { MetaPanel, type MetaState } from "./MetaPanel";
import { SeoPanel } from "./SeoPanel";
import { MediaPicker } from "./MediaPicker";
import { PrePublishChecklist } from "./PrePublishChecklist";

type Image = MetaState["featuredImage"];

type Status = "draft" | "scheduled" | "published" | "archived";

export type EditorPost = {
  id: number;
  slug: string;
  title: string;
  content: JSONContent;
  excerpt: string;
  revision: number;
  status: Status;
  publishedAt: string | null;
  scheduledAt: string | null;
  focusKeyword: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  twitterCard: "summary" | "summary_large_image";
  canonical: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  schemaType: "BlogPosting" | "Article" | "NewsArticle" | "HowTo";
  readingTimeMinutes: number;
  wordCount: number;
  seoScore: number;
  readabilityScore: number;
  isCornerstone: boolean;
  featuredImage: Image;
  ogImage: Image;
};

const AUTOSAVE_DEBOUNCE_MS = 1500;

export function PostEditor({ post, siteOrigin }: { post: EditorPost; siteOrigin: string }) {
  const router = useRouter();
  const origin = siteOrigin;

  // Title & content state
  const [title, setTitle] = useState(post.title);
  const [doc, setDoc] = useState<JSONContent>(post.content);

  // Meta state
  const [meta, setMeta] = useState<MetaState>({
    slug: post.slug,
    excerpt: post.excerpt,
    focusKeyword: post.focusKeyword,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    ogTitle: post.ogTitle,
    ogDescription: post.ogDescription,
    twitterCard: post.twitterCard,
    canonical: post.canonical,
    robotsIndex: post.robotsIndex,
    robotsFollow: post.robotsFollow,
    schemaType: post.schemaType,
    featuredImage: post.featuredImage,
    ogImage: post.ogImage,
    isCornerstone: post.isCornerstone,
  });

  const [status, setStatus] = useState<Status>(post.status);
  const [revision, setRevision] = useState<number>(post.revision);
  const [saveState, setSaveState] = useState<{ kind: "idle" | "saving" | "saved" | "error"; at?: string; msg?: string }>({ kind: "idle" });
  const [pendingMeta, startMeta] = useTransition();
  const [pendingPublish, startPublish] = useTransition();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [cannibalization, setCannibalization] = useState<{ id: number; slug: string; title: string }[]>([]);
  const [dirty, setDirty] = useState(false);

  // Decoration toggles
  const [decoSettings, setDecoSettings] = useState<DecorationSettings>({
    ...DEFAULT_DECORATION_SETTINGS,
    focusKeyword: post.focusKeyword,
  });

  // TipTap editor
  const editor = useEditor({
    extensions: [
      ...sharedExtensions,
      Placeholder.configure({ placeholder: "Start writing… or press / for commands" }),
      CharacterCount.configure(),
      SeoDecorations.configure({ settings: decoSettings }),
    ],
    content: post.content,
    editorProps: { attributes: { class: "adm-prose" } },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setDoc(editor.getJSON());
      setDirty(true);
    },
  });

  // Push decoration settings down when toggles or focus keyword change
  useEffect(() => {
    if (!editor) return;
    setDecorationSettings(editor.view, decoSettings);
  }, [editor, decoSettings]);

  // Cannibalization fetch (debounced when focus keyword changes)
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => {
      findCannibalizationAction(post.id, meta.focusKeyword).then((rows) => {
        if (!cancelled) setCannibalization(rows);
      });
    }, 400);
    return () => { cancelled = true; clearTimeout(t); };
  }, [meta.focusKeyword, post.id]);

  // Autosave (debounced)
  const inFlight = useRef(false);
  const queued = useRef<null | (() => void)>(null);
  const doSaveRef = useRef<() => Promise<void>>(async () => {});

  const doSave = useCallback(async () => {
    if (inFlight.current) {
      queued.current = doSaveRef.current;
      return;
    }
    inFlight.current = true;
    setSaveState({ kind: "saving" });
    const nextRev = revision + 1;
    try {
      const res = await saveDraftAction({
        postId: post.id,
        revision: nextRev,
        title,
        content: doc,
      });
      if (res.ok) {
        setRevision(res.revision);
        setSaveState({ kind: "saved", at: res.savedAt });
        setDirty(false);
      } else {
        setSaveState({ kind: "error", msg: res.error });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setSaveState({ kind: "error", msg: `Network error: ${msg}` });
    } finally {
      inFlight.current = false;
      if (queued.current) {
        const q = queued.current;
        queued.current = null;
        q();
      }
    }
  }, [doc, title, post.id, revision]);

  useEffect(() => {
    doSaveRef.current = doSave;
  }, [doSave]);

  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(doSave, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [doc, title, dirty, doSave]);

  // beforeunload
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty || saveState.kind === "saving") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty, saveState.kind]);

  // Meta auto-save
  const metaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onMetaChange = useCallback((patch: Partial<MetaState>) => {
    setMeta((prev) => ({ ...prev, ...patch }));
    if (metaTimer.current) clearTimeout(metaTimer.current);
    metaTimer.current = setTimeout(() => {
      startMeta(async () => {
        const next = { ...meta, ...patch };
        await updateMetaAction({
          postId: post.id,
          slug: next.slug,
          excerpt: next.excerpt,
          focusKeyword: next.focusKeyword,
          metaTitle: next.metaTitle,
          metaDescription: next.metaDescription,
          ogTitle: next.ogTitle,
          ogDescription: next.ogDescription,
          ogImageId: next.ogImage?.id ?? null,
          twitterCard: next.twitterCard,
          canonical: next.canonical,
          robotsIndex: next.robotsIndex,
          robotsFollow: next.robotsFollow,
          schemaType: next.schemaType,
          featuredImageId: next.featuredImage?.id ?? null,
          isCornerstone: next.isCornerstone,
        });
      });
    }, 700);
  }, [meta, post.id]);

  // Live analysis
  const plainText = useMemo(() => extractPlainText(doc), [doc]);
  const wordCount = useMemo(() => wordCountOf(plainText), [plainText]);
  const structure = useMemo(() => buildStructure(doc, plainText, origin), [doc, plainText, origin]);
  const analysisInput: AnalysisInput = useMemo(
    () => ({
      postId: post.id,
      title,
      slug: meta.slug,
      excerpt: meta.excerpt,
      metaTitle: meta.metaTitle,
      metaDescription: meta.metaDescription,
      focusKeyword: meta.focusKeyword.trim(),
      secondaryKeywords: [],
      content: doc,
      plainText,
      wordCount,
      ogTitle: meta.ogTitle,
      ogDescription: meta.ogDescription,
      ogImage: meta.ogImage,
      featuredImage: meta.featuredImage,
      twitterCard: meta.twitterCard,
      canonical: meta.canonical,
      robotsIndex: meta.robotsIndex,
      robotsFollow: meta.robotsFollow,
      schemaType: meta.schemaType,
      isCornerstone: meta.isCornerstone,
      cannibalization,
      structure,
      siteOrigin: origin,
    }),
    [post.id, title, meta, doc, plainText, wordCount, structure, cannibalization, origin],
  );

  const [analysis, setAnalysis] = useState<AnalysisResult>(() => analyze(analysisInput));
  const analysisTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (analysisTimer.current) clearTimeout(analysisTimer.current);
    analysisTimer.current = setTimeout(() => setAnalysis(analyze(analysisInput)), 350);
  }, [analysisInput]);

  // Keep keyword in sync with decoration settings
  const lastSyncedKw = useRef(meta.focusKeyword);
  useEffect(() => {
    if (lastSyncedKw.current !== meta.focusKeyword) {
      lastSyncedKw.current = meta.focusKeyword;
      setDecoSettings((s) => ({ ...s, focusKeyword: meta.focusKeyword }));
    }
  }, [meta.focusKeyword]);

  // Jump-to-heading helper for outline view
  const handleJumpToHeading = useCallback(
    (text: string) => {
      if (!editor) return;
      const dom = editor.view.dom as HTMLElement;
      const headings = dom.querySelectorAll("h1, h2, h3, h4");
      for (const h of Array.from(headings)) {
        if (h.textContent?.trim() === text.trim()) {
          h.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
      }
    },
    [editor],
  );

  const handleInsertInternalLink = useCallback(
    (slug: string, postTitle: string) => {
      if (!editor) return;
      const href = `/blog/${slug}`;
      const sel = editor.state.selection;
      if (sel.empty) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "text",
            marks: [{ type: "link", attrs: { href } }],
            text: postTitle,
          })
          .run();
      } else {
        editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
      }
      setDirty(true);
    },
    [editor],
  );

  // Publish actions
  const openChecklist = () => setChecklistOpen(true);
  const handlePublish = () => {
    startPublish(async () => {
      await doSave();
      const res = await publishAction(post.id);
      if (res.ok) {
        setStatus("published");
        setChecklistOpen(false);
        router.refresh();
      } else {
        setSaveState({ kind: "error", msg: res.error });
      }
    });
  };

  const handleUnpublish = () => {
    startPublish(async () => {
      const res = await unpublishAction(post.id);
      if (res.ok) {
        setStatus("draft");
        router.refresh();
      }
    });
  };

  const handleSchedule = (when: string) => {
    startPublish(async () => {
      await doSave();
      const res = await scheduleAction(post.id, when);
      if (res.ok) {
        setStatus("scheduled");
        setScheduleOpen(false);
        router.refresh();
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this post permanently?")) return;
    startPublish(async () => {
      await deletePostAction(post.id);
    });
  };

  // Preview: open a tab synchronously (so popup blockers don't kick in),
  // then save the latest draft and redirect the tab to the preview URL.
  const [previewing, setPreviewing] = useState(false);
  const handlePreview = async () => {
    const previewUrl = `/preview/post/${post.id}`;
    const win = window.open("", "_blank");
    setPreviewing(true);
    try {
      if (dirty || saveState.kind === "saving") {
        await doSave();
      }
      if (win) {
        win.location.href = previewUrl;
      } else {
        window.open(previewUrl, "_blank", "noopener");
      }
    } finally {
      setPreviewing(false);
    }
  };

  const handleFix = (intent: string) => {
    if (!editor) return;
    if (intent === "fix-external-rel") {
      // ProseMirror traversal — set rel on every link mark
      const { state, view } = editor;
      const tr = state.tr;
      state.doc.descendants((node, pos) => {
        if (!node.marks) return;
        for (const mark of node.marks) {
          if (mark.type.name !== "link") continue;
          const href: string = mark.attrs.href ?? "";
          if (!/^https?:\/\//i.test(href) || href.startsWith(origin)) continue;
          tr.removeMark(pos, pos + node.nodeSize, mark.type);
          tr.addMark(
            pos,
            pos + node.nodeSize,
            mark.type.create({ ...mark.attrs, rel: "noopener noreferrer", target: "_blank" }),
          );
        }
      });
      if (tr.docChanged) {
        view.dispatch(tr);
        setDirty(true);
      }
    }
  };

  const insertImage = (img: Image) => {
    if (!editor || !img) return;
    editor.chain().focus().setImage({ src: img.url, alt: img.alt }).run();
  };

  // ---- Render ----
  const saveText =
    saveState.kind === "saving" ? "Saving…" :
    saveState.kind === "saved" && saveState.at ? `Saved · ${new Date(saveState.at).toLocaleTimeString()}` :
    saveState.kind === "error" ? `Save failed: ${saveState.msg}` :
    dirty ? "Unsaved" : `Rev ${revision}`;

  return (
    <>
      <header className="adm-topbar">
        <div className="adm-row" style={{ gap: 14 }}>
          <Link href="/admin/posts" className="adm-btn adm-btn-ghost adm-btn-sm">← Posts</Link>
          <span className={`adm-table-status ${status}`}>{status}</span>
          <span className={`adm-editor-save-status ${saveState.kind}`}>{saveText}</span>
        </div>
        <div className="adm-row" style={{ gap: 8 }}>
          <span className="adm-counter">{wordCount.toLocaleString()} words · {Math.max(1, Math.round(wordCount / 200))} min</span>
          <button
            type="button"
            className="adm-btn adm-btn-ghost adm-btn-sm"
            onClick={handlePreview}
            disabled={previewing}
            title="Open a tab that renders this post exactly like the live blog page"
          >
            {previewing ? "Opening…" : "Preview"}
          </button>
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setScheduleOpen(true)} disabled={pendingPublish}>Schedule</button>
          {status === "published" ? (
            <button type="button" className="adm-btn adm-btn-sm" onClick={handleUnpublish} disabled={pendingPublish}>Unpublish</button>
          ) : (
            <button type="button" className="adm-btn adm-btn-primary adm-btn-sm" onClick={openChecklist} disabled={pendingPublish}>
              {pendingPublish ? <span className="adm-spinner" /> : null}
              {pendingPublish ? "Publishing…" : "Publish"}
            </button>
          )}
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-danger" onClick={handleDelete} disabled={pendingPublish}>Delete</button>
        </div>
      </header>

      <div className="adm-editor-shell">
        <div className="adm-editor-main">
          <input
            className="adm-input adm-input-xl"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setDirty(true); }}
            placeholder="Post title…"
          />
          <div className="adm-editor-meta-strip">
            <span className="adm-mono">/blog/{meta.slug || "your-slug"}</span>
            <span className="dot" />
            <span>{wordCount.toLocaleString()} words</span>
            <span className="dot" />
            <span>SEO {analysis.seo.score} · Readability {analysis.readability.score}</span>
            {pendingMeta ? <span className="dot" /> : null}
            {pendingMeta ? <span>Saving meta…</span> : null}
          </div>

          <EditorToolbar editor={editor} onPickImage={() => setImagePickerOpen(true)} />
          <div className="adm-row" style={{ gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            <span className="adm-tiny adm-muted" style={{ marginRight: 6 }}>Highlight:</span>
            <ToggleChip label="Focus keyphrase" on={decoSettings.showKeyword} color="warn" onClick={() => setDecoSettings((s) => ({ ...s, showKeyword: !s.showKeyword }))} />
            <ToggleChip label="Passive voice" on={decoSettings.showPassive} color="purple" onClick={() => setDecoSettings((s) => ({ ...s, showPassive: !s.showPassive }))} />
            <ToggleChip label={`Long sentences > ${decoSettings.longSentenceMin}w`} on={decoSettings.showLongSentence} color="warn" onClick={() => setDecoSettings((s) => ({ ...s, showLongSentence: !s.showLongSentence }))} />
            <ToggleChip label="Missing alt" on={decoSettings.showMissingAlt} color="error" onClick={() => setDecoSettings((s) => ({ ...s, showMissingAlt: !s.showMissingAlt }))} />
          </div>
          <EditorContent editor={editor} />

          <div style={{ height: 32 }} />
          <MetaPanel
            title={title}
            meta={meta}
            firstParagraph={structure.firstParagraphText}
            onChange={onMetaChange}
            onAutoMetaDescription={() => {
              onMetaChange({ metaDescription: metaFromFirstParagraph(structure.firstParagraphText) });
            }}
          />
        </div>

        <SeoPanel
          analysis={analysis}
          title={meta.metaTitle || title}
          slug={meta.slug}
          description={meta.metaDescription}
          ogTitle={meta.ogTitle}
          ogDescription={meta.ogDescription}
          ogImageUrl={meta.ogImage?.url ?? meta.featuredImage?.url ?? null}
          siteOrigin={origin}
          headings={structure.headings}
          postId={post.id}
          focusKeyword={meta.focusKeyword}
          onFix={handleFix}
          onJumpToHeading={handleJumpToHeading}
          onInsertInternalLink={handleInsertInternalLink}
        />
      </div>

      <MediaPicker
        open={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onPick={(m) => { insertImage(m as Image); }}
      />

      {scheduleOpen ? <ScheduleDialog onClose={() => setScheduleOpen(false)} onSchedule={handleSchedule} /> : null}
      {checklistOpen ? (
        <PrePublishChecklist
          analysis={analysis}
          onClose={() => setChecklistOpen(false)}
          onPublish={handlePublish}
          publishing={pendingPublish}
        />
      ) : null}
    </>
  );
}

function ToggleChip({ label, on, color, onClick }: { label: string; on: boolean; color: "warn" | "purple" | "error"; onClick: () => void }) {
  const accent =
    color === "warn" ? "rgba(180,83,9,0.7)" :
    color === "purple" ? "rgba(124,58,237,0.7)" :
    "rgba(185,28,28,0.7)";
  const tint =
    color === "warn" ? "rgba(180,83,9,0.10)" :
    color === "purple" ? "rgba(124,58,237,0.10)" :
    "rgba(185,28,28,0.10)";
  return (
    <button
      type="button"
      className="adm-tag"
      style={{
        cursor: "pointer",
        borderColor: on ? accent : "var(--adm-border-strong)",
        background: on ? tint : "var(--adm-surface-2)",
        color: on ? "var(--adm-fg)" : "var(--adm-fg-muted)",
      }}
      onClick={onClick}
    >
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: on ? accent : "transparent", border: `1px solid ${on ? accent : "var(--adm-border-strong)"}`, display: "inline-block" }} />
      {label}
    </button>
  );
}

function ScheduleDialog({ onClose, onSchedule }: { onClose: () => void; onSchedule: (when: string) => void }) {
  const [when, setWhen] = useState<string>(() => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    return d.toISOString().slice(0, 16);
  });

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="adm-modal-title">Schedule publish</h2>
        <p className="adm-modal-sub">A cron task will publish the post at the chosen time.</p>
        <div className="adm-field">
          <label className="adm-label">Publish at</label>
          <input className="adm-input" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
        </div>
        <div className="adm-modal-actions">
          <button className="adm-btn adm-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn-primary" onClick={() => onSchedule(new Date(when).toISOString())}>Schedule</button>
        </div>
      </div>
    </div>
  );
}
