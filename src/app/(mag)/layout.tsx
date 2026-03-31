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
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icon-192x192.png',
  },
  openGraph: {
    title: 'THE INKSPIRE',
    description: 'A premium digital sanctuary for Islamic literature',
    url: 'https://theinkspire.com',
    siteName: 'Inkspire',
    images: [
      {
        url: '/icon-512x512.png',
        width: 1200,
        height: 630,
        alt: 'Inkspire Cover Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THE INKSPIRE',
    description: 'A premium digital sanctuary for Islamic literature',
    images: ['/icon-512x512.png'],
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
