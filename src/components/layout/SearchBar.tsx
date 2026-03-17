'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
}

export default function SearchBar({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    // Close on Escape key
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const debounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div 
      className="fixed inset-0 z-[200] flex flex-col"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={onClose} />

      {/* Search Panel */}
      <div className="relative z-10 w-full max-w-3xl mx-auto mt-24 px-4">
        {/* Search Input */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-black/30 border border-black/5 dark:border-white/10 overflow-hidden">
          <div className="flex items-center gap-4 px-6 py-5 border-b border-black/5 dark:border-white/5">
            <Search size={20} className="text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, stories, voices..."
              className="flex-1 bg-transparent text-lg font-serif text-black dark:text-white outline-none placeholder-slate-400"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                <X size={18} />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg"
            >
              Esc
            </button>
          </div>

          {/* Results */}
          {query && (
            <div className="max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="w-5 h-5 border-2 border-[#2E5BFF] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : results.length > 0 ? (
                <ul className="py-3">
                  {results.map((article) => (
                    <li key={article.slug}>
                      <Link
                        href={`/article/${article.slug}`}
                        onClick={onClose}
                        className="flex items-start gap-5 px-6 py-4 hover:bg-black/3 dark:hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black bg-[#2E5BFF]/10 text-[#2E5BFF] px-2 py-0.5 rounded uppercase tracking-widest">
                              {article.category}
                            </span>
                          </div>
                          <p className="font-serif font-bold text-black dark:text-white truncate group-hover:text-[#2E5BFF] transition-colors">
                            {article.title}
                          </p>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-1 font-serif italic">
                            {article.excerpt}
                          </p>
                        </div>
                        <ArrowRight size={16} className="shrink-0 mt-1 text-slate-300 group-hover:text-[#2E5BFF] transition-colors" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-slate-400 font-serif italic text-lg">No results found for &quot;{query}&quot;</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Try a different search term</p>
                </div>
              )}
            </div>
          )}

          {!query && (
            <div className="py-8 px-6 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                Search across all articles, fiction, and voices
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
