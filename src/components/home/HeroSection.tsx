import Image from 'next/image';
import { getAllArticles, getHeroConfig } from '@/lib/api';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

export default async function HeroSection({ locale }: { locale: string }) {
  const t = await getTranslations('home.hero');
  const articles = await getAllArticles(locale);
  const heroConfig = await getHeroConfig();
  
  const mainFeature = articles.find(a => a.slug === heroConfig.articleSlug) || articles[0];
  const secondFeature = articles.find(a => a.category === 'Articles' && a.slug !== mainFeature?.slug) || articles[1] || articles[0];

  if (!mainFeature) {
    return (
      <div className="py-20 text-center border border-dashed border-white/20 rounded-xl">
        <p className="text-slate-500 uppercase tracking-widest text-sm">No featured articles found</p>
      </div>
    );
  }

  const displayTitle = heroConfig.customTitle || mainFeature.title;
  const displayExcerpt = heroConfig.customExcerpt || mainFeature.excerpt;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
      <Link href={`/article/${mainFeature.slug}`} className="lg:col-span-8 group cursor-pointer block">
        <div className="relative overflow-hidden rounded-xl aspect-[16/9] mb-6">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-90"></div>
          <Image 
            alt={displayTitle}
            fill
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
            src={mainFeature.imageUrl || 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=2574'}
          />
          <div className="absolute bottom-0 left-0 p-8 z-20 text-white max-w-2xl">
            <span className="bg-black text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4 inline-block">{t('featured')}</span>
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4 leading-tight group-hover:text-white/80 transition-colors duration-300">{displayTitle}</h2>
            <p className="text-lg text-slate-200 mb-6 font-serif italic line-clamp-2 opacity-90">{displayExcerpt}</p>
            <div className="flex items-center gap-4">
               <div className="w-10 h-[1px] bg-white/40 group-hover:w-16 group-hover:bg-white transition-all duration-500"></div>
               <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{mainFeature.author}</p>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="lg:col-span-4 flex flex-col gap-8">
        {secondFeature ? (
          <Link href={`/article/${secondFeature.slug}`} className="flex-1 group cursor-pointer block">
            <div className="relative overflow-hidden rounded-xl aspect-square mb-4">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-10"></div>
              <Image 
                alt={secondFeature.title}
                fill
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                src={secondFeature.imageUrl}
              />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase z-20 text-black dark:text-white">
                {secondFeature.tags[0] || 'Perspective'}
              </div>
            </div>
            <h3 className="text-2xl font-bold font-serif leading-snug group-hover:text-black transition-colors duration-300">{secondFeature.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 line-clamp-2 leading-relaxed">{secondFeature.excerpt}</p>
          </Link>
        ) : (
          <div className="h-full border border-dashed border-white/10 rounded-xl flex items-center justify-center">
             <p className="text-[10px] uppercase tracking-widest text-slate-700">Waiting for content...</p>
          </div>
        )}
      </div>
    </section>
  );
}
