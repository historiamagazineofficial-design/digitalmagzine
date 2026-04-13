'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, X, ArrowRight, Bell } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}


export default function SiteHeader() {
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
        gsap.to(header, { yPercent: 0, duration: 0.25, ease: 'power3.out', overwrite: 'auto' });
      } else if (isScrollingDown && currentScrollY > 50) {
        gsap.to(header, { yPercent: -100, duration: 0.25, ease: 'power3.out', overwrite: 'auto' });
      } else if (!isScrollingDown) {
        gsap.to(header, { yPercent: 0, duration: 0.25, ease: 'power3.out', overwrite: 'auto' });
      }

      // Glassmorphism & Logo scaling: activate after just 20px of scroll
      const isScrolled = currentScrollY > 20;
      if (isScrolled) {
        gsap.to(header, { 
          backgroundColor: 'rgba(15, 23, 42, 0.8)', // Dark Slate Translucent (Dark Mode Style)
          backdropFilter: 'blur(20px)',
          borderBottomColor: 'rgba(255, 255, 255, 0.1)',
          height: '75px',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        gsap.to(logo, { scale: 0.8, y: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        header.classList.add('header-scrolled');
      } else {
        gsap.to(header, { 
          backgroundColor: 'transparent',
          backdropFilter: 'blur(0px)',
          borderBottomColor: 'transparent',
          height: '120px',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        gsap.to(logo, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        header.classList.remove('header-scrolled');
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Secret Admin Key Combo (Ctrl + Shift + I or Cmd + Shift + I) to invisibly open admin panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        window.open('/chief', '_blank');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <header 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center h-[120px] border-b border-transparent zen-hide"
        style={{ 
          // Inject CSS variables for dark mode compatibility in GSAP
          '--header-bg-scrolled': 'rgba(var(--background-rgb, 246, 246, 248), 0.85)' 
        } as React.CSSProperties}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] items-center h-full gap-2 lg:gap-4 relative">
            {/* Left Nav */}
            <div className="flex items-center gap-2 lg:gap-6 relative z-20">
              {/* Mobile Hamburger */}
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-1.5 sm:p-2.5 bg-[#07308D]/5 dark:bg-[#07308D]/10 hover:bg-[#07308D]/15 rounded-xl transition-all group border border-[#07308D]/10"
                aria-label="Menu"
              >
                <div className="relative w-5 h-4 sm:w-6 sm:h-5 flex flex-col justify-between overflow-hidden">
                  <span className="w-full h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 transform group-hover:translate-x-1"></span>
                  <span className="w-1/2 h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 delay-75"></span>
                  <span className="w-full h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 delay-150 transform group-hover:-translate-x-1"></span>
                </div>
              </button>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-4 xl:gap-8 pl-2">
                <Link href="/" className="text-[11px] font-bold hover:text-[#07308D] transition-colors">{'Home'}</Link>
                
                {/* Articles Dropdown */}
                <div className="relative group/nav">
                  <Link href="/archives" className="text-[11px] font-bold hover:text-[#07308D] transition-colors py-4">
                    {'Articles'}
                  </Link>
                  <div className="absolute top-full left-0 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform translate-y-2 group-hover/nav:translate-y-0 pt-2">
                     <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 shadow-2xl rounded-xl py-3 flex flex-col min-w-48 backdrop-blur-md">
                        {['World', 'History', 'Theology', 'Sufism'].map((tag) => (
                           <Link key={tag} href={`/archives?tag=${tag}`} className="px-5 py-2.5 text-[10px] font-bold hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#07308D] transition-colors">
                              {tag}
                           </Link>
                        ))}
                     </div>
                  </div>
                </div>

                {/* Fiction Dropdown */}
                <div className="relative group/nav">
                  <Link href="/fiction" className="text-[11px] font-bold hover:text-[#07308D] transition-colors py-4">
                    {'Fiction'}
                  </Link>
                  <div className="absolute top-full left-0 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform translate-y-2 group-hover/nav:translate-y-0 pt-2">
                     <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 shadow-2xl rounded-xl py-3 flex flex-col min-w-48 backdrop-blur-md">
                        {['Story', 'Poem', 'Travelings', 'Literature'].map((tag) => (
                           <Link key={tag} href={`/fiction?tag=${tag}`} className="px-5 py-2.5 text-[10px] font-bold hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#07308D] transition-colors">
                              {tag}
                           </Link>
                        ))}
                     </div>
                  </div>
                </div>

                {/* Mythos Dropdown */}
                <div className="relative group/nav">
                  <Link href="/mythos" className="text-[11px] font-bold hover:text-[#07308D] transition-colors border border-black/10 dark:border-white/10 px-2 py-0.5 rounded-sm">
                    {'Mythos'}
                  </Link>
                  <div className="absolute top-full left-0 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform translate-y-2 group-hover/nav:translate-y-0 pt-2">
                     <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 shadow-2xl rounded-xl py-3 flex flex-col min-w-48 backdrop-blur-md">
                        <Link href="/mythos" className="px-5 py-2.5 text-[10px] font-bold hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#07308D] transition-colors">
                            Explore {'Mythos'}
                        </Link>
                     </div>
                  </div>
                </div>

                {/* Voices Link */}
                <div className="relative group/nav">
                  <Link href="/voices" className="text-[11px] font-bold hover:text-[#07308D] transition-colors py-4">
                    {'Voices'}
                  </Link>
                </div>
              </nav>
            </div>
            
            {/* Logo Wrapper to protect centering from GSAP */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0 z-10 pointer-events-none flex items-center justify-center">
              <div 
                ref={logoRef} 
                className="flex flex-col items-center justify-center h-[60px] lg:h-[100px] w-auto origin-center mt-0 lg:mt-[-10px]"
              >
                  <Link
                    href="/"
                    className="flex flex-col items-center justify-center pointer-events-auto group mt-2 lg:mt-0"
                  >
                  <div className="relative h-[3.25rem] sm:h-[4rem] md:h-[5rem] lg:h-[7rem] aspect-[4.5/1] transition-all duration-300">
                      {/* LIGHT MODE: Layer 1 — full image blackened */}
                      <img 
                        src="/title .png" 
                        alt="The Inkspire" 
                        className="absolute inset-0 w-full h-full object-contain brightness-0 dark:hidden"
                      />
                      {/* LIGHT MODE: Layer 2 — original blue kspire body only (below 'the') */}
                      <img 
                        src="/title .png" 
                        alt="" 
                        className="absolute inset-0 w-full h-full object-contain dark:hidden"
                        style={{ clipPath: 'inset(40% 0 0 38%)' }}
                      />
                      {/* DARK MODE: original image — white in>k + blue spire natively */}
                      <img 
                        src="/title .png" 
                        alt="The Inkspire" 
                        className="absolute inset-0 w-full h-full object-contain hidden dark:block"
                      />
                    </div>
                  </Link>
              </div>
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center justify-end gap-1.5 sm:gap-4 relative z-20">
               <button
                 onClick={() => setSearchOpen(true)}
                 className="p-1.5 sm:p-2.5 bg-[#07308D]/5 dark:bg-[#07308D]/10 hover:bg-[#07308D]/15 rounded-xl transition-all border border-[#07308D]/10 text-slate-700 dark:text-slate-300"
                 aria-label="Search"
               >
                 <Search className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
               </button>
               <NotificationCenter />
               <div className="hidden md:block">
                 
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
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#07308D] p-1.5 shadow-lg shadow-[#07308D]/20 flex items-center justify-center">
                  <img src="/maink.png" alt="Icon" className="w-full h-full object-contain" />
                </div>
                <div className="relative h-[1.5rem] aspect-[4.5/1] transition-all duration-300 ml-2">
                  <img src="/title .png" alt="The Inkspire" className="absolute inset-0 w-full h-full object-contain brightness-0 dark:hidden" />
                  <img src="/title .png" alt="" className="absolute inset-0 w-full h-full object-contain dark:hidden" style={{ clipPath: 'inset(40% 0 0 38%)' }} />
                  <img src="/title .png" alt="The Inkspire" className="absolute inset-0 w-full h-full object-contain hidden dark:block" />
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2.5 bg-[#07308D]/5 dark:bg-[#07308D]/10 hover:bg-[#07308D]/15 rounded-xl transition-all border border-[#07308D]/10">
                <X size={28} className="text-slate-900 dark:text-white" />
              </button>
            </div>
            <nav className="flex flex-col gap-8">
              {[
                { name: 'Home', href: '/' },
                { name: 'Articles', href: '/archives' },
                { name: 'Fiction', href: '/fiction' },
                { name: 'Mythos', href: '/mythos' },
                { name: 'Voices', href: '/voices' },
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
            </div>
            <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800">
               <p className="text-sm text-slate-500 mb-6 font-serif italic italic font-light leading-relaxed">
                  Curating the archives of humanity with precision and passion.
                </p>

            </div>
          </div>
        </aside>
      </div>

      {/* Global Search Bar */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </>
  );
}
