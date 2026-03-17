import { Article } from '@/lib/api';
import Link from 'next/link';

interface FeaturedRowProps {
  articles: Article[];
}

export default function FeaturedRow({ articles }: FeaturedRowProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mb-24">
      {/* Clean transparent layout with only partition lines */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 md:gap-y-0 md:divide-x divide-black/10 dark:divide-white/10">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/article/${article.slug}`}
              className="group flex flex-col px-5 lg:px-6 transition-colors duration-300"
            >
              {/* Category tag without box */}
              <div className="mb-4 flex justify-center">
                <span className="inline-block text-[#2E5BFF] text-[9px] font-bold">
                  {article.category || 'Focus'}
                </span>
              </div>
              
              {/* Smaller serif typography */}
              <h3 
                className={`text-lg md:text-xl font-bold font-serif leading-snug text-center text-black/90 dark:text-white/90 mb-3 md:group-hover:text-[#2E5BFF] transition-colors line-clamp-3 ${
                  /[\u0D00-\u0D7F]/.test(article.title) ? 'font-bold' : ''
                }`}
                style={/[\u0D00-\u0D7F]/.test(article.title) ? { fontFamily: '"Rachana", serif', fontWeight: 700 } : {}}
              >
                {article.title}
              </h3>
              
              {/* Clean white space & minimalist shortened excerpt */}
              <p className="text-xs font-serif italic text-slate-500 dark:text-slate-400 text-center line-clamp-2 mb-6 leading-relaxed opacity-80">
                {article.excerpt}
              </p>
              
              <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5 text-center flex items-center justify-center gap-2">
                <div className="w-3 h-[1px] bg-[#2E5BFF]/60"></div>
                <p className="text-[9px] font-bold text-[#2E5BFF]/80">
                  {article.author}
                </p>
                <div className="w-3 h-[1px] bg-[#2E5BFF]/60"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
