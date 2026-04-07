import Link from 'next/link';
import { getArticlesByCategory, getHeroConfig } from '@/lib/api';
import Image from 'next/image';

export default async function MythosSection() {
  const articles = await getArticlesByCategory('Mythos');
  const heroConfig = await getHeroConfig();
  
  let displayArticles = articles.length > 0 ? articles.slice(0, 2) : [];

  if (heroConfig.mythosSlugs && heroConfig.mythosSlugs.length > 0) {
    const specific = heroConfig.mythosSlugs
      .map(slug => articles.find(a => a.slug === slug))
      .filter(Boolean)
      .slice(0, 2);
    if (specific.length > 0) displayArticles = specific as any;
  }

  if (displayArticles.length === 0) return null;

  return (
    <section className="mb-20 px-4 md:px-0">
      <div className="flex items-end justify-between mb-12 pb-6 border-b-2 border-black/10 dark:border-white/10">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-[#2E5BFF] mb-1">Legends & Epics</p>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-black dark:text-white leading-none">
            Mythos
          </h2>
        </div>
        <Link
          href="/mythos"
          className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-black dark:hover:text-white transition-colors group pb-1"
        >
          Explore
          <span className="w-0 group-hover:w-6 h-px bg-[#2E5BFF] transition-all duration-300" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {displayArticles.map((article) => (
          <Link 
            key={article.slug} 
            href={`/article/${article.slug}`}
            className="group block relative overflow-hidden rounded-3xl aspect-[16/10] bg-slate-100 dark:bg-slate-900 shadow-2xl shadow-black/5"
          >
            <Image 
              src={article.imageUrl || '/icon-512x512.png'} 
              alt={article.title}
              fill
              className="object-cover transition-transform duration-[2s] md:group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white w-full">
               <span className="inline-block text-[9px] font-bold mb-4 text-[#2E5BFF]">Mythos Selection</span>
               <h3 
                 className="text-2xl md:text-3xl font-bold font-serif mb-4 md:group-hover:text-[#2E5BFF] transition-colors leading-tight"
                 style={/[\u0D00-\u0D7F]/.test(article.title) ? { fontFamily: '"Rachana", serif', fontWeight: 700, fontSize: '2.6rem' } : {}}
               >
                 {article.title}
               </h3>
                {!/[\u0D00-\u0D7F]/.test(article.title) && (
                  <div className="flex items-center gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform">
                     <div className="w-8 h-px bg-white/40"></div>
                     <p className="text-[10px] font-bold">Entry of Legend</p>
                  </div>
                )}
            </div>
          </Link>
        ))}
      </div>


    </section>
  );
}
