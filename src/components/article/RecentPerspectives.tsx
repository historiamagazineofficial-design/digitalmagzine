import ArticleCard from './ArticleCard';
import { Article } from '@/lib/api';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

interface RecentPerspectivesProps {
  articles: Article[];
  locale?: string;
}

export default function RecentPerspectives({ articles, locale }: RecentPerspectivesProps) {
  const t = useTranslations('home');
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-center justify-between mb-12 border-b border-black/10 dark:border-white/10 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold font-serif tracking-tight capitalize leading-none">
          Recent Perspectives
        </h2>
        <Link href="/archives" className="text-[10px] uppercase tracking-[0.2em] font-bold text-black dark:text-white hover:opacity-60 transition-opacity">
          {t('articles.viewMore')} →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} variant="grid" />
        ))}
      </div>
    </section>
  );
}
