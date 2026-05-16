"use client";

import { useEffect, useState, useTransition } from "react";
import { fetchMediaAction, updateAltAction, uploadInlineAction } from "@/app/(admin)/admin/(app)/media/actions";
import { altTextFromFilename } from "@/lib/seo/auto-fixes";

type Item = { id: number; url: string; alt: string; width: number | null; height: number | null };

export function MediaPicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (m: Item) => void;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [pending, start] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!open) return;
    start(async () => {
      const list = await fetchMediaAction();
      setItems(list);
    });
  }, [open]);

  if (!open) return null;

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.set("file", file);
        const item = await uploadInlineAction(fd);
        if (item && "id" in item) {
          // Suggest alt text from filename and save it back
          const suggested = altTextFromFilename(file.name);
          if (suggested) {
            await updateAltAction({ id: item.id, alt: suggested });
            item.alt = suggested;
          }
          setItems((prev) => [item, ...prev]);
        }
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal" style={{ maxWidth: 800, width: "calc(100% - 32px)" }} onClick={(e) => e.stopPropagation()}>
        <div className="adm-row-between" style={{ marginBottom: 12 }}>
          <h2 className="adm-modal-title">Media library</h2>
          <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={onClose}>Close</button>
        </div>
        <label
          className={`adm-media-drop ${dragging ? "over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); onFiles(e.dataTransfer.files); }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={(e) => onFiles(e.target.files)}
          />
          {uploading ? (
            <div className="adm-row" style={{ justifyContent: "center" }}>
              <span className="adm-spinner" /> Uploading…
            </div>
          ) : (
            <>
              <div style={{ fontWeight: 500 }}>Drop images here or click to upload</div>
              <div className="adm-tiny adm-muted" style={{ marginTop: 4 }}>JPEG, PNG, WEBP, SVG · up to 10 MB each</div>
            </>
          )}
        </label>
        <div style={{ height: 16 }} />
        {pending ? (
          <div className="adm-row" style={{ justifyContent: "center", padding: 30 }}>
            <span className="adm-spinner" /> Loading…
          </div>
        ) : items.length === 0 ? (
          <div className="adm-table-empty">No media yet — upload above.</div>
        ) : (
          <div className="adm-media-grid">
            {items.map((m) => (
              <button
                key={m.id}
                type="button"
                className="adm-media-tile"
                style={{ cursor: "pointer", border: "1px solid var(--adm-border)" }}
                onClick={() => { onPick(m); onClose(); }}
              >
                <img src={m.url} alt={m.alt} />
                <div className="adm-media-tile-meta">
                  <div className="adm-truncate">{m.alt || "Untitled"}</div>
                  <div className="adm-tiny adm-dim">{m.width}×{m.height}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
