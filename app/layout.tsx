import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Cursor from '@/components/Cursor';
import './globals.css';

const monaSans = localFont({
  src: './fonts/MonaSans.woff2',
  variable: '--font-mona-sans',
  weight: '100 900',
  display: 'swap',
});

const creatoDisplay = localFont({
  src: [
    { path: './fonts/CreatoDisplay-Thin.otf', weight: '100' },
    { path: './fonts/CreatoDisplay-Light.otf', weight: '300' },
    { path: './fonts/CreatoDisplay-Regular.otf', weight: '400' },
    { path: './fonts/CreatoDisplay-Medium.otf', weight: '500' },
    { path: './fonts/CreatoDisplay-Bold.otf', weight: '700' },
    { path: './fonts/CreatoDisplay-ExtraBold.otf', weight: '800' },
    { path: './fonts/CreatoDisplay-Black.otf', weight: '900' },
  ],
  variable: '--font-creato-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? 'http://localhost:4020'),
  title: 'CodeFlee — Digital Studio · Dhaka',
  description: 'A senior engineering & design studio in Dhaka. From product thinking to launch-day comms — we sweat the details so your team can move.',
  icons: { icon: '/assets/logo-head.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F4EE' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0B0B' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${monaSans.variable} ${creatoDisplay.variable}`}>
      <body className="cf-dark" suppressHydrationWarning>
        <Cursor />
        {children}
      </body>
    </html>
  );
}
