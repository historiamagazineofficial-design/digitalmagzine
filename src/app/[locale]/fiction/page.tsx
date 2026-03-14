import type { Metadata } from 'next';
import { getArticlesByCategory } from '@/lib/api';
import ArticleCard from '@/components/article/ArticleCard';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Fiction | THE HISTORIA',
  description: 'Explore our curated collection of contemporary narratives, short stories, and experimental prose.',
};

export default async function FictionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const fictionArticles = await getArticlesByCategory('Fiction', locale);

  return (
    <main className="px-6 md:px-20 py-20 max-w-[1400px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-12 mb-20">
        <div className="max-w-3xl">
          <h1 className="text-black dark:text-white text-3xl md:text-4xl font-bold tracking-tight serif-font leading-none capitalize mb-6">
            {t('nav.fiction')}
          </h1>
          <div className="h-1 w-24 bg-black dark:bg-white mb-8"></div>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-serif italic leading-relaxed font-light">
            "Fiction is the lie through which we tell the truth." Explore our curated collection of contemporary narratives, short stories, and experimental prose.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-6 border-y border-black/5 dark:border-white/5 py-6 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 shrink-0">Genre:</span>
          <div className="flex gap-4">
            {['All', '#Poetry', '#Literature', '#Stories'].map((tag) => (
              <button
                key={tag}
                className={`text-[10px] font-bold uppercase tracking-widest transition-all px-4 py-2 rounded-full ${
                  tag === 'All'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-slate-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Masonry Grid */}
      {fictionArticles.length > 0 ? (
        <div className="masonry-grid">
          {fictionArticles.map((article) => (
            <div key={article.slug} className="masonry-item">
               <ArticleCard article={article} variant="masonry" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 border border-dashed border-black/10 dark:border-white/10 rounded-3xl">
          <p className="text-slate-400 italic font-serif text-2xl">
            {t('article.noEntries', { tag: 'Fiction' })}
          </p>
        </div>
      )}

      {fictionArticles.length > 0 && (
         <div className="flex justify-center mt-24">
            <button className="group relative px-10 py-4 overflow-hidden rounded-full border border-black/10 dark:border-white/10 text-black dark:text-white font-bold uppercase tracking-[0.3em] text-[10px] transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
               <span className="relative z-10">{t('home.articles.viewMore')}</span>
            </button>
         </div>
      )}
    </main>
  );
}
