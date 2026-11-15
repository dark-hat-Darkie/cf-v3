'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { CaseScreenshotPage } from '@/lib/case-studies-data';
import FullPageLightbox from '@/components/FullPageLightbox';

/** Screenshot tiles; clicking one opens the scrollable full-page viewer. */
export default function ShowcaseGallery({ client, screenshots }: { client: string; screenshots: CaseScreenshotPage[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <>
      <div className={`cf-shots${screenshots.length % 2 === 1 ? ' cf-shots--odd' : ''}`}>
        {screenshots.map((s, i) => {
          const label = s.label ?? `Page ${i + 1}`;
          return (
            <button
              key={s.src}
              type="button"
              className="cf-shot"
              onClick={() => setOpenIdx(i)}
              data-cursor="Open full page"
              aria-label={`Open full page: ${label}`}
              data-rise=""
            >
              <span className="cf-media cf-media--pan">
                <Image
                  src={s.src}
                  alt={`${client} — ${label}`}
                  fill
                  sizes="(max-width: 860px) 100vw, 620px"
                  placeholder={s.blurDataURL ? 'blur' : 'empty'}
                  blurDataURL={s.blurDataURL || undefined}
                />
              </span>
              <span className="cf-shot-cap">
                <span>{String(i + 1).padStart(2, '0')}</span>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {openIdx !== null && (
        <FullPageLightbox pages={screenshots} startIndex={openIdx} title={client} onClose={() => setOpenIdx(null)} />
      )}
    </>
  );
}
