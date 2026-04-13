import Link from 'next/link';
import { getVoices } from '@/lib/api';
import Image from 'next/image';

interface Voice {
  id: string;
  contributor: string;
  role?: string;
  quote: string;
  imageUrl?: string;
}

export default async function VoicesSection() {
    const voices = await getVoices();
  const displayVoices = voices.slice(0, 3);

  return (
    <section className="bg-black dark:bg-[#07090F] text-white rounded-[2rem] p-12 md:p-20 mb-20 overflow-hidden relative border border-white/5 group/voices">
       <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         {/* Main atmosphere blobs */}
         <div className="absolute -top-[10%] -left-[10%] w-[80%] h-[80%] bg-[#07308D]/15 rounded-full blur-[120px] animate-fluid-blob" />
         <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-[#07308D]/10 rounded-full blur-[100px] animate-fluid-blob-slow" />
         
         {/* Moving highlight blobs */}
         <div className="absolute top-1/4 -right-[5%] w-[40%] h-[40%] bg-[#07308D]/10 rounded-full blur-[90px] animate-fluid-blob-fast" />
         <div className="absolute bottom-1/4 -left-[5%] w-[35%] h-[35%] bg-[#07308D]/5 rounded-full blur-[80px] animate-fluid-blob" />
         
         {/* Center depth */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-slate-900/40 rounded-full blur-[160px] animate-fluid-blob-slow" />
         
         {/* Grain texture for organic feel */}
         <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
       </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-end justify-between mb-20 pb-6 border-b border-white/10">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-[#07308D] mb-1">Editorial Signature</p>
            <h2 className="text-2xl md:text-3xl font-bold font-serif leading-none text-white">
              Voices
            </h2>
          </div>
          <Link
            href="/voices"
            className="hidden md:flex items-center gap-2 text-[10px] font-bold text-white/40 hover:text-white transition-colors group pb-1"
          >
            All Voices
            <span className="w-0 group-hover:w-6 h-px bg-[#07308D] transition-all duration-300" />
          </Link>
        </div>
        
        <div className="space-y-24">
          {displayVoices.map((voice: Voice) => (
            <div key={voice.id} className="flex flex-col md:flex-row gap-12 items-start group">
              <div className="flex-shrink-0 w-full md:w-48 flex flex-col items-center md:items-start text-center md:text-left">
                {voice.imageUrl && (
                  <div className="w-24 h-24 md:w-20 md:h-20 rounded-full overflow-hidden mb-4 border border-white/10 md:group-hover:border-white/30 transition-colors relative">
                    <Image src={voice.imageUrl} alt={voice.contributor} fill className="object-cover grayscale-0 md:grayscale md:group-hover:grayscale-0 transition-all duration-700" sizes="(max-width: 768px) 96px, 80px" />
                  </div>
                )}
                <h4 className="text-xl font-bold font-serif mb-1 md:group-hover:text-slate-300 transition-colors">{voice.contributor}</h4>
                <p className="text-white/30 text-[9px] font-bold mb-3">{voice.role || 'Contributor'}</p>
                <div className="h-0.5 w-12 bg-white/20 md:group-hover:w-16 transition-all duration-500"></div>
              </div>
              <div className="flex-1">
                <p className="font-serif text-3xl md:text-4xl italic leading-tight text-[#07308D] mb-8 font-medium whitespace-pre-wrap">
                  &ldquo;{voice.quote}&rdquo;
                </p>
                <div className="inline-flex items-center gap-4 text-[10px] font-bold text-white/40 md:group-hover:text-white transition-all group/link cursor-default">
                  <span>Editorial Signature</span>
                  <span className="w-8 h-[1px] bg-white/10 md:group-hover:w-12 md:group-hover:bg-white transition-all duration-300"></span>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
