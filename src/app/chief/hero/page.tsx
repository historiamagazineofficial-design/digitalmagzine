'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Star, Loader2, Layout } from 'lucide-react';
import { getHeroConfig, saveHeroConfig, HeroConfig, getAllArticles, Article } from '@/lib/api';

export default function HeroConfigPage() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [focusConfig, setFocusConfig] = useState<HeroConfig>({
    articleSlug: '',
    secondarySlugs: [],
    customTitle: '',
    customExcerpt: '',
    featuredSlugs: [],
    perspectiveSlugs: [],
    fictionSlugs: [],
    articleSlugs: [],
    mythosSlugs: [],
  });
  const [searchTerm, setSearchTerm] = useState('');

  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [config, articles] = await Promise.all([
        getHeroConfig(),
        getAllArticles()
      ]);
      setFocusConfig({
        articleSlug: config.articleSlug || '',
        secondarySlugs: config.secondarySlugs || [],
        customTitle: config.customTitle || '',
        customExcerpt: config.customExcerpt || '',
        featuredSlugs: config.featuredSlugs || [],
        perspectiveSlugs: config.perspectiveSlugs || [],
        fictionSlugs: config.fictionSlugs || [],
        articleSlugs: config.articleSlugs || [],
        mythosSlugs: config.mythosSlugs || [],
      });
      setAllArticles(articles);
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
        router.refresh(); 
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

  const handleArrayChange = (field: keyof HeroConfig, value: string) => {
    const arr = value.split(',').map(s => s.trim()).filter(Boolean);
    setFocusConfig(prev => ({ ...prev, [field]: arr }));
  };

  const getTitle = (slug: string) => {
    const found = allArticles.find(a => a.slug === slug);
    return found ? found.title : null;
  };

  const SlugTitle = ({ slug, titleFallback }: { slug: string, titleFallback?: string }) => {
    const title = getTitle(slug);
    if (!title) return <span className="text-red-400">{titleFallback || 'Article not found'}</span>;
    return <span className="text-green-400 font-serif line-clamp-1">{title}</span>;
  };

  const MultiSlugTitles = ({ slugs }: { slugs: string[] }) => {
    if (!slugs || slugs.length === 0) return <span className="text-slate-500 italic">Empty list (will use latest defaults)</span>;
    return (
      <div className="flex flex-col gap-1 mt-2">
        {slugs.map((s, idx) => (
          <div key={idx} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-tight">
            <span className="text-slate-600">[{s}]</span>
            <SlugTitle slug={s} />
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-[#2E5BFF]" size={32} />
      </div>
    );
  }

  return (
    <main className="p-5 md:p-10 w-full max-w-[100vw] overflow-x-hidden">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-serif font-bold">Homepage Content Editor</h2>
          <p className="text-gray-500 text-sm mt-1">Select the exact articles to display in every specific section of the homepage.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex shrink-0 items-center gap-2 bg-[#2E5BFF] text-white px-5 py-3 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-[#2E5BFF]/80 transition-all shadow-lg shadow-[#2E5BFF]/20 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} strokeWidth={3} />}
            {saved ? 'Changes Applied!' : isSaving ? 'Applying...' : 'Apply Layout'}
          </button>
        </div>
      </div>

      {/* Quick Search Helper */}
      <div className="mb-10 bg-white/5 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white">
            <Layout size={18} className="text-[#2E5BFF]" />
            <h3 className="font-serif font-bold text-lg">Article Browser & Title Search</h3>
          </div>
          <span className="text-[9px] uppercase tracking-widest bg-[#2E5BFF]/20 text-[#2E5BFF] px-3 py-1 rounded-full font-bold">New: Search by Title</span>
        </div>
        <p className="text-gray-500 text-[11px] mb-6">Type an article title below to find its slug. You can now use either the full **Title** or the **Slug** in any of the fields below.</p>
        
        <div className="relative max-w-xl">
          <input
            type="text"
            placeholder="Search articles by title..."
            className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 text-sm outline-none focus:border-[#2E5BFF] transition-colors rounded-xl pr-24"
            onChange={(e) => {
              const term = e.target.value.toLowerCase();
              setSearchTerm(term);
            }}
          />
        </div>

        {searchTerm && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {allArticles.filter(a => a.title.toLowerCase().includes(searchTerm)).map(article => (
              <div 
                key={article.slug}
                className="bg-white/5 border border-white/10 p-3 rounded-lg cursor-pointer hover:border-[#2E5BFF] transition-all group"
                onClick={() => {
                   navigator.clipboard.writeText(article.slug);
                   alert(`Copied Slug: "${article.slug}" to clipboard. You can now paste it into any of the fields below.`);
                }}
              >
                <p className="text-white text-[11px] font-serif font-bold line-clamp-1 group-hover:text-[#2E5BFF] transition-colors">{article.title}</p>
                <p className="text-slate-500 text-[9px] font-mono mt-1">{article.slug}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
        {/* Left Column - Hero */}
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/5 rounded p-8">
            <div className="flex items-center gap-3 mb-8 text-white">
              <Star size={20} fill="white" className="opacity-40" />
              <h3 className="font-serif text-xl font-bold uppercase tracking-tighter">1. Hero Featured Section</h3>
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
                <div className="mt-2 text-[10px] font-bold uppercase tracking-tight flex items-center gap-2">
                  <span className="text-slate-500">Resolved:</span>
                  <SlugTitle slug={focusConfig.articleSlug} />
                </div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-tight flex items-center gap-2">
                  <span className="text-slate-500">Resolved:</span>
                  <SlugTitle slug={focusConfig.articleSlug} titleFallback={allArticles.find(a => a.slug === focusConfig.articleSlug)?.title} />
                </div>
                <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-wider">The main large article displayed on the left side.</p>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mb-3">Secondary Feature (Right Slot - 1 Article)</label>
                <textarea
                  value={(focusConfig.secondarySlugs || []).join(', ')}
                  onChange={e => handleArrayChange('secondarySlugs', e.target.value)}
                  placeholder="slug-or-title"
                  rows={2}
                  className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 text-sm outline-none focus:border-[#2E5BFF] transition-colors rounded-xl font-mono"
                />
                <MultiSlugTitles slugs={focusConfig.secondarySlugs || []} />
                <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-wider">The system will only display the **first** valid article from this list.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/5 rounded p-8">
            <div className="flex items-center gap-3 mb-8 text-white">
              <Layout size={20} className="opacity-40" />
              <h3 className="font-serif text-xl font-bold uppercase tracking-tighter">4. Fiction Section</h3>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mb-3">Fiction Articles (Comma-separated slugs)</label>
              <textarea
                value={(focusConfig.fictionSlugs || []).join(', ')}
                onChange={e => handleArrayChange('fictionSlugs', e.target.value)}
                placeholder="slug-1, slug-2"
                rows={2}
                className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 text-sm outline-none focus:border-[#2E5BFF] transition-colors rounded-xl placeholder-white/10 resize-none font-mono"
              />
              <MultiSlugTitles slugs={focusConfig.fictionSlugs || []} />
              <p className="text-[9px] text-slate-500 mt-3 uppercase tracking-wider">The homepage will display the **first 2** valid articles from this list. Leave blank to use latest.</p>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/5 rounded p-8">
            <div className="flex items-center gap-3 mb-8 text-white">
              <Layout size={20} className="opacity-40" />
              <h3 className="font-serif text-xl font-bold uppercase tracking-tighter">5. Mythos Section</h3>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mb-3">Mythos Articles (Comma-separated slugs)</label>
              <textarea
                value={(focusConfig.mythosSlugs || []).join(', ')}
                onChange={e => handleArrayChange('mythosSlugs', e.target.value)}
                placeholder="slug-1, slug-2"
                rows={2}
                className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 text-sm outline-none focus:border-[#2E5BFF] transition-colors rounded-xl placeholder-white/10 resize-none font-mono"
              />
              <MultiSlugTitles slugs={focusConfig.mythosSlugs || []} />
              <p className="text-[9px] text-slate-500 mt-3 uppercase tracking-wider">The homepage will display the **first 2** valid articles from this list. Leave blank to use latest.</p>
            </div>
          </div>
        </div>

        {/* Right Column - Grids */}
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/5 rounded p-8">
            <div className="flex items-center gap-3 mb-8 text-white">
              <Layout size={20} className="opacity-40" />
              <h3 className="font-serif text-xl font-bold uppercase tracking-tighter">2. Featured 4-Box Row</h3>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mb-3">4 Small Boxes (Comma-separated slugs)</label>
              <textarea
                value={(focusConfig.featuredSlugs || []).join(', ')}
                onChange={e => handleArrayChange('featuredSlugs', e.target.value)}
                placeholder="slug-1, slug-2, slug-3, slug-4"
                rows={4}
                className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 text-sm outline-none focus:border-[#2E5BFF] transition-colors rounded-xl placeholder-white/10 resize-none font-mono"
              />
              <MultiSlugTitles slugs={focusConfig.featuredSlugs || []} />
              <p className="text-[9px] text-slate-500 mt-3 uppercase tracking-wider">Specify 4 slugs here. Leave blank to default to latest available articles.</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded p-8">
            <div className="flex items-center gap-3 mb-8 text-white">
              <Layout size={20} className="opacity-40" />
              <h3 className="font-serif text-xl font-bold uppercase tracking-tighter">3. Recent Perspectives</h3>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mb-3">3 Vertical Articles (Comma-separated slugs)</label>
              <textarea
                value={(focusConfig.perspectiveSlugs || []).join(', ')}
                onChange={e => handleArrayChange('perspectiveSlugs', e.target.value)}
                placeholder="slug-1, slug-2, slug-3"
                rows={3}
                className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 text-sm outline-none focus:border-[#2E5BFF] transition-colors rounded-xl placeholder-white/10 resize-none font-mono"
              />
              <MultiSlugTitles slugs={focusConfig.perspectiveSlugs || []} />
              <p className="text-[9px] text-slate-500 mt-3 uppercase tracking-wider">Leave blank to default to the subsequent latest articles.</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded p-8">
            <div className="flex items-center gap-3 mb-8 text-white">
              <Layout size={20} className="opacity-40" />
              <h3 className="font-serif text-xl font-bold uppercase tracking-tighter">6. Main Articles Grid</h3>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mb-3">Articles Feed (Comma-separated slugs)</label>
              <textarea
                value={(focusConfig.articleSlugs || []).join(', ')}
                onChange={e => handleArrayChange('articleSlugs', e.target.value)}
                placeholder="slug-1, slug-2"
                rows={2}
                className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 text-sm outline-none focus:border-[#2E5BFF] transition-colors rounded-xl placeholder-white/10 resize-none font-mono"
              />
              <MultiSlugTitles slugs={focusConfig.articleSlugs || []} />
              <p className="text-[9px] text-slate-500 mt-3 uppercase tracking-wider">The homepage will display the **first 2** valid articles from this list. Leave blank to use latest.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
