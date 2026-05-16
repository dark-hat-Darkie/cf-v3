export function PostBody({ html }: { html: string }) {
  return (
    <article
      className="cf-prose"
      // HTML comes from server-side generateHTML() with strict TipTap schema, then
      // post-processed for safe link/image attributes. It is not user-pastable HTML.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
