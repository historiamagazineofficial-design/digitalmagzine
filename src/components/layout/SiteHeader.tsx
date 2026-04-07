'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, X, ArrowRight } from 'lucide-react';

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
          backdropFilter: 'blur(12px)',
          borderBottomColor: 'rgba(23, 84, 207, 0.1)',
          height: '70px',
          duration: 0.4,
          overwrite: 'auto'
        });
        gsap.to(logo, { scale: 0.7, y: -4, duration: 0.4, overwrite: 'auto' });
      } else {
        gsap.to(header, { 
          backgroundColor: 'transparent',
          backdropFilter: 'blur(0px)',
          borderBottomColor: 'transparent',
          height: '110px',
          duration: 0.4,
          overwrite: 'auto'
        });
        gsap.to(logo, { scale: 1, y: 0, duration: 0.4, overwrite: 'auto' });
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
        className="fixed top-0 left-0 right-0 z-50 flex items-center h-[100px] border-b border-transparent zen-hide"
        style={{ 
          // Inject CSS variables for dark mode compatibility in GSAP
          '--header-bg-scrolled': 'rgba(var(--background-rgb, 246, 246, 248), 0.85)' 
        } as React.CSSProperties}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-full gap-4 relative">
            {/* Left Nav */}
            <div className="flex items-center gap-6">
              {/* Mobile Hamburger */}
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors group"
                aria-label="Menu"
              >
                <div className="relative w-6 h-5 flex flex-col justify-between overflow-hidden">
                  <span className="w-full h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 transform group-hover:translate-x-1"></span>
                  <span className="w-1/2 h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 delay-75"></span>
                  <span className="w-full h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 delay-150 transform group-hover:-translate-x-1"></span>
                </div>
              </button>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-4 xl:gap-8 pl-2">
                <Link href="/" className="text-[11px] font-bold hover:text-[#2E5BFF] transition-colors">{'Home'}</Link>
                
                {/* Articles Dropdown */}
                <div className="relative group/nav">
                  <Link href="/archives" className="text-[11px] font-bold hover:text-[#2E5BFF] transition-colors py-4">
                    {'Articles'}
                  </Link>
                  <div className="absolute top-full left-0 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform translate-y-2 group-hover/nav:translate-y-0 pt-2">
                     <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 shadow-2xl rounded-xl py-3 flex flex-col min-w-48 backdrop-blur-md">
                        {['World', 'History', 'Theology', 'Sufism'].map((tag) => (
                           <Link key={tag} href={`/archives?tag=${tag}`} className="px-5 py-2.5 text-[10px] font-bold hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#2E5BFF] transition-colors">
                              {tag}
                           </Link>
                        ))}
                     </div>
                  </div>
                </div>

                {/* Fiction Dropdown */}
                <div className="relative group/nav">
                  <Link href="/fiction" className="text-[11px] font-bold hover:text-[#2E5BFF] transition-colors py-4">
                    {'Fiction'}
                  </Link>
                  <div className="absolute top-full left-0 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform translate-y-2 group-hover/nav:translate-y-0 pt-2">
                     <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 shadow-2xl rounded-xl py-3 flex flex-col min-w-48 backdrop-blur-md">
                        {['Story', 'Poem', 'Travelings', 'Literature'].map((tag) => (
                           <Link key={tag} href={`/fiction?tag=${tag}`} className="px-5 py-2.5 text-[10px] font-bold hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#2E5BFF] transition-colors">
                              {tag}
                           </Link>
                        ))}
                     </div>
                  </div>
                </div>

                {/* Mythos Dropdown */}
                <div className="relative group/nav">
                  <Link href="/mythos" className="text-[11px] font-bold hover:text-[#2E5BFF] transition-colors border border-black/10 dark:border-white/10 px-2 py-0.5 rounded-sm">
                    {'Mythos'}
                  </Link>
                  <div className="absolute top-full left-0 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform translate-y-2 group-hover/nav:translate-y-0 pt-2">
                     <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 shadow-2xl rounded-xl py-3 flex flex-col min-w-48 backdrop-blur-md">
                        <Link href="/mythos" className="px-5 py-2.5 text-[10px] font-bold hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#2E5BFF] transition-colors">
                            Explore {'Mythos'}
                        </Link>
                     </div>
                  </div>
                </div>

                {/* Voices Link */}
                <div className="relative group/nav">
                  <Link href="/voices" className="text-[11px] font-bold hover:text-[#2E5BFF] transition-colors py-4">
                    {'Voices'}
                  </Link>
                </div>
              </nav>
            </div>
            
            <div ref={logoRef} className="flex flex-col items-center justify-center pointer-events-none px-4 h-full">
              <Link
                href="/"
                className="flex flex-col items-start whitespace-nowrap pointer-events-auto"
                style={{ lineHeight: 1, gap: 0 }}
              >
                {/* THE — Small, Montserrat Black, above "INK" */}
                <span
                  className="text-[#1A1A1A] dark:text-slate-100 transition-colors uppercase select-none"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 900,
                    fontSize: 'clamp(0.9rem, 2vw, 1.35rem)',
                    letterSpacing: '0.18em',
                    lineHeight: 1,
                    marginBottom: '0.04em',
                    paddingLeft: '0.05em',
                  }}
                >
                  THE
                </span>

                {/* INKSPIRE — original reversed-K typographic mark, unchanged */}
                <div
                  className="flex items-center font-black font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                  style={{ letterSpacing: '-0.02em', lineHeight: 1 }}
                >
                  {/* IN — Matte Black */}
                  <span className="text-[#1A1A1A] dark:text-slate-100 transition-colors">IN</span>

                  {/* Reversed K — Electric Cobalt Blue */}
                  <div
                    className="inline-flex items-center justify-center transform scale-x-[-1]"
                    style={{ height: '1em', width: '0.65em', marginLeft: '0.05em', marginRight: '0.05em' }}
                  >
                    <svg
                      viewBox="0 0 56 72"
                      aria-label="K"
                      className="h-full w-full overflow-visible"
                      fill="none"
                    >
                      <rect x="0" y="0" width="14" height="72" fill="#2E5BFF" />
                      <path d="M 14,36 L 56,0 L 56,18 L 28,42 Z" fill="#2E5BFF" />
                      <path d="M 14,36 L 56,72 L 56,54 L 28,30 Z" fill="#2E5BFF" />
                    </svg>
                  </div>

                  {/* SPIRE — Electric Cobalt Blue */}
                  <span className="text-[#2E5BFF] transition-colors">SPIRE</span>
                </div>
              </Link>
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center justify-end gap-4 relative z-20">
               <button
                 onClick={() => setSearchOpen(true)}
                 className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                 aria-label="Search"
               >
                 <Search size={16} className="text-slate-700 dark:text-slate-300" />
               </button>
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
                <div style={{ width: '2rem', height: '2rem' }}>
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M50 80 Q30 70 12 72 L12 30 Q30 28 50 42 Z" fill="#2E5BFF" opacity="0.85" />
                    <path d="M50 80 Q70 70 88 72 L88 30 Q70 28 50 42 Z" fill="#2E5BFF" />
                    <path d="M50 8 L58 38 L54 42 L50 80 L46 42 L42 38 Z" fill="#1A1A1A" opacity="0.9" />
                    <circle cx="50" cy="10" r="3" fill="#1A1A1A" opacity="0.85" />
                  </svg>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-[8px] font-black tracking-[0.25em] text-[#2E5BFF] uppercase">THE</span>
                  <span className="text-xl font-black tracking-tight text-black dark:text-white">INKSPIRE</span>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all">
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
