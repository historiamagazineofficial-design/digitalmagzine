import type { Metadata } from 'next';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import PushPrompt from '@/components/layout/PushPrompt';
import ScrollRestorer from '@/components/layout/ScrollRestorer';
import '../globals.css';

export const metadata: Metadata = {
  title: 'THE INKSPIRE | Digital Magazine',
  description: 'Curating the archives of humanity through deep-dive analysis, visual immersion, and scholarly storytelling.',
  icons: {
    icon: [
      { url: '/maink.png', sizes: 'any', type: 'image/png' },
    ],
    apple: [
      { url: '/maink.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/maink.png',
  },
  openGraph: {
    title: 'THE INKSPIRE',
    description: 'A premium digital sanctuary for Islamic literature',
    url: 'https://theinkspire.com',
    siteName: 'Inkspire',
    images: [
      {
        url: '/maink.png',
        width: 1200,
        height: 630,
        alt: 'Inkspire Icon',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'THE INKSPIRE',
    description: 'A premium digital sanctuary for Islamic literature',
    images: ['/maink.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&family=Montserrat:wght@900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased transition-colors duration-300">
        {/* Force Pure Color Filter for Logo Transparency Issues */}
        <svg style={{ visibility: 'hidden', position: 'absolute' }} width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="force-pure-black">
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 100 -1" />
            </filter>
            <filter id="force-pure-white">
              <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 100 -1" />
            </filter>
          </defs>
        </svg>
        <SiteHeader />
        <div className="min-h-screen pt-36 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
          {children}
        </div>
        <SiteFooter />
        <PushPrompt />
        <ScrollRestorer />
      </body>
    </html>
  );
}
