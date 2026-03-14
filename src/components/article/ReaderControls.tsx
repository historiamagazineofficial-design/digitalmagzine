'use client';

import { useReader } from '@/hooks/useReader';
import { Sun, Moon, BookOpen, Minimize2, Maximize2, Type } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ReaderControls() {
  const { theme, setTheme, zenMode, setZenMode, fontSize, setFontSize } = useReader();
  const t = useTranslations('reader');

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-gray-200/20 dark:border-gray-800/20 px-4 py-2 rounded-full shadow-lg transition-opacity duration-300 ${zenMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
      
      {/* Theme Toggles */}
      <button 
        onClick={() => setTheme('light')}
        className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'bg-black text-white' : 'hover:bg-black/10'}`}
        title={t('light')}
      >
        <Sun size={18} />
      </button>
      
      <button 
        onClick={() => setTheme('sepia')}
        className={`p-2 rounded-full transition-colors ${theme === 'sepia' ? 'bg-[#433422] text-[#F4ECD8]' : 'hover:bg-[#433422]/10 dark:hover:bg-[#433422]/50'}`}
        title={t('sepia')}
      >
        <BookOpen size={18} />
      </button>

      <button 
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-white text-black' : 'hover:bg-white/10'}`}
        title={t('dark')}
      >
        <Moon size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2" />

      {/* Font Size controls */}
      <div className="flex items-center gap-2 px-1">
        <button 
          onClick={() => setFontSize(Math.max(14, fontSize - 2))}
          className="p-1 hover:text-black dark:hover:text-white transition-colors"
          title={t('fontSize')}
        >
          <Type size={14} />
        </button>
        <span className="text-xs font-sans w-4 text-center">{fontSize}</span>
        <button 
          onClick={() => setFontSize(Math.min(26, fontSize + 2))}
          className="p-1 hover:text-black dark:hover:text-white transition-colors"
          title={t('fontSize')}
        >
          <Type size={18} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2" />

      {/* Zen Mode Toggle */}
      <button 
        onClick={() => setZenMode(!zenMode)}
        className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
        title={t('zen')}
      >
        {zenMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>
    </div>
  );
}
