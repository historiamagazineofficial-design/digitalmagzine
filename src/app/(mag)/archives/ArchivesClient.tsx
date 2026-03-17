'use client';

import { useState } from 'react';
import ArticleCard from '@/components/article/ArticleCard';
import { Article } from '@/lib/api';

const DEFAULT_TAGS = ['All', '#History', '#QuranicStudy', '#Sufism', '#Literature', '#Poetry', '#Kalam', '#Opinion', '#Theology'];

export default function ArchivesClient({ initialArticles, customTags = [] }: { initialArticles: Article[], customTags?: string[] }) {
  const [activeTag, setActiveTag] = useState('All');
  const [limit, setLimit] = useState(6);
  
  // Combine DEFAULT_TAGS with any custom tags, making sure they are unique
  const ALL_TAGS = Array.from(new Set([...DEFAULT_TAGS, ...customTags]));
  
  const filtered = activeTag === 'All' 
    ? initialArticles
    : initialArticles.filter((a) => (a.tags?.includes(activeTag) || a.category === activeTag));

  const displayArticles = filtered.slice(0, limit);

  return (
    <>
      {/* Filter Toolbar */}
      <div className="flex items-center gap-6 border-y border-black/5 dark:border-white/5 py-6 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-widest">Filter By Topic:</span>
        <div className="flex gap-4">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setActiveTag(tag);
                setLimit(6);
              }}
              className={`text-[10px] font-bold transition-all px-4 py-2 rounded-full uppercase tracking-widest ${
                activeTag === tag
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-slate-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      {displayArticles.length > 0 ? (
        <div className="masonry-grid mt-20">
          {displayArticles.map((article) => (
            <div key={article.slug} className="masonry-item">
               <ArticleCard article={article} variant="masonry" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 border border-dashed border-black/10 dark:border-white/10 rounded-3xl mt-20">
          <p className="text-slate-400 italic font-serif text-2xl">
            {`The scrolls are silent for ${activeTag}.`}
          </p>
        </div>
      )}

      {filtered.length > limit && (
        <div className="flex justify-center mt-24">
          <button 
            onClick={() => setLimit(prev => prev + 6)}
            className="group relative px-10 py-4 overflow-hidden rounded-full border border-black/10 dark:border-white/10 text-black dark:text-white font-bold uppercase tracking-[0.3em] text-[10px] transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
          >
            <span className="relative z-10">{'Load More Records'}</span>
          </button>
        </div>
      )}
    </>
  );
}
