'use client';

import { usePathname, useRouter } from '@/navigation';
import { useLocale } from 'next-intl';

const LOCALES = [
  { code: 'en', label: 'EN', dir: 'ltr' },
  { code: 'ar', label: 'ع', dir: 'rtl' },
  { code: 'ml', label: 'മ', dir: 'ltr' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleSwitch = (newLocale: any) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1.5 border border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 rounded-full p-1.5 shadow-inner">
      {LOCALES.map((item) => (
        <button
          key={item.code}
          onClick={() => handleSwitch(item.code)}
          className={`w-9 h-9 rounded-full text-[10px] font-bold tracking-widest transition-all duration-500 relative flex items-center justify-center ${
            currentLocale === item.code
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-xl scale-105'
              : 'text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          {item.label}
          {currentLocale === item.code && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black dark:bg-white rounded-full"></span>
          )}
        </button>
      ))}
    </div>
  );
}
