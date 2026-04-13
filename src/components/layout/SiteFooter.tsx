'use client';

import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-white dark:bg-black border-t border-black/5 dark:border-white/5 py-20 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20 items-start">
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-14 h-14 rounded-2xl bg-[#07308D] p-2 shadow-xl shadow-[#07308D]/20 flex items-center justify-center shrink-0">
                <img src="/maink.png" alt="Icon" className="w-full h-full object-contain" />
              </div>
              <div className="relative h-[2.5rem] md:h-[3rem] aspect-[4.5/1] transition-all duration-300 ml-2">
                <img src="/title .png" alt="The Inkspire" className="absolute inset-0 w-full h-full object-contain brightness-0 dark:hidden" />
                <img src="/title .png" alt="" className="absolute inset-0 w-full h-full object-contain dark:hidden" style={{ clipPath: 'inset(40% 0 0 38%)' }} />
                <img src="/title .png" alt="The Inkspire" className="absolute inset-0 w-full h-full object-contain hidden dark:block" />
              </div>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-serif italic max-w-sm leading-relaxed font-light">
              {'Curating the archives of humanity with precision and passion.'}
            </p>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-bold text-black dark:text-white">Directory</span>
              <div className="flex flex-col gap-4 text-xs font-bold text-slate-500">
                <Link className="hover:text-black dark:hover:text-white transition-colors" href="/archives">{'Articles'}</Link>
                <Link className="hover:text-black dark:hover:text-white transition-colors" href="/fiction">{'Fiction'}</Link>
                <Link className="hover:text-black dark:hover:text-white transition-colors" href="/mythos">{'Mythos'}</Link>
                <Link className="hover:text-black dark:hover:text-white transition-colors" href="/voices">{'Voices'}</Link>
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
               <span className="text-[10px] font-bold text-black dark:text-white">Legal</span>
               <div className="flex flex-col gap-4 text-xs font-bold text-slate-500">

                  <Link className="hover:text-black dark:hover:text-white transition-colors" href="#">Masthead</Link>
                  <Link className="hover:text-black dark:hover:text-white transition-colors" href="#">Privacy</Link>
                  <Link className="hover:text-black dark:hover:text-white transition-colors" href="#">Terms</Link>
               </div>
            </div>

            <div className="flex flex-col gap-6">
               <span className="text-[10px] font-bold text-black dark:text-white">Connect</span>
               <div className="flex flex-col gap-4 text-xs font-bold text-slate-500">
                  <Link className="hover:text-black dark:hover:text-white transition-colors" href="#">Contact</Link>
                  <Link className="hover:text-black dark:hover:text-white transition-colors" href="#">Submissions</Link>
                  <Link className="hover:text-black dark:hover:text-white transition-colors" href="#">Newsletter</Link>
               </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-black/5 dark:border-white/5">
          <div className="text-[10px] text-slate-400 font-bold">
            © {new Date().getFullYear()} THE INKSPIRE. {'ALL RIGHTS RESERVED.'}
          </div>
          

        </div>
      </div>
    </footer>
  );
}
