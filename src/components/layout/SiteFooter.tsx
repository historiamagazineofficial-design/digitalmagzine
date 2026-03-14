import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function SiteFooter() {
  const t = useTranslations('nav');
  const foot = useTranslations('home.footer');
  
  return (
    <footer className="bg-white dark:bg-black border-t border-black/5 dark:border-white/5 py-20 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20 items-start">
          <div className="lg:col-span-5">
            <Link href="/" className="text-4xl md:text-5xl font-bold font-serif tracking-tighter text-black dark:text-white uppercase mb-8 block lg:tracking-[-0.05em]">
              THE HISTORIA
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-serif italic max-w-sm leading-relaxed font-light">
              {foot('tagline')}
            </p>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black dark:text-white">Directory</span>
              <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                <Link className="hover:text-black dark:hover:text-white transition-colors" href="/archives">{t('archives')}</Link>
                <Link className="hover:text-black dark:hover:text-white transition-colors" href="/fiction">{t('fiction')}</Link>
                <Link className="hover:text-black dark:hover:text-white transition-colors" href="/voices">{t('voices')}</Link>
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black dark:text-white">Legal</span>
               <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">

                  <Link className="hover:text-black dark:hover:text-white transition-colors" href="#">Masthead</Link>
                  <Link className="hover:text-black dark:hover:text-white transition-colors" href="#">Privacy</Link>
                  <Link className="hover:text-black dark:hover:text-white transition-colors" href="#">Terms</Link>
               </div>
            </div>

            <div className="flex flex-col gap-6">
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black dark:text-white">Connect</span>
               <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <Link className="hover:text-black dark:hover:text-white transition-colors" href="#">Contact</Link>
                  <Link className="hover:text-black dark:hover:text-white transition-colors" href="#">Submissions</Link>
                  <Link className="hover:text-black dark:hover:text-white transition-colors" href="#">Newsletter</Link>
               </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-black/5 dark:border-white/5">
          <div className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} THE HISTORIA. {foot('rights')}
          </div>
          
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
             <Link href="/admin" className="hover:text-black dark:hover:text-white transition-colors">{t('admin')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
