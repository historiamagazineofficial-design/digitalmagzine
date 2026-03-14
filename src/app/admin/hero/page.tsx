'use client';

import { useState, useEffect } from 'react';
import { Save, Star, Loader2 } from 'lucide-react';
import { getHeroConfig, saveHeroConfig } from '@/lib/api';

export default function HeroConfigPage() {
  const [focusConfig, setFocusConfig] = useState({
    articleSlug: 'architecture-of-silence',
    customTitle: '',
    customExcerpt: '',
  });

  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const config = await getHeroConfig();
      setFocusConfig(config);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    const success = await saveHeroConfig(focusConfig);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <main className="px-10 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-serif font-bold">Spotlight Configuration</h2>
          <p className="text-gray-500 text-sm mt-1">Select the featured article for the homepage cinematic hero section.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded font-bold uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-colors shadow-lg"
        >
          <Save size={14} strokeWidth={3} />
          {saved ? 'Applied!' : 'Apply Spotlight'}
        </button>
      </div>

      <div className="max-w-2xl bg-white/5 border border-white/5 rounded p-8">
        <div className="flex items-center gap-3 mb-8 text-white">
          <Star size={20} fill="white" className="opacity-40" />
          <h3 className="font-serif text-xl font-bold uppercase tracking-tighter">Current Spotlight Focus</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Featured Article Slug</label>
            <input
              type="text"
              value={focusConfig.articleSlug}
              onChange={e => setFocusConfig({...focusConfig, articleSlug: e.target.value})}
              className="w-full bg-transparent border-b border-white/10 text-white pb-2 text-lg outline-none focus:border-white transition-colors placeholder-white/20 font-mono"
            />
            <p className="text-xs text-gray-500 mt-2">The article that should take precedence on the homepage.</p>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Override Title (Optional)</label>
            <input
              type="text"
              value={focusConfig.customTitle}
              onChange={e => setFocusConfig({...focusConfig, customTitle: e.target.value})}
              placeholder="Leave blank to use the article's actual title"
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded outline-none focus:border-white transition-colors placeholder-white/20 text-[11px] uppercase tracking-widest"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Override Excerpt (Optional)</label>
            <textarea
              value={focusConfig.customExcerpt}
              onChange={e => setFocusConfig({...focusConfig, customExcerpt: e.target.value})}
              placeholder="Leave blank to use the article's actual excerpt."
              rows={3}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded outline-none focus:border-white transition-colors placeholder-white/10 text-sm resize-none font-serif italic"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
