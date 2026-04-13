'use client';

import ArticleCard from './ArticleCard';
import { Article } from '@/lib/api';
import Link from 'next/link';

interface RecentPerspectivesProps {
  articles: Article[];
  locale?: string;
}

export default function RecentPerspectives({ articles }: RecentPerspectivesProps) {
  if (!articles || articles.length === 0) return null;
  
  return (
    <section className="bg-slate-50 dark:bg-slate-900/20 rounded-[2rem] px-8 py-16 mb-24 border border-black/20 dark:border-white/10 shadow-sm dark:shadow-none">
      {/* Editorial Section Header */}
      <div className="flex items-end justify-between mb-12 pb-6 border-b-2 border-black/10 dark:border-white/5">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-[#07308D] dark:text-[#07308D]/80 mb-2">Latest Dispatches</p>
          <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-tight leading-none text-black dark:text-slate-200">
            Recent Perspectives
          </h2>
        </div>
        <Link
          href="/archives"
          className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-black dark:hover:text-slate-200 transition-colors group pb-1"
        >
          View All
          <span className="w-0 group-hover:w-6 h-px bg-[#07308D] transition-all duration-300" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} variant="grid" />
        ))}
      </div>
    </section>
  );
}
