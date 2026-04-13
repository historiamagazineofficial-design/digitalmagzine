import Image from 'next/image';
import { getAllArticles, getHeroConfig } from '@/lib/api';
import Link from 'next/link';
import { unstable_noStore } from 'next/cache';

export default async function HeroSection() {
  unstable_noStore(); // Always fetch fresh data — no caching on the hero
    const articles = await getAllArticles();
  const heroConfig = await getHeroConfig();
  
  const mainFeature = articles.find(a => a.slug === heroConfig.articleSlug) || articles[0];
  
  // Find secondaries: Try manual slugs list
  let secondaryArticles: any[] = [];
  if (heroConfig.secondarySlugs && heroConfig.secondarySlugs.length > 0) {
    secondaryArticles = heroConfig.secondarySlugs
      .map(slug => articles.find(a => a.slug === slug))
      .filter(Boolean) as any[];
  }
  
  // Limit to 3 for the side column stack
  secondaryArticles = secondaryArticles.slice(0, 3);

  // Auto-fallback if no secondary articles chosen
  if (secondaryArticles.length === 0) {
    const fallback = articles.find(a => a.slug !== mainFeature?.slug) || articles[1] || articles[0];
    if (fallback) secondaryArticles = [fallback];
  }

  if (!mainFeature) {
    return (
      <div className="py-32 text-center flex flex-col items-center gap-6 border border-dashed border-black/10 dark:border-white/10 rounded-3xl">
        <div className="w-16 h-16 rounded-full bg-[#07308D]/10 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-[#07308D] border-t-transparent animate-spin" />
        </div>
        <div>
          <p className="font-serif italic text-slate-500 dark:text-slate-400 text-lg mb-1">The archives are being summoned…</p>
          <p className="text-[10px] font-bold text-slate-400">Connection may be slow. Please wait or refresh.</p>
        </div>
      </div>
    );
  }

  const displayTitle = heroConfig.customTitle || mainFeature.title;
  const displayExcerpt = heroConfig.customExcerpt || mainFeature.excerpt;
  const isMalayalam = /[\u0D00-\u0D7F]/.test(displayTitle);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 pt-12">
      <Link href={`/article/${mainFeature.slug}`} className="lg:col-span-8 group cursor-pointer block">
        <div className="relative overflow-hidden rounded-xl aspect-[4/5] md:aspect-[16/9] mb-6">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-100 md:opacity-60 md:group-hover:opacity-90 transition-opacity duration-500"></div>
          <Image 
            alt={displayTitle}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out md:group-hover:scale-110" 
            src={mainFeature.imageUrl || '/hero-placeholder.jpg'}
          />
          <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20 text-white max-w-2xl">
            <span className="bg-black text-[9px] md:text-[10px] font-bold px-3 py-1 rounded-full mb-3 md:mb-4 inline-block">{'Featured Cover'}</span>
            <h2 
              className="font-bold mb-3 md:mb-4 leading-tight text-white md:group-hover:text-slate-100 transition-colors duration-300" 
              style={{ 
                fontFamily: isMalayalam ? '"Rachana", serif' : 'var(--font-heading)', 
                fontWeight: isMalayalam ? 700 : undefined,
                fontSize: isMalayalam ? 'clamp(1.5rem, 5vw, 3.5rem)' : 'clamp(1.25rem, 4vw, 2rem)'
              }}
            >
              {displayTitle}
            </h2>
            {/* Only show excerpt if not Malayalam title */}
            {!isMalayalam && (
              <p className="text-sm sm:text-base md:text-lg text-slate-200 mb-5 md:mb-6 font-serif italic line-clamp-3 md:line-clamp-2 opacity-90">{displayExcerpt}</p>
            )}
            <div className="flex items-center gap-3 md:gap-4">
               <div className="w-6 md:w-10 h-[1px] bg-white/40 md:group-hover:w-12 lg:group-hover:w-16 md:group-hover:bg-white transition-all duration-500"></div>
               <p className="text-[9px] md:text-[10px] font-bold">{mainFeature.author}</p>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="lg:col-span-4 flex flex-col gap-8">
        {secondaryArticles.length > 0 ? (
          <Link href={`/article/${secondaryArticles[0].slug}`} className="flex-1 group cursor-pointer block">
            <div className="relative overflow-hidden rounded-xl aspect-square mb-4">
              <div className="absolute inset-0 bg-transparent md:bg-black/20 md:group-hover:bg-black/0 transition-colors duration-500 z-10"></div>
              <Image 
                alt={secondaryArticles[0].title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="w-full h-full object-cover transition-transform duration-[2s] md:group-hover:scale-105" 
                src={secondaryArticles[0].imageUrl || '/hero-placeholder.jpg'}
              />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded text-[10px] font-bold z-20 text-black dark:text-white">
                {secondaryArticles[0].category || 'Featured'}
              </div>
            </div>
            <h3 
              className="text-2xl font-bold font-serif leading-snug md:group-hover:text-[#07308D] transition-colors duration-300 dark:text-white"
              style={/[\u0D00-\u0D7F]/.test(secondaryArticles[0].title) ? { fontFamily: '"Rachana", serif', fontWeight: 700, fontSize: '2.6rem', lineHeight: '1.2' } : {}}
            >
              {secondaryArticles[0].title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 line-clamp-2 leading-relaxed">{secondaryArticles[0].excerpt}</p>
          </Link>
        ) : (
          <div className="h-full border border-dashed border-white/10 rounded-xl flex items-center justify-center">
             <p className="text-[10px] font-bold text-slate-700">Waiting for content...</p>
          </div>
        )}
      </div>
    </section>
  );
}
