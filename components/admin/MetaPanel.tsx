"use client";

import { useState } from "react";
import slugify from "github-slugger";
import { MediaPicker } from "./MediaPicker";
import { smartSlug, titleCase, sentenceCase } from "@/lib/seo/auto-fixes";

const slugger = new slugify();

type Image = { id: number; url: string; alt: string; width: number | null; height: number | null };

export type MetaState = {
  slug: string;
  excerpt: string;
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
  featuredImage: Image | null;
  ogImage: Image | null;
  isCornerstone: boolean;
};

function lengthChip(len: number, ideal: [number, number], hardMax: number) {
  if (len === 0) return { cls: "bad", txt: "empty" };
  if (len < ideal[0]) return { cls: "warn", txt: "short" };
  if (len > hardMax) return { cls: "bad", txt: "too long" };
  if (len > ideal[1]) return { cls: "warn", txt: "long" };
  return { cls: "good", txt: "good" };
}

export function MetaPanel({
  title,
  meta,
  firstParagraph,
  onChange,
  onAutoMetaDescription,
}: {
  title: string;
  meta: MetaState;
  firstParagraph: string;
  onChange: (patch: Partial<MetaState>) => void;
  onAutoMetaDescription?: () => void;
}) {
  const [pickerOpen, setPickerOpen] = useState<"featured" | "og" | null>(null);

  const titleLen = (meta.metaTitle || title).length;
  const titleChip = lengthChip(titleLen, [50, 60], 70);
  const descChip = lengthChip(meta.metaDescription.length, [120, 158], 175);

  return (
    <div className="adm-card">
      <h3>SEO essentials</h3>

      <div className="adm-field">
        <label className="adm-label">
          Focus keyphrase
          <span className="adm-label-hint">the term you want to rank for</span>
        </label>
        <input
          className="adm-input"
          value={meta.focusKeyword}
          onChange={(e) => onChange({ focusKeyword: e.target.value })}
          placeholder="e.g. content marketing strategy"
        />
      </div>

      <div className="adm-field">
        <label className="adm-label">
          URL slug
          <span className="adm-label-hint">/blog/<span className="adm-mono">{meta.slug || "your-slug"}</span></span>
        </label>
        <div className="adm-row">
          <input
            className="adm-input"
            value={meta.slug}
            onChange={(e) => onChange({ slug: e.target.value })}
            placeholder="my-post-slug"
          />
          <button
            type="button"
            className="adm-btn adm-btn-sm"
            title="Plain slug from title"
            onClick={() => onChange({ slug: slugger.slug(title || meta.focusKeyword || "untitled") })}
          >
            Plain
          </button>
          <button
            type="button"
            className="adm-btn adm-btn-sm"
            title="Smart slug — strips stop words and ensures the focus keyphrase is present"
            onClick={() => onChange({ slug: smartSlug(title, meta.focusKeyword) })}
          >
            Smart
          </button>
        </div>
      </div>

      <div className="adm-field">
        <label className="adm-label">
          SEO title
          <span className={`adm-counter-pill ${titleChip.cls}`} style={{ marginLeft: "auto" }}>
            {titleLen}/60 · {titleChip.txt}
          </span>
        </label>
        <input
          className="adm-input"
          value={meta.metaTitle}
          onChange={(e) => onChange({ metaTitle: e.target.value })}
          placeholder={title ? `${title} (fallback)` : "Write the SERP title…"}
        />
        <div className="adm-row" style={{ gap: 6, marginTop: 6 }}>
          <button type="button" className="adm-btn adm-btn-sm adm-btn-ghost" title="Title Case" onClick={() => onChange({ metaTitle: titleCase(meta.metaTitle || title) })}>Title Case</button>
          <button type="button" className="adm-btn adm-btn-sm adm-btn-ghost" title="Sentence case" onClick={() => onChange({ metaTitle: sentenceCase(meta.metaTitle || title) })}>Sentence case</button>
        </div>
      </div>

      <div className="adm-field">
        <label className="adm-label">
          Meta description
          <span className={`adm-counter-pill ${descChip.cls}`} style={{ marginLeft: "auto" }}>
            {meta.metaDescription.length}/158 · {descChip.txt}
          </span>
        </label>
        <textarea
          className="adm-textarea"
          value={meta.metaDescription}
          onChange={(e) => onChange({ metaDescription: e.target.value })}
          placeholder="One or two compelling sentences (120–158 chars)…"
          rows={3}
        />
        {firstParagraph && onAutoMetaDescription ? (
          <button
            type="button"
            className="adm-btn adm-btn-sm adm-btn-ghost"
            style={{ marginTop: 6 }}
            title="Fill from first paragraph, trimmed at a sentence boundary"
            onClick={onAutoMetaDescription}
          >
            ↺ Fill from first paragraph
          </button>
        ) : null}
      </div>

      <div className="adm-field">
        <label className="adm-label">
          Excerpt
          <span className="adm-label-hint">cards & RSS — falls back to meta description</span>
        </label>
        <textarea
          className="adm-textarea"
          value={meta.excerpt}
          onChange={(e) => onChange({ excerpt: e.target.value })}
          rows={2}
        />
      </div>

      <hr className="adm-hr" />
      <h3>Images</h3>

      <div className="adm-grid-2" style={{ gap: 10 }}>
        <div className="adm-field" style={{ marginBottom: 0 }}>
          <label className="adm-label">Featured</label>
          <button
            type="button"
            className="adm-media-tile"
            style={{ aspectRatio: "16/9", padding: 0 }}
            onClick={() => setPickerOpen("featured")}
          >
            {meta.featuredImage ? (
              <img src={meta.featuredImage.url} alt={meta.featuredImage.alt} />
            ) : (
              <div style={{ display: "grid", placeItems: "center", height: "100%", color: "var(--adm-fg-muted)", fontSize: 12 }}>
                Pick image
              </div>
            )}
          </button>
          {meta.featuredImage ? (
            <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => onChange({ featuredImage: null })}>Remove</button>
          ) : null}
        </div>
        <div className="adm-field" style={{ marginBottom: 0 }}>
          <label className="adm-label">OG override</label>
          <button
            type="button"
            className="adm-media-tile"
            style={{ aspectRatio: "16/9", padding: 0 }}
            onClick={() => setPickerOpen("og")}
          >
            {meta.ogImage ? (
              <img src={meta.ogImage.url} alt={meta.ogImage.alt} />
            ) : (
              <div style={{ display: "grid", placeItems: "center", height: "100%", color: "var(--adm-fg-muted)", fontSize: 12 }}>
                Optional · uses featured
              </div>
            )}
          </button>
          {meta.ogImage ? (
            <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => onChange({ ogImage: null })}>Remove</button>
          ) : null}
        </div>
      </div>

      <hr className="adm-hr" />
      <h3>Social</h3>

      <div className="adm-field">
        <label className="adm-label">OG title <span className="adm-label-hint">falls back to SEO title</span></label>
        <input className="adm-input" value={meta.ogTitle} onChange={(e) => onChange({ ogTitle: e.target.value })} />
      </div>
      <div className="adm-field">
        <label className="adm-label">OG description <span className="adm-label-hint">falls back to meta description</span></label>
        <textarea className="adm-textarea" rows={2} value={meta.ogDescription} onChange={(e) => onChange({ ogDescription: e.target.value })} />
      </div>
      <div className="adm-field">
        <label className="adm-label">Twitter card</label>
        <select className="adm-select" value={meta.twitterCard} onChange={(e) => onChange({ twitterCard: e.target.value as "summary" | "summary_large_image" })}>
          <option value="summary_large_image">summary_large_image</option>
          <option value="summary">summary</option>
        </select>
      </div>

      <hr className="adm-hr" />
      <h3>Advanced</h3>

      <div className="adm-field">
        <label className="adm-label">Schema.org type</label>
        <select className="adm-select" value={meta.schemaType} onChange={(e) => onChange({ schemaType: e.target.value as MetaState["schemaType"] })}>
          <option value="BlogPosting">BlogPosting</option>
          <option value="Article">Article</option>
          <option value="NewsArticle">NewsArticle</option>
          <option value="HowTo">HowTo</option>
        </select>
      </div>

      <div className="adm-field">
        <label className="adm-label">Canonical URL <span className="adm-label-hint">leave blank to auto-derive</span></label>
        <input className="adm-input" type="url" value={meta.canonical} onChange={(e) => onChange({ canonical: e.target.value })} placeholder="https://…" />
      </div>

      <div className="adm-row" style={{ gap: 18, marginBottom: 10 }}>
        <label className="adm-checkbox">
          <button
            type="button"
            className="adm-switch"
            data-on={meta.robotsIndex}
            onClick={() => onChange({ robotsIndex: !meta.robotsIndex })}
          />
          Index
        </label>
        <label className="adm-checkbox">
          <button
            type="button"
            className="adm-switch"
            data-on={meta.robotsFollow}
            onClick={() => onChange({ robotsFollow: !meta.robotsFollow })}
          />
          Follow
        </label>
      </div>

      <label className="adm-checkbox">
        <button
          type="button"
          className="adm-switch"
          data-on={meta.isCornerstone}
          onClick={() => onChange({ isCornerstone: !meta.isCornerstone })}
        />
        Cornerstone content
        <span className="adm-label-hint">raises word-count target to 900+</span>
      </label>

      <MediaPicker
        open={pickerOpen !== null}
        onClose={() => setPickerOpen(null)}
        onPick={(m) => {
          if (pickerOpen === "featured") onChange({ featuredImage: m });
          if (pickerOpen === "og") onChange({ ogImage: m });
        }}
      />
    </div>
  );
}
