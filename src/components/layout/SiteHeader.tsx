'use client';

import { Link } from '@/navigation';
import { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function SiteHeader() {
  const t = useTranslations('nav');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const header = headerRef.current;
    const logo = logoRef.current;
    if (!header || !logo) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;
      const isAtTop = currentScrollY < 10;

      // Header Show/Hide: hide immediately when scrolling down past 50px; always show at top
      if (isAtTop) {
        gsap.to(header, { yPercent: 0, duration: 0.35, ease: 'power3.out', overwrite: true });
      } else if (isScrollingDown && currentScrollY > 50) {
        gsap.to(header, { yPercent: -100, duration: 0.35, ease: 'power3.out', overwrite: true });
      } else if (!isScrollingDown) {
        gsap.to(header, { yPercent: 0, duration: 0.35, ease: 'power3.out', overwrite: true });
      }

      // Glassmorphism & Logo scaling: activate after just 20px of scroll
      const isScrolled = currentScrollY > 20;
      if (isScrolled) {
        gsap.to(header, { 
          backgroundColor: 'rgba(var(--background-rgb, 246, 246, 248), 0.9)',
          backdropFilter: 'blur(14px)',
          borderBottomColor: 'rgba(23, 84, 207, 0.12)',
          height: '64px',
          duration: 0.4,
          overwrite: 'auto'
        });
        gsap.to(logo, { scale: 0.78, duration: 0.4, overwrite: 'auto' });
      } else {
        gsap.to(header, { 
          backgroundColor: 'transparent',
          backdropFilter: 'blur(0px)',
          borderBottomColor: 'transparent',
          height: '80px',
          duration: 0.4,
          overwrite: 'auto'
        });
        gsap.to(logo, { scale: 1, duration: 0.4, overwrite: 'auto' });
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center h-20 border-b border-transparent transition-colors duration-300 zen-hide"
        style={{ 
          // Inject CSS variables for dark mode compatibility in GSAP
          '--header-bg-scrolled': 'rgba(var(--background-rgb, 246, 246, 248), 0.85)' 
        } as React.CSSProperties}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex justify-between items-center h-full relative">
            <div className="flex items-center gap-6">
              {/* Mobile Hamburger */}
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors group"
                aria-label="Menu"
              >
                <div className="relative w-6 h-5 flex flex-col justify-between overflow-hidden">
                  <span className="w-full h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 transform group-hover:translate-x-1"></span>
                  <span className="w-1/2 h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 delay-75"></span>
                  <span className="w-full h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 delay-150 transform group-hover:-translate-x-1"></span>
                </div>
              </button>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-8 pl-2">
                <Link href="/" className="text-[11px] font-bold tracking-[0.2em] transform uppercase hover:text-[#ec5b13] transition-colors">{t('home')}</Link>
                
                {/* Articles Dropdown */}
                <div className="relative group/nav">
                  <Link href="/archives" className="text-[11px] font-bold tracking-[0.2em] transform uppercase hover:text-[#ec5b13] transition-colors py-4">
                    {t('archives')}
                  </Link>
                  <div className="absolute top-full left-0 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform translate-y-2 group-hover/nav:translate-y-0 pt-2">
                     <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 shadow-2xl rounded-xl py-3 flex flex-col min-w-48 backdrop-blur-md">
                        {['World', 'History', 'Theology', 'Sufism', 'Kalam'].map((tag) => (
                           <Link key={tag} href={`/archives?tag=${tag}`} className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#ec5b13] transition-colors">
                              {tag}
                           </Link>
                        ))}
                     </div>
                  </div>
                </div>

                {/* Fiction Dropdown */}
                <div className="relative group/nav">
                  <Link href="/fiction" className="text-[11px] font-bold tracking-[0.2em] transform uppercase hover:text-[#ec5b13] transition-colors py-4">
                    {t('fiction')}
                  </Link>
                  <div className="absolute top-full left-0 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform translate-y-2 group-hover/nav:translate-y-0 pt-2">
                     <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 shadow-2xl rounded-xl py-3 flex flex-col min-w-48 backdrop-blur-md">
                        {['Story', 'Poem', 'Travelings', 'Literature'].map((tag) => (
                           <Link key={tag} href={`/fiction?tag=${tag}`} className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#ec5b13] transition-colors">
                              {tag}
                           </Link>
                        ))}
                     </div>
                  </div>
                </div>

                <Link href="/voices" className="text-[11px] font-bold tracking-[0.2em] transform uppercase hover:text-[#ec5b13] transition-colors">{t('voices')}</Link>
              </nav>
            </div>
            
            <div ref={logoRef} className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center origin-center">
              <Link href="/" className="text-3xl md:text-5xl font-bold tracking-tight serif-font text-black dark:text-white whitespace-nowrap lg:tracking-[-0.05em]">
                THE HI<span style={{ color: '#ec5b13' }}>S</span>TORIA
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
               <button
                 onClick={() => setSearchOpen(true)}
                 className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                 aria-label="Search"
               >
                 <Search size={16} className="text-slate-700 dark:text-slate-300" />
               </button>
               <div className="hidden md:block">
                 <LanguageSwitcher />
               </div>
               <div className="w-px h-4 bg-black/10 dark:bg-white/10 hidden md:block"></div>
               <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-md" 
          onClick={() => setMenuOpen(false)}
        ></div>
        <aside 
          className={`absolute left-0 top-0 h-full w-80 bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-16">
              <h2 className="text-3xl font-bold serif-font tracking-tight text-black dark:text-white uppercase">HISTORIA</h2>
              <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all">
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>
            <nav className="flex flex-col gap-8">
              {[
                { name: t('home'), href: '/' },
                { name: t('archives'), href: '/archives' },
                { name: t('fiction'), href: '/fiction' },
                { name: t('voices'), href: '/voices' },
              ].map((item, idx) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  onClick={() => setMenuOpen(false)} 
                  className="text-2xl font-serif font-bold group flex items-center gap-3 overflow-hidden"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <span className="w-0 group-hover:w-6 h-px bg-black dark:bg-white transition-all duration-500"></span>
                  <span className="transition-transform duration-500 group-hover:translate-x-2">{item.name}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-12">
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">Select Language</p>
               <LanguageSwitcher />
            </div>
            <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800">
               <p className="text-sm text-slate-500 mb-6 font-serif italic italic font-light leading-relaxed">
                  Curating the archives of humanity with precision and passion.
                </p>
               <Link 
                href="/admin/login" 
                onClick={() => setMenuOpen(false)} 
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em] font-black text-black dark:text-white hover:gap-4 transition-all"
              >
                {t('admin')}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Global Search Bar */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </>
  );
}
