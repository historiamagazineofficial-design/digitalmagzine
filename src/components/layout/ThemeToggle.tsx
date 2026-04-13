'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('inkspire_theme') as 'light' | 'dark';
    const initial = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="p-2.5 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
  );

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('inkspire_theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.style.colorScheme = next;
  };

  return (
    <button
      onClick={toggle}
      className="p-1.5 sm:p-2.5 rounded-xl bg-[#07308D]/5 dark:bg-[#07308D]/10 text-slate-600 dark:text-slate-300 hover:bg-[#07308D]/15 transition-all duration-300 shadow-sm border border-[#07308D]/10"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-current" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-current" />}
    </button>
  );
}
