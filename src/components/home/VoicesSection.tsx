import { Link } from '@/navigation';
import { getVoices } from '@/lib/api';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export default async function VoicesSection({ locale }: { locale: string }) {
  const t = await getTranslations('home.voices');
  const voices = await getVoices();
  const displayVoices = voices.slice(0, 3);

  return (
    <section className="bg-black dark:bg-slate-950 text-white rounded-[2rem] p-12 md:p-20 mb-20 overflow-hidden relative">
       {/* Background subtle texture/pattern could go here */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center gap-6 mb-20">
          <h2 className="text-2xl md:text-3xl font-bold font-serif tracking-[0.1em] capitalize leading-none">{t('title')}</h2>
          <div className="h-[1px] flex-1 bg-white/10"></div>
        </div>
        
        <div className="space-y-24">
          {displayVoices.map((voice: any, idx) => (
            <div key={voice.id} className="flex flex-col md:flex-row gap-12 items-start group">
              <div className="flex-shrink-0 w-full md:w-48 flex flex-col items-center md:items-start text-center md:text-left">
                {voice.imageUrl && (
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border border-white/10 group-hover:border-white/30 transition-colors">
                    <img src={voice.imageUrl} alt={voice.contributor} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                )}
                <h4 className="text-xl font-bold font-serif mb-1 group-hover:text-slate-300 transition-colors">{voice.contributor}</h4>
                <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em] mb-3">{voice.role || t('contributor')}</p>
                <div className="h-0.5 w-12 bg-white/20 group-hover:w-16 transition-all duration-500"></div>
              </div>
              <div className="flex-1">
                <p className="font-serif text-3xl md:text-4xl italic leading-tight text-white/90 mb-8 font-light">
                  &ldquo;{voice.quote}&rdquo;
                </p>
                <div className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-all group/link cursor-default">
                  <span>Editorial Signature</span>
                  <span className="w-8 h-[1px] bg-white/10 group-hover:w-12 group-hover:bg-white transition-all duration-300"></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 pt-12 border-t border-white/5 flex justify-center">
           <Link href="/voices" className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors">
              {t('exploreAll')}
           </Link>
        </div>
      </div>
    </section>
  );
}
