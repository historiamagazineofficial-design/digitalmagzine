'use client';

import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PushPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('notifications');

  useEffect(() => {
    // Show prompt after 5 seconds of reading
    const timer = setTimeout(() => {
      const hasSeen = localStorage.getItem('historia_push_prompt');
      if (!hasSeen) {
        setIsVisible(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('historia_push_prompt', 'dismissed');
  };

  const handleEnable = () => {
    alert("Push notifications enabled!");
    setIsVisible(false);
    localStorage.setItem('historia_push_prompt', 'enabled');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[60] bg-black text-white p-8 max-w-sm rounded-3xl shadow-2xl shadow-black/40 border border-white/10 animate-fade-in-up zen-hide">
      <button onClick={handleDismiss} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-2">
        <X size={20} />
      </button>

      <div className="flex flex-col gap-6">
        <div className="bg-white/10 p-4 rounded-2xl h-min w-min">
          <Bell className="text-white" size={24} />
        </div>
        <div>
          <h4 className="font-serif font-bold text-2xl mb-2 tracking-tight">{t('title')}</h4>
          <p className="text-white/60 text-sm font-sans mb-8 leading-relaxed italic">
            {t('description')}
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleEnable}
              className="flex-1 bg-white text-black px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white/90 transition-all font-sans"
            >
              {t('allow')}
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all font-sans"
            >
              {t('later')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
