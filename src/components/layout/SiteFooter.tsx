'use client';

import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-white dark:bg-black border-t border-black/5 dark:border-white/5 py-20 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20 items-start">
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div style={{ width: '3rem', height: '3rem', flexShrink: 0 }}>
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M50 80 Q30 70 12 72 L12 30 Q30 28 50 42 Z" fill="#2E5BFF" opacity="0.85" />
                  <path d="M50 80 Q70 70 88 72 L88 30 Q70 28 50 42 Z" fill="#2E5BFF" />
                  <path d="M50 8 L58 38 L54 42 L50 80 L46 42 L42 38 Z" fill="#1A1A1A" opacity="0.9" className="dark:fill-white" />
                  <circle cx="50" cy="10" r="3" fill="#1A1A1A" opacity="0.85" className="dark:fill-white" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-black tracking-[0.25em] text-[#2E5BFF] uppercase">THE</span>
                <span className="text-3xl md:text-4xl font-black tracking-tight text-black dark:text-white lg:tracking-[-0.05em]">INKSPIRE</span>
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
