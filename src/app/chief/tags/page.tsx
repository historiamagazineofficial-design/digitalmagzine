'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Hash, Mic2, Loader2 } from 'lucide-react';
import { getTags, saveTags } from '@/lib/api';

export default function TagManagerPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getTags();
      setTags(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const addTag = async () => {
    const formatted = `#${newTag.trim().replace(/^#/, '')}`;
    if (formatted.length > 1 && !tags.includes(formatted)) {
      const updated = [...tags, formatted];
      const success = await saveTags(updated);
      if (success) {
        setTags(updated);
        setNewTag('');
      }
    }
  };

  const removeTag = async (tag: string) => {
    const updated = tags.filter(t => t !== tag);
    const success = await saveTags(updated);
    if (success) {
      setTags(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-5 md:p-10 w-full max-w-[100vw] overflow-hidden">
      <Link href="/chief" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft size={15} /> Back to Dashboard
      </Link>

      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <Hash size={22} className="text-[#07308D]" />
          <h1 className="text-2xl font-serif font-bold">Tag Manager</h1>
        </div>
        <p className="text-slate-500 text-sm mb-10">
          Create and manage the rectangular topic tags that appear on every article card.
        </p>

        {/* Add tag */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">#</span>
            <input
              type="text"
              value={newTag}
              onChange={e => setNewTag(e.target.value.replace(/^#/, ''))}
              onKeyDown={e => e.key === 'Enter' && addTag()}
              placeholder="NewTopicTag"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-8 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#07308D] focus:ring-1 focus:ring-[#07308D] transition-all text-sm"
            />
          </div>
          <button
            onClick={addTag}
            className="flex items-center gap-2 px-5 bg-[#07308D] hover:bg-[#07308D]/80 text-white text-sm font-bold rounded-lg transition-colors"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {/* Tags list */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-4">
            Active Tags ({tags.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 text-slate-300 px-3 py-1.5 rounded font-mono group"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          {tags.length === 0 && (
            <p className="text-slate-600 text-sm">No tags yet. Add your first topic tag above.</p>
          )}
        </div>
      </div>
    </div>
  );
}
