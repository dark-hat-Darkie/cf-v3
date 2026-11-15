/** Small abstract illustrations for the service cards. Colours come from CSS (see `.cf-art`). */
const ART: Record<string, React.ReactNode> = {
  'web-development': (
    <>
      <rect className="a-card" x="40" y="22" width="240" height="124" rx="12" />
      <circle className="a-dim" cx="58" cy="38" r="3.5" /><circle className="a-dim" cx="70" cy="38" r="3.5" /><circle className="a-dim" cx="82" cy="38" r="3.5" />
      <line className="a-line" x1="40" y1="52" x2="280" y2="52" />
      <rect className="a-accent" x="60" y="68" width="54" height="8" rx="4" />
      <rect className="a-dim" x="122" y="68" width="92" height="8" rx="4" />
      <rect className="a-dim" x="76" y="86" width="120" height="8" rx="4" />
      <rect className="a-pink" x="204" y="86" width="36" height="8" rx="4" />
      <rect className="a-dim" x="76" y="104" width="70" height="8" rx="4" />
      <rect className="a-accent" x="60" y="122" width="40" height="8" rx="4" />
    </>
  ),
  'mobile-apps': (
    <>
      <rect className="a-card" x="92" y="14" width="76" height="140" rx="16" />
      <rect className="a-dim" x="118" y="24" width="24" height="5" rx="2.5" />
      <rect className="a-accent" x="104" y="42" width="52" height="38" rx="8" />
      <rect className="a-dim" x="104" y="90" width="52" height="7" rx="3.5" />
      <rect className="a-dim" x="104" y="104" width="34" height="7" rx="3.5" />
      <rect className="a-card" x="180" y="38" width="64" height="116" rx="14" />
      <circle className="a-pink" cx="212" cy="74" r="14" />
      <rect className="a-dim" x="192" y="100" width="40" height="7" rx="3.5" />
      <rect className="a-accent" x="192" y="124" width="40" height="14" rx="7" />
    </>
  ),
  'ui-ux-design': (
    <>
      <rect className="a-card" x="44" y="26" width="150" height="112" rx="12" />
      <rect className="a-dim" x="58" y="42" width="60" height="8" rx="4" />
      <rect className="a-tint" x="58" y="60" width="122" height="40" rx="8" />
      <rect className="a-accent" x="58" y="112" width="48" height="14" rx="7" />
      <rect className="a-outline" x="114" y="112" width="48" height="14" rx="7" />
      <circle className="a-accent" cx="226" cy="52" r="14" /><circle className="a-pink" cx="258" cy="52" r="14" />
      <circle className="a-plum" cx="226" cy="88" r="14" /><circle className="a-tint a-stroke" cx="258" cy="88" r="14" />
      <path className="a-plum" d="M214 112l22 8-9 4-4 9z" />
    </>
  ),
  'brand-motion': (
    <>
      <circle className="a-outline" cx="118" cy="80" r="52" />
      <circle className="a-outline" cx="170" cy="80" r="52" />
      <path className="a-accent" d="M144 35a52 52 0 010 90 52 52 0 010-90z" />
      <path className="a-curve" d="M214 124c22 0 14-88 62-88" />
      <circle className="a-pink" cx="214" cy="124" r="6" /><circle className="a-pink" cx="276" cy="36" r="6" />
    </>
  ),
  'webgl-3d': (
    <>
      <path className="a-tint a-stroke" d="M160 20l72 40v60l-72 40-72-40V60z" />
      <path className="a-accent" d="M160 80l72-20v60l-72 40z" opacity=".85" />
      <path className="a-plum" d="M160 80L88 60v60l72 40z" opacity=".9" />
      <path className="a-pink" d="M160 20l72 40-72 20-72-20z" />
      <circle className="a-dim" cx="262" cy="34" r="5" /><circle className="a-dim" cx="56" cy="130" r="4" />
    </>
  ),
  ecommerce: (
    <>
      <rect className="a-card" x="52" y="24" width="104" height="116" rx="12" />
      <rect className="a-tint" x="64" y="36" width="80" height="54" rx="8" />
      <rect className="a-dim" x="64" y="100" width="56" height="7" rx="3.5" />
      <rect className="a-accent" x="64" y="116" width="34" height="10" rx="5" />
      <rect className="a-card" x="172" y="44" width="100" height="76" rx="12" />
      <rect className="a-dim" x="186" y="58" width="48" height="7" rx="3.5" />
      <rect className="a-dim" x="186" y="72" width="72" height="7" rx="3.5" />
      <rect className="a-accent" x="186" y="92" width="72" height="16" rx="8" />
      <circle className="a-pink" cx="262" cy="42" r="12" />
    </>
  ),
};

export default function ServiceArt({ slug }: { slug: string }) {
  return (
    <svg className="cf-art" viewBox="0 0 320 168" role="presentation" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      {ART[slug] ?? ART['web-development']}
    </svg>
  );
}
