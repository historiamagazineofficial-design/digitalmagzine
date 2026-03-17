import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/api';

interface ArticleCardProps {
  article: Article;
  variant?: 'grid' | 'masonry' | 'horizontal';
}

export default function ArticleCard({ article, variant = 'grid' }: ArticleCardProps) {
  const isFiction = article.category === 'Fiction';

  if (variant === 'masonry') {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="masonry-item block group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-500"
      >
        <div className="relative overflow-hidden">
          <div className="aspect-[4/5] w-full relative">
            <Image 
              src={article.imageUrl || 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1200&auto=format&fit=crop'} 
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover bg-gray-100 transition-transform duration-700 md:group-hover:scale-105"
            />
          </div>
          <span className="absolute top-4 right-4 bg-black text-white text-[9px] font-bold px-3 py-1 rounded-full z-10">
            {article.tags?.[0] || article.category}
          </span>
        </div>
        <div className="p-6">
          <p className="text-slate-500 text-[10px] font-bold mb-2">{article.author}</p>
          <h3 
            className="font-serif text-xl font-bold leading-snug text-black dark:text-white md:group-hover:text-slate-600 transition-colors mb-4"
            style={/[\u0D00-\u0D7F]/.test(article.title) ? { fontFamily: '"Rachana", serif', fontWeight: 700 } : {}}
          >
            {article.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 font-serif italic border-l-2 border-black/5 pl-4 ml-1">
            {isFiction ? `"${article.excerpt}"` : article.excerpt}
          </p>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-bold">
            <span>{article.readingTime}</span>
            <span>{article.date}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.slug}`} className="flex flex-col gap-6 group cursor-pointer block">
      <div className="relative overflow-hidden rounded-xl aspect-[3/2]">
         <div className="absolute inset-0 bg-transparent md:bg-black/5 md:group-hover:bg-transparent transition-colors duration-500 z-10"></div>
        <Image 
          src={article.imageUrl || 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1200&auto=format&fit=crop'} 
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="w-full h-full object-cover transition-transform duration-1000 md:group-hover:scale-110" 
        />
        <span className="absolute top-4 right-4 z-20 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full">
            {article.tags?.[0] || article.category}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 mb-3">{article.author}</p>
        <h3 
          className="text-2xl font-bold font-serif mb-4 md:group-hover:text-slate-600 transition-colors leading-tight text-black dark:text-slate-200"
          style={/[\u0D00-\u0D7F]/.test(article.title) ? { fontFamily: '"Rachana", serif', fontWeight: 700 } : {}}
        >
          {article.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm line-clamp-2 italic font-serif opacity-80">{article.excerpt}</p>
      </div>
    </Link>
  );
}
