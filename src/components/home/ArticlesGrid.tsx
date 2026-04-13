import { getArticlesByCategory, getHeroConfig } from '@/lib/api';
import ArticleCard from '@/components/article/ArticleCard';
import Link from 'next/link';

export default async function ArticlesGrid() {
  const articles = await getArticlesByCategory('Articles');
  const heroConfig = await getHeroConfig();

  let displayArticles = articles
    .filter(a => a.slug !== heroConfig.articleSlug && a.showOnHomepage !== false)
    .slice(0, 2);

  if (heroConfig.articleSlugs && heroConfig.articleSlugs.length > 0) {
    const specific = heroConfig.articleSlugs
      .map(slug => articles.find(a => a.slug === slug))
      .filter(Boolean)
      .slice(0, 2);
    if (specific.length > 0) displayArticles = specific as any;
  }

  return (
    <section className="mb-24">
      {/* Section header */}
      <div className="flex items-end justify-between mb-12 pb-6 border-b-2 border-black/10 dark:border-white/10">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-[#07308D] mb-1">Deep Dive</p>
          <h2 className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-black dark:text-white leading-none">
            Articles
          </h2>
        </div>
        <Link
          href="/archives"
          className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-black dark:hover:text-white transition-colors group pb-1"
        >
          View All
          <span className="w-0 group-hover:w-6 h-px bg-[#07308D] transition-all duration-300" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {displayArticles.map(article => (
          <ArticleCard key={article.slug} article={article} variant="grid" />
        ))}
      </div>

    </section>
  );
}
