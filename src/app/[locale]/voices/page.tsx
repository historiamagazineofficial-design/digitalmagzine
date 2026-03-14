import { getArticlesByCategory } from '@/lib/api';
import RecentPerspectives from '@/components/article/RecentPerspectives';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Voices | THE HISTORIA',
  description: 'Opinion pieces and editorial signatures from our contributing voices.',
};

export default async function VoicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const articles = await getArticlesByCategory('Voices', locale);

  return (
    <main className="min-h-screen pb-24 px-4 sm:px-6 lg:px-8">
      {/* Category Header */}
      <section className="w-full max-w-5xl mx-auto py-20 text-center border-b border-black/10 dark:border-white/10">
        <span className="text-black dark:text-white text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block opacity-60">{t('home.voices.contributor')} Signature</span>
          <h1 className="text-black dark:text-white text-3xl md:text-4xl font-bold tracking-tight serif-font leading-none capitalize mb-6">
            {t('nav.voices')}
          </h1>
        <div className="h-1 w-24 bg-black dark:bg-white mx-auto mb-10"></div>
        <p className="font-serif text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed italic font-light">
          "The prominent contributors of our time — in their own words." Exploring the intersection of faith, history, and contemporary thought through personalized editorial signatures.
        </p>
      </section>

      <div className="mt-12">
        {articles.length > 0 ? (
          <RecentPerspectives articles={articles} locale={locale} />
        ) : (
          <div className="text-center py-32 font-serif text-slate-400 italic text-2xl">
            {t('article.noEntries', { tag: 'Opinion' })}
          </div>
        )}
      </div>
    </main>
  );
}
