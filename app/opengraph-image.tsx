import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Default social-share card, inherited by every route that doesn't set its
// own openGraph/twitter image (homepage, services, blog index, …). Blog posts
// and case studies override this with their own featured/hero image.
export const alt = 'CodeFlee — Digital Studio · Dhaka';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const fontsDir = join(process.cwd(), 'app', 'fonts');
  const [regular, medium] = await Promise.all([
    readFile(join(fontsDir, 'CreatoDisplay-Regular.otf')),
    readFile(join(fontsDir, 'CreatoDisplay-Medium.otf')),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#24133F',
          backgroundImage:
            'radial-gradient(900px 520px at 82% -10%, rgba(131,51,235,0.55), rgba(36,19,63,0))',
          padding: '76px 84px',
          fontFamily: 'Creato Display',
          color: '#F8F4EE',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 9999,
              background: '#FF80AE',
              marginRight: 18,
            }}
          />
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 500, letterSpacing: -0.5 }}>
            CodeFlee
          </div>
          <div style={{ display: 'flex', fontSize: 26, color: 'rgba(248,244,238,0.5)', marginLeft: 16 }}>
            Digital Studio
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 78,
            fontWeight: 500,
            lineHeight: 1.04,
            letterSpacing: -2.5,
            maxWidth: 980,
          }}
        >
          Digital studio building products founders trust.
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', fontSize: 27, color: 'rgba(248,244,238,0.62)' }}>
            Dhaka · Senior engineering &amp; design
          </div>
          <div style={{ display: 'flex', fontSize: 27, fontWeight: 500, color: '#C4A1FF' }}>
            codeflee.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Creato Display', data: regular, weight: 400, style: 'normal' },
        { name: 'Creato Display', data: medium, weight: 500, style: 'normal' },
      ],
    },
  );
}
