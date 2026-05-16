import Link from "next/link";
import Image from "next/image";
import { connection } from "next/server";
import { listMedia } from "@/lib/content/queries";

export default async function MediaPage() {
  await connection();
  const items = await listMedia(120);
  return (
    <>
      <header className="adm-topbar">
        <div className="adm-topbar-title">Media library</div>
        <div className="adm-topbar-actions">
          <Link href="/admin/posts" className="adm-btn adm-btn-ghost adm-btn-sm">Posts</Link>
        </div>
      </header>
      <div className="adm-content">
        {items.length === 0 ? (
          <div className="adm-card adm-table-empty">
            No media yet. Upload from the post editor — use the image button or drag &amp; drop.
          </div>
        ) : (
          <div className="adm-media-grid">
            {items.map((m) => (
              <div key={m.id} className="adm-media-tile" style={{ aspectRatio: "4/3", position: "relative" }}>
                {m.width && m.height ? (
                  <Image
                    src={m.blobUrl}
                    alt={m.alt || "Media"}
                    fill
                    sizes="220px"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <img src={m.blobUrl} alt={m.alt || "Media"} />
                )}
                <div className="adm-media-tile-meta">
                  <div className="adm-truncate">{m.alt || "Untitled"}</div>
                  <div className="adm-tiny adm-dim">{m.width || "?"}×{m.height || "?"}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
