import { getArticlesByCategory, getHeroConfig } from '@/lib/api';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import Image from 'next/image';

export default async function FictionSection({ locale }: { locale: string }) {
  const t = await getTranslations();
  const articles = await getArticlesByCategory('Fiction', locale);
  const heroConfig = await getHeroConfig();
  
  // Exclude the hero article so it doesn't duplicate, and take exactly 4
  const fictionArticles = articles.filter(a => a.slug !== heroConfig.articleSlug).slice(0, 4);
  
  if (fictionArticles.length === 0) return null;

  return (
    <section className="mb-24">
      <div className="flex items-center justify-between mb-10 border-b border-black/10 dark:border-white/10 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-black dark:text-white capitalize leading-none">{t('nav.fiction')}</h2>
        <div className="h-[2px] w-12 bg-black dark:bg-white hidden md:block ml-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
        {/* Large Portrait Item (Left) */}
        {fictionArticles[0] && (
          <Link 
            href={`/article/${fictionArticles[0].slug}`}
            className="md:col-span-5 relative rounded-2xl overflow-hidden group h-[400px] md:h-full block"
          >
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
            <Image 
              src={fictionArticles[0].imageUrl} 
              alt={fictionArticles[0].title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 p-8 w-full z-20">
               <p className="text-[#ec5b13] text-[9px] font-bold shadow-black tracking-[0.2em] mb-3 uppercase drop-shadow-md">{fictionArticles[0].author}</p>
               <h3 className="text-3xl font-serif text-white mb-4 group-hover:text-gray-200 transition-colors drop-shadow-md">{fictionArticles[0].title}</h3>
               <p className="text-gray-300 font-serif italic line-clamp-2 drop-shadow-md">"{fictionArticles[0].excerpt}"</p>
            </div>
            <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
               Latest
            </div>
          </Link>
        )}

        <div className="md:col-span-7 grid grid-rows-2 gap-6 h-auto md:h-full">
          {/* Wide Landscape Item (Top Right) */}
          {fictionArticles[1] && (
            <Link 
              href={`/article/${fictionArticles[1].slug}`}
              className="relative rounded-2xl overflow-hidden group h-[300px] md:h-full block"
            >
              <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-90"></div>
              <Image 
                src={fictionArticles[1].imageUrl} 
                alt={fictionArticles[1].title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 p-8 z-20 w-full md:w-3/4">
                 <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-[#ec5b13] transition-colors drop-shadow-md">{fictionArticles[1].title}</h3>
                 <p className="text-gray-200 text-sm line-clamp-2 drop-shadow-md">{fictionArticles[1].excerpt}</p>
                 <div className="flex items-center gap-3 mt-4">
                     <span className="w-8 h-[1px] bg-[#ec5b13]"></span>
                     <p className="text-white text-[9px] font-bold uppercase tracking-widest">{fictionArticles[1].author}</p>
                 </div>
              </div>
            </Link>
          )}

          {/* Two Small Square Items (Bottom Right) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-[300px] md:h-full">
            {fictionArticles.slice(2, 4).map((article) => (
              <Link 
                key={article.slug}
                href={`/article/${article.slug}`}
                className="relative rounded-2xl overflow-hidden group block h-full bg-stone-100 dark:bg-slate-900 border border-black/5 dark:border-white/5"
              >
                  {/* For these smaller items, we do a text-heavy design instead of images so the grid isn't overwhelmingly heavy with photos */}
                  <div className="p-8 h-full flex flex-col justify-center relative z-10">
                      
                      {/* Decorative Quote Mark */}
                      <span className="absolute top-4 left-6 font-serif text-6xl text-black/5 dark:text-white/5 z-0">"</span>
                      
                      <div className="relative z-10">
                        <span className="inline-block text-[9px] font-bold bg-white text-black dark:bg-black dark:text-white px-2 py-1 mb-4 rounded border border-black/10 dark:border-white/10 uppercase tracking-widest">
                            Short
                        </span>
                        <h4 className="text-lg font-serif font-bold text-black dark:text-white mb-3 group-hover:text-[#ec5b13] transition-colors leading-tight">
                          {article.title}
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm italic font-serif line-clamp-3 mb-4">
                          {article.excerpt}
                        </p>
                        <p className="text-[9px] text-black dark:text-white font-bold uppercase tracking-[0.2em] opacity-50">
                          By {article.author}
                        </p>
                      </div>
                  </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <Link
          href="/fiction"
          className="group relative px-10 py-4 overflow-hidden rounded bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-widest text-[10px] transition-all hover:pr-14"
        >
          <span className="relative z-10 transition-transform duration-300">{t('home.articles.viewMore')}</span>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">→</span>
        </Link>
      </div>
    </section>
  );
}
