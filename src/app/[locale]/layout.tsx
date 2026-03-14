import type { Metadata } from 'next';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import PushPrompt from '@/components/layout/PushPrompt';
import ScrollRestorer from '@/components/layout/ScrollRestorer';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'THE HISTORIA | Digital Magazine',
  description: 'Curating the archives of humanity through deep-dive analysis, visual immersion, and scholarly storytelling.',
  openGraph: {
    title: 'THE HISTORIA',
    description: 'A premium digital sanctuary for Islamic literature',
    url: 'https://thehistoria.com',
    siteName: 'Historia',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Historia Cover Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THE HISTORIA',
    description: 'A premium digital sanctuary for Islamic literature',
    images: ['https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1200&auto=format&fit=crop'],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` is supported
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased transition-colors duration-300">
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          <div className="min-h-screen pt-20 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
            {children}
          </div>
          <SiteFooter />
          <PushPrompt />
          <ScrollRestorer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
