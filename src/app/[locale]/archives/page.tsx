import { getArticlesByCategory, getTags } from '@/lib/api';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ArchivesClient from './ArchivesClient';

export default async function ArticlesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const articles = await getArticlesByCategory('Articles', locale);
  const customTags = await getTags();

  return (
    <main className="px-6 md:px-20 py-20 max-w-[1400px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-12 mb-20">
        <div className="max-w-3xl">
          <h1 className="text-black dark:text-white text-3xl md:text-4xl font-bold tracking-tight serif-font leading-none capitalize mb-6">
            {t('nav.archives')}
          </h1>
          <div className="h-1 w-24 bg-black dark:bg-white mb-8"></div>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-serif italic leading-relaxed font-light">
            A comprehensive record of scholarly depth, theological inquiry, and the currents of Islamic intellectual history.
          </p>
        </div>
        
        <ArchivesClient initialArticles={articles} customTags={customTags} />
      </div>
    </main>
  );
}
