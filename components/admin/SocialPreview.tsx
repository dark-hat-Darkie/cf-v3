export function SocialPreview({
  kind,
  title,
  description,
  imageUrl,
  siteOrigin,
}: {
  kind: "facebook" | "twitter";
  title: string;
  description: string;
  imageUrl: string | null;
  siteOrigin: string;
}) {
  const domain = siteOrigin.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <div className="adm-social-card">
      <div className="adm-social-img" style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}>
        {!imageUrl ? (
          <div style={{ display: "grid", placeItems: "center", height: "100%", color: "var(--adm-fg-muted)", fontSize: 12 }}>
            No image set
          </div>
        ) : null}
      </div>
      <div className="adm-social-meta">
        <div className="adm-social-domain">{kind === "facebook" ? domain : `From ${domain}`}</div>
        <div className="adm-social-title adm-truncate">{title || "Untitled"}</div>
        <div className="adm-social-desc adm-truncate" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", whiteSpace: "normal" }}>
          {description || "No description"}
        </div>
      </div>
    </div>
  );
}
