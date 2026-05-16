export function SerpPreview({
  title,
  slug,
  description,
  siteOrigin,
}: {
  title: string;
  slug: string;
  description: string;
  siteOrigin: string;
}) {
  const url = `${siteOrigin.replace(/\/$/, "")}/blog/${slug || "your-slug"}`;
  const cleanUrl = url.replace(/^https?:\/\//, "");
  const displayTitle = title || "Untitled — set an SEO title";
  const displayDesc = description || "Set a meta description to control how this listing reads in Google.";

  return (
    <div className="adm-serp">
      <div className="adm-serp-url">{cleanUrl}</div>
      <h3 className="adm-serp-title">{displayTitle.length > 60 ? displayTitle.slice(0, 60) + "…" : displayTitle}</h3>
      <p className="adm-serp-desc">{displayDesc.length > 158 ? displayDesc.slice(0, 158) + "…" : displayDesc}</p>
    </div>
  );
}
