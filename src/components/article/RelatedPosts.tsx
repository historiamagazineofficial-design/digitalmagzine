import { getAllArticles } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

interface RelatedPostsProps {
  currentSlug: string;
  category: string;
  tags: string[];
}

export default async function RelatedPosts({ currentSlug, category, tags }: RelatedPostsProps) {
  const allArticles = await getAllArticles();

  // Find related articles: same category or shared tags, not the current article, only published
  const related = allArticles
    .filter(a =>
      a.slug !== currentSlug &&
      a.status === 'Published' &&
      (a.category === category || a.tags?.some(t => tags?.includes(t)))
    )
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-16 border-t border-slate-200 dark:border-slate-800 zen-hide">
      <div className="mb-10">
        <p className="text-[10px] font-bold text-[#07308D] mb-2">Continue Reading</p>
        <h3 className="text-2xl font-serif font-bold text-black dark:text-white">Related Posts</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {related.map((article) => (
          <Link
            key={article.slug}
            href={`/article/${article.slug}`}
            className="group flex flex-col gap-4"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
              {article.imageUrl && (
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-3 left-3">
                <span className="text-[9px] font-black bg-white/90 dark:bg-black/80 backdrop-blur-sm text-black dark:text-white px-2 py-1 rounded">
                  {article.category}
                </span>
              </div>
            </div>

            {/* Text */}
            <div>
              <h4 
                className="font-serif font-bold text-black dark:text-white leading-tight mb-2 group-hover:text-[#07308D] transition-colors"
                style={/[\u0D00-\u0D7F]/.test(article.title) ? { fontFamily: '"Rachana", serif', fontWeight: 700 } : {}}
              >
                {article.title}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-serif italic line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-2 mt-3 text-[10px] font-bold text-slate-400">
                <span>{article.author}</span>
                <span>·</span>
                <span>{article.readingTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
