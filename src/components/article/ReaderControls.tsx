'use client';

import { useReader } from '@/hooks/useReader';
import { Sun, Moon, BookOpen, Minimize2, Maximize2, Type, Share2 } from 'lucide-react';

export default function ReaderControls() {
  const { theme, setTheme, zenMode, setZenMode, fontSize, setFontSize } = useReader();
  
  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-gray-200/20 dark:border-gray-800/20 px-4 py-2 rounded-full shadow-lg transition-opacity duration-300 ${zenMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
      
      {/* Theme Toggles */}
      <button 
        onClick={() => setTheme('light')}
        className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'bg-black text-white' : 'hover:bg-black/10'}`}
        title={'Light Mode'}
      >
        <Sun size={18} />
      </button>
      
      <button 
        onClick={() => setTheme('sepia')}
        className={`p-2 rounded-full transition-colors ${theme === 'sepia' ? 'bg-[#433422] text-[#F4ECD8]' : 'hover:bg-[#433422]/10 dark:hover:bg-[#433422]/50'}`}
        title={'Sepia Mode'}
      >
        <BookOpen size={18} />
      </button>

      <button 
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-white text-black' : 'hover:bg-white/10'}`}
        title={'Dark Mode'}
      >
        <Moon size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2" />

      {/* Font Size controls */}
      <div className="flex items-center gap-2 px-1">
        <button 
          onClick={() => setFontSize(Math.max(14, fontSize - 2))}
          className="p-1 hover:text-black dark:hover:text-white transition-colors"
          title={'Font Size'}
        >
          <Type size={14} />
        </button>
        <span className="text-xs font-sans w-4 text-center">{fontSize}</span>
        <button 
          onClick={() => setFontSize(Math.min(26, fontSize + 2))}
          className="p-1 hover:text-black dark:hover:text-white transition-colors"
          title={'Font Size'}
        >
          <Type size={18} />
        </button>
      </div>

      {/* Shared Space / Sharing */}
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2" />
      <button 
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: document.title,
              url: window.location.href
            }).catch(() => {});
          } else {
            // Fallback: scroll to sharing section or show a toast
            document.querySelector('aside')?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
        title={'Share Article'}
      >
        <Share2 size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2" />

      {/* Zen Mode Toggle */}
      <button 
        onClick={() => setZenMode(!zenMode)}
        className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
        title={'Zen Mode'}
      >
        {zenMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>
    </div>
  );
}
