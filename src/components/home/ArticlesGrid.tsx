import { getArticlesByCategory, getHeroConfig } from '@/lib/api';
import ArticleCard from '@/components/article/ArticleCard';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

export default async function ArticlesGrid({ locale }: { locale: string }) {
  const t = await getTranslations('home.articles');
  const articles = await getArticlesByCategory('Articles', locale);
  const heroConfig = await getHeroConfig();
  
  // Exclude the hero article so it doesn't duplicate on the homepage
  const displayArticles = articles.filter(a => a.slug !== heroConfig.articleSlug).slice(0, 4);

  return (
    <section className="mb-24">
      <div className="flex items-center justify-between mb-10 border-b border-black/10 dark:border-white/10 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-black dark:text-white capitalize leading-none">{t('title')}</h2>
        <div className="h-[2px] w-12 bg-black dark:bg-white hidden md:block ml-4"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {displayArticles.map(article => (
          <ArticleCard key={article.slug} article={article} variant="grid" />
        ))}
      </div>
      <div className="flex justify-center mt-16">
        <Link
          href="/archives"
          className="group relative px-10 py-4 overflow-hidden rounded bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-widest text-[10px] transition-all hover:pr-14"
        >
          <span className="relative z-10 transition-transform duration-300">{t('viewMore')}</span>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">→</span>
        </Link>
      </div>
    </section>
  );
}
