import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Cursor from '@/components/Cursor';
import { site } from '@/lib/site';
import './styles/tokens.css';
import './styles/base.css';
import './styles/primitives.css';
import './styles/chrome.css';
import './styles/contact.css';
import './styles/home.css';
import './styles/service.css';
import './styles/case-study.css';
import './styles/blog.css';
import './styles/misc.css';

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

const SITE_URL = site.url;
const SITE_NAME = site.name;
const SITE_DESCRIPTION = site.description;
const SITE_TITLE = site.title;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: { icon: '/assets/logo-head.svg' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    url: '/',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F4EE' },
    { media: '(prefers-color-scheme: dark)', color: '#12091F' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${monaSans.variable} ${creatoDisplay.variable}`}>
      <body suppressHydrationWarning>
        <Cursor />
        {children}
      </body>
    </html>
  );
}
