import Image from 'next/image';
import { getAllArticles, getHeroConfig } from '@/lib/api';
import Link from 'next/link';
import { unstable_noStore } from 'next/cache';

export default async function HeroSection() {
  unstable_noStore(); // Always fetch fresh data — no caching on the hero
    const articles = await getAllArticles();
  const heroConfig = await getHeroConfig();
  
  const mainFeature = articles.find(a => a.slug === heroConfig.articleSlug) || articles[0];
  
  // Find secondary: 1. Try manual slug, 2. If same as main or missing, try next most recent article, 3. Fallback to any second article
  let secondFeature = articles.find(a => a.slug === heroConfig.secondarySlug);
  
  if (!secondFeature || secondFeature.slug === mainFeature?.slug) {
    secondFeature = articles.find(a => a.slug !== mainFeature?.slug) || articles[1] || articles[0];
  }

  if (!mainFeature) {
    return (
      <div className="py-32 text-center flex flex-col items-center gap-6 border border-dashed border-black/10 dark:border-white/10 rounded-3xl">
        <div className="w-16 h-16 rounded-full bg-[#2E5BFF]/10 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-[#2E5BFF] border-t-transparent animate-spin" />
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
            src={mainFeature.imageUrl || 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=2574'}
          />
          <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20 text-white max-w-2xl">
            <span className="bg-black text-[9px] md:text-[10px] font-bold px-3 py-1 rounded-full mb-3 md:mb-4 inline-block">{'Featured Cover'}</span>
            <h2 className="text-[1.25rem] sm:text-2xl md:text-[2rem] font-bold mb-3 md:mb-4 leading-tight text-white md:group-hover:text-slate-100 transition-colors duration-300" style={{ fontFamily: isMalayalam ? '"Gayathri", sans-serif' : 'var(--font-heading)', fontWeight: isMalayalam ? 700 : undefined }}>{displayTitle}</h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-200 mb-5 md:mb-6 font-serif italic line-clamp-3 md:line-clamp-2 opacity-90">{displayExcerpt}</p>
            <div className="flex items-center gap-3 md:gap-4">
               <div className="w-6 md:w-10 h-[1px] bg-white/40 md:group-hover:w-12 lg:group-hover:w-16 md:group-hover:bg-white transition-all duration-500"></div>
               <p className="text-[9px] md:text-[10px] font-bold">{mainFeature.author}</p>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="lg:col-span-4 flex flex-col gap-8">
        {secondFeature ? (
          <Link href={`/article/${secondFeature.slug}`} className="flex-1 group cursor-pointer block">
            <div className="relative overflow-hidden rounded-xl aspect-square mb-4">
              <div className="absolute inset-0 bg-transparent md:bg-black/20 md:group-hover:bg-black/0 transition-colors duration-500 z-10"></div>
              <Image 
                alt={secondFeature.title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="w-full h-full object-cover transition-transform duration-[2s] md:group-hover:scale-105" 
                src={secondFeature.imageUrl || 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=2574'}
              />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded text-[10px] font-bold z-20 text-black dark:text-white">
                {secondFeature.tags[0] || 'Perspective'}
              </div>
            </div>
            <h3 className="text-2xl font-bold font-serif leading-snug md:group-hover:text-[#2E5BFF] transition-colors duration-300 dark:text-white">{secondFeature.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 line-clamp-2 leading-relaxed">{secondFeature.excerpt}</p>
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
