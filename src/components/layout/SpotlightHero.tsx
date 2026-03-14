import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

interface SpotlightProps {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  imageUrl: string;
  slug: string;
}

export default function SpotlightHero({
  title,
  excerpt,
  category,
  author,
  imageUrl,
  slug,
}: SpotlightProps) {
  const t = useTranslations('home.voices');

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-end justify-center overflow-hidden rounded-[3rem] shadow-2xl shadow-black/20 group">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[10s] group-hover:scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 text-center text-white space-y-8">
        <div className="flex items-center justify-center gap-4 mb-4">
           <div className="h-px w-8 bg-white/20"></div>
           <span className="inline-block uppercase tracking-[0.4em] text-white/60 text-[10px] font-bold">
             {category}
           </span>
           <div className="h-px w-8 bg-white/20"></div>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-serif font-bold leading-[0.9] max-w-4xl mx-auto tracking-tighter uppercase italic">
          {title}
        </h1>
        
        <p className="text-xl md:text-2xl font-serif max-w-2xl mx-auto opacity-70 italic font-light leading-relaxed line-clamp-2">
          "{excerpt}"
        </p>

        <div className="pt-8 flex flex-col items-center justify-center space-y-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {author}
          </p>
          <Link 
            href={`/article/${slug}`}
            className="group relative inline-flex items-center justify-center px-12 py-4 text-white overflow-hidden rounded-full border border-white/20 hover:bg-white hover:text-black hover:border-white transition-all duration-500 backdrop-blur-md"
          >
            <span className="relative z-10 font-bold tracking-[0.4em] uppercase text-[10px]">{t('readEditorial')}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
