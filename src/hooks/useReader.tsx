'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type ReadingTheme = 'light' | 'dark' | 'sepia';

interface ReaderContextType {
  theme: ReadingTheme;
  setTheme: (theme: ReadingTheme) => void;
  zenMode: boolean;
  setZenMode: (active: boolean) => void;
  fontSize: number; // base font size in px
  setFontSize: (size: number) => void;
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export function ReaderProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ReadingTheme>('light');
  const [zenMode, setZenModeState] = useState(false);
  const [fontSize, setFontSizeState] = useState(18);

  const setTheme = (newTheme: ReadingTheme) => {
    setThemeState(newTheme);
    const root = document.documentElement;
    root.classList.toggle('dark', newTheme === 'dark');
    root.classList.toggle('sepia', newTheme === 'sepia');
    root.style.colorScheme = newTheme === 'dark' ? 'dark' : 'light';
  };

  const setZenMode = (active: boolean) => {
    setZenModeState(active);
    if (active) {
      document.body.classList.add('zen-active');
    } else {
      document.body.classList.remove('zen-active');
    }
  };

  // Mount logic to read preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('inkspire_theme') as ReadingTheme;
    const isGlobalDark = document.documentElement.classList.contains('dark');
    
    if (savedTheme && savedTheme !== theme) {
      setTheme(savedTheme);
    } else if (isGlobalDark && theme !== 'dark') {
      setTheme('dark');
    }
  }, []);

  // Sync theme
  useEffect(() => {
    localStorage.setItem('inkspire_theme', theme);
  }, [theme]);

  // Handle escape key to exit Zen Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zenMode) {
        setZenMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zenMode]);

  // Sync fontSize to DOM custom property so CSS var(--reader-font-size) updates live
  useEffect(() => {
    document.documentElement.style.setProperty('--reader-font-size', `${fontSize}px`);
  }, [fontSize]);

  return (
    <ReaderContext.Provider
      value={{
        theme,
        setTheme,
        zenMode,
        setZenMode,
        fontSize,
        setFontSize: setFontSizeState,
      }}
    >
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const context = useContext(ReaderContext);
  if (context === undefined) {
    throw new Error('useReader must be used within a ReaderProvider');
  }
  return context;
}
