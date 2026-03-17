'use client';

import { useState } from 'react';
import ArticleCard from '@/components/article/ArticleCard';
import { Article } from '@/lib/api';

const FICTION_GENRES = ['All', '#Poetry', '#Literature', '#Stories'];

export default function FictionClient({ initialArticles }: { initialArticles: Article[] }) {
  const [activeGenre, setActiveGenre] = useState('All');
  const [limit, setLimit] = useState(6);
  
  const filtered = activeGenre === 'All'
    ? initialArticles
    : initialArticles.filter(a => a.tags?.includes(activeGenre) || a.category === activeGenre.replace('#', ''));

  const displayArticles = filtered.slice(0, limit);

  return (
    <>
      {/* Filter Toolbar */}
      <div className="flex items-center gap-6 border-y border-black/5 dark:border-white/5 py-6 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 shrink-0">Genre:</span>
        <div className="flex gap-4">
          {FICTION_GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                setActiveGenre(genre);
                setLimit(6);
              }}
              className={`text-[10px] font-bold uppercase tracking-widest transition-all px-4 py-2 rounded-full ${
                activeGenre === genre
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-slate-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      {displayArticles.length > 0 ? (
        <div className="masonry-grid mt-12">
          {displayArticles.map((article) => (
            <div key={article.slug} className="masonry-item">
              <ArticleCard article={article} variant="masonry" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 border border-dashed border-black/10 dark:border-white/10 rounded-3xl mt-12">
          <p className="text-slate-400 italic font-serif text-2xl">
            No stories found for {activeGenre}.
          </p>
        </div>
      )}

      {filtered.length > limit && (
        <div className="flex justify-center mt-24">
          <button 
            onClick={() => setLimit(prev => prev + 6)}
            className="group relative px-10 py-4 overflow-hidden rounded-full border border-black/10 dark:border-white/10 text-black dark:text-white font-bold uppercase tracking-[0.3em] text-[10px] transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
          >
            <span className="relative z-10">{'Load More Chapters'}</span>
          </button>
        </div>
      )}
    </>
  );
}
