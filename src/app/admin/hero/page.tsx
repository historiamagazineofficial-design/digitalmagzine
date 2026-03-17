'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Star, Loader2 } from 'lucide-react';
import { getHeroConfig, saveHeroConfig, HeroConfig } from '@/lib/api';

export default function HeroConfigPage() {
  const [focusConfig, setFocusConfig] = useState<HeroConfig>({
    articleSlug: '',
    secondarySlug: '',
    customTitle: '',
    customExcerpt: '',
  });

  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const config = await getHeroConfig();
      setFocusConfig({
        articleSlug: config.articleSlug || '',
        secondarySlug: config.secondarySlug || '',
        customTitle: config.customTitle || '',
        customExcerpt: config.customExcerpt || '',
      });
      setIsLoading(false);
    }
    load();
  }, []);

  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { success, error } = await saveHeroConfig(focusConfig);
      if (success) {
        setSaved(true);
        router.refresh(); // Clear client-side cache
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(error || 'Failed to apply changes. Please check if the slugs exist.');
      }
    } catch (err) {
      alert('Error updating configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="p-5 md:p-10 w-full max-w-[100vw] overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-serif font-bold">Homepage Featured Cover</h2>
          <p className="text-gray-500 text-sm mt-1">Select which Article or Fiction piece is displayed as the main featured cover on the Homepage.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#2E5BFF] text-white px-5 py-3 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-[#2E5BFF]/80 transition-all shadow-lg shadow-[#2E5BFF]/20 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} strokeWidth={3} />}
          {saved ? 'Changes Applied!' : isSaving ? 'Applying...' : 'Apply Selected Cover'}
        </button>
      </div>

      <div className="max-w-2xl bg-white/5 border border-white/5 rounded p-8">
        <div className="flex items-center gap-3 mb-8 text-white">
          <Star size={20} fill="white" className="opacity-40" />
          <h3 className="font-serif text-xl font-bold uppercase tracking-tighter">Current Featured Cover</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mb-3">Primary Cover (Main Slot)</label>
            <input
              type="text"
              value={focusConfig.articleSlug}
              onChange={e => setFocusConfig({...focusConfig, articleSlug: e.target.value})}
              placeholder="e.g. architecture-of-silence"
              className="w-full bg-black/40 border border-white/10 text-white px-5 py-3 text-sm outline-none focus:border-[#2E5BFF] transition-colors rounded-xl font-mono"
            />
            <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-wider">The main large article displayed on the left side of the homepage.</p>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mb-3">Secondary Feature (Right Slot)</label>
            <input
              type="text"
              value={focusConfig.secondarySlug}
              onChange={e => setFocusConfig({...focusConfig, secondarySlug: e.target.value})}
              placeholder="e.g. echoes-of-andalusia"
              className="w-full bg-black/40 border border-white/10 text-white px-5 py-3 text-sm outline-none focus:border-[#2E5BFF] transition-colors rounded-xl font-mono"
            />
            <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-wider">The smaller featured card on the right side of the homepage.</p>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mb-3">Override Title (Optional - Primary Only)</label>
            <input
              type="text"
              value={focusConfig.customTitle}
              onChange={e => setFocusConfig({...focusConfig, customTitle: e.target.value})}
              placeholder="Leave blank to use the article's actual title"
              className="w-full bg-black/40 border border-white/10 text-white px-5 py-3 text-sm outline-none focus:border-[#2E5BFF] transition-colors rounded-xl placeholder-white/10 text-[11px] uppercase tracking-widest"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mb-3">Override Excerpt (Optional - Primary Only)</label>
            <textarea
              value={focusConfig.customExcerpt}
              onChange={e => setFocusConfig({...focusConfig, customExcerpt: e.target.value})}
              placeholder="Leave blank to use the article's actual excerpt."
              rows={3}
              className="w-full bg-black/40 border border-white/10 text-white px-5 py-3 text-sm outline-none focus:border-[#2E5BFF] transition-colors rounded-xl placeholder-white/10 resize-none font-serif italic"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
