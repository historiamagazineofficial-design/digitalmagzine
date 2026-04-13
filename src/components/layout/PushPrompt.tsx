'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PushPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    // Show prompt after 5 seconds of reading
    const timer = setTimeout(() => {
      const hasSeen = localStorage.getItem('inkspire_push_prompt');
      if (!hasSeen) {
        setIsVisible(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('inkspire_push_prompt', 'dismissed');
  };

  const handleEnable = () => {
    setIsEnabling(true);
    
    // Simulate push subscription logic
    setTimeout(() => {
      setIsEnabling(false);
      setIsSuccess(true);
      localStorage.setItem('inkspire_push_prompt', 'enabled');
      
      // Auto hide after success
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-8 sm:left-auto sm:right-8 z-[60] p-0.5 bg-gradient-to-br from-[#07308D] via-[#07308D]/80 to-[#07308D]/60 rounded-[2.5rem] shadow-2xl shadow-black/40 animate-fade-in-up zen-hide">
      <div className="bg-white dark:bg-slate-950 p-8 max-w-sm rounded-[2.4rem] relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#07308D]/10 rounded-full blur-3xl"></div>
        
        <button 
          onClick={handleDismiss} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2 z-10"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col gap-6 relative z-10">
          <div className="bg-[#07308D]/10 p-4 rounded-2xl w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform">
            {isSuccess ? (
              <CheckCircle2 className="text-green-500" size={28} />
            ) : (
              <img src="/maink.png" alt="Inkspire Icon" className="w-8 h-8 object-contain" />
            )}
          </div>
          
          <div>
            <h4 className="font-serif font-bold text-2xl mb-2 tracking-tight flex items-center gap-2">
              {isSuccess ? 'You’re Connected' : 'Stay Enlightened'}
              {!isSuccess && <Sparkles size={16} className="text-[#07308D]" />}
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-sans mb-8 leading-relaxed italic">
              {isSuccess 
                ? 'Thank you for joining our intellectual sanctuary. You will receive notifications when new archives are published.'
                : 'Allow notifications to receive immediate alerts when new essays, poetry, and archives are published to the digital library.'}
            </p>
            
            {!isSuccess && (
              <div className="flex gap-4">
                <button
                  onClick={handleEnable}
                  disabled={isEnabling}
                  className="flex-1 bg-[#07308D] text-white px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] rounded-2xl hover:bg-[#07308D]/90 transition-all font-sans relative overflow-hidden group/btn disabled:opacity-50"
                >
                  {isEnabling ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Attuning...
                    </span>
                  ) : (
                    'Permit'
                  )}
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
                </button>
                <button
                  onClick={handleDismiss}
                  className="flex-1 px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all font-sans"
                >
                  Later
                </button>
              </div>
            )}
            
            {isSuccess && (
              <div className="h-1 bg-green-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-full animate-[progress_3s_linear]"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
