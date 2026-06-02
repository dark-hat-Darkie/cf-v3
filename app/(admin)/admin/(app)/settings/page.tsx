export default function SettingsPage() {
  return (
    <>
      <header className="adm-topbar">
        <div className="adm-topbar-title">Settings</div>
      </header>
      <div className="adm-content">
        <div className="adm-card">
          <h3>Site SEO defaults</h3>
          <p className="adm-muted">
            Configure site-wide title template, default Open Graph image, organization JSON-LD, and Twitter handle.
            Wiring lands with the bulk SEO audit in phase 4.
          </p>
          <hr className="adm-hr" />
          <div className="adm-stack">
            <div>
              <div className="adm-tiny adm-muted">SITE_URL</div>
              <div className="adm-mono">{process.env.SITE_URL ?? "(not set — using https://codeflee.com)"}</div>
            </div>
            <div>
              <div className="adm-tiny adm-muted">SITE_NAME</div>
              <div className="adm-mono">{process.env.SITE_NAME ?? "(not set — using CodeFlee)"}</div>
            </div>
            <div>
              <div className="adm-tiny adm-muted">Blob storage</div>
              <div className="adm-mono">{process.env.BLOB_READ_WRITE_TOKEN ? "configured" : "missing BLOB_READ_WRITE_TOKEN"}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
