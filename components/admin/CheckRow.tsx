import type { CheckResult } from "@/lib/seo/types";

export function CheckRow({ result, onFix }: { result: CheckResult; onFix?: (intent: string) => void }) {
  const dotClass =
    result.severity === "good" ? "good" :
    result.severity === "warn" ? "warn" :
    result.severity === "bad" ? "bad" : "";
  return (
    <div className="adm-seo-check">
      <span className={`adm-seo-check-dot ${dotClass}`} />
      <div className="adm-seo-check-body">
        <div className="adm-seo-check-msg">{result.message}</div>
        {result.why ? <div className="adm-seo-check-why">{result.why}</div> : null}
        {result.fix && onFix ? (
          <button
            type="button"
            className="adm-btn adm-btn-sm adm-seo-check-fix"
            onClick={() => onFix(result.fix!.intent)}
          >
            {result.fix.label}
          </button>
        ) : null}
      </div>
    </div>
  );
}
