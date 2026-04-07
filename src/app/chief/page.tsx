'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  FileText, PenTool, Mic2, LayoutDashboard, Tags,
  Image as ImageIcon, Star, MessageSquare, Settings,
  LogOut, Plus, Eye, Edit3, Trash2, ChevronDown,
} from 'lucide-react';

import { getAllArticles, deleteArticle, Article } from '@/lib/api';

const TYPE_COLORS: Record<string, string> = {
  Articles: 'bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white',
  Fiction:  'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300',
  Voices:   'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400',
  Mythos:   'bg-[#2E5BFF]/10 text-[#2E5BFF]',
};

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',          href: '/chief' },
  { icon: FileText,        label: 'All Articles',       href: '/chief/articles' },
  { icon: PenTool,          label: 'New Article',        href: '/chief/articles/new' },
  { icon: Mic2,            label: 'Voices Editor',      href: '/chief/voices' },
  { icon: Star,            label: 'Homepage Featured',  href: '/chief/hero' },
  { icon: Tags,            label: 'Tag Manager',        href: '/chief/tags' },
  { icon: ImageIcon,       label: 'Media Library',      href: '/chief/media' },
  { icon: MessageSquare,   label: 'Comments',           href: '/chief/comments' },
  { icon: Settings,        label: 'Site Settings',      href: '/chief/settings' },
];

export default function AdminDashboard() {
  const router   = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Articles' | 'Fiction' | 'Voices' | 'Mythos'>('All');

  useEffect(() => {
    const fetchArticles = async () => {
      const data = await getAllArticles();
      setArticles(data);
      setIsLoading(false);
    };
    fetchArticles();
  }, []);

  const handleDelete = async (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const success = await deleteArticle(slug);
      if (success) {
        setArticles(prev => prev.filter(a => a.slug !== slug));
      } else {
        alert('Failed to delete entry. Check console for details.');
      }
    }
  };

  const filtered = filter === 'All' ? articles : articles.filter(a => a.category === filter);

  const counts = {
    all:      articles.length,
    articles: articles.filter(a => a.category === 'Articles').length,
    fiction:  articles.filter(a => a.category === 'Fiction').length,
    voices:   articles.filter(a => a.category === 'Voices').length,
    mythos:   articles.filter(a => a.category === 'Mythos').length,
    published: articles.filter(a => a.status === 'Published').length,
    drafts:    articles.filter(a => a.status === 'Draft').length,
  };


  return (
      <main className="p-5 md:p-10 w-full max-w-[100vw] overflow-hidden bg-slate-50 dark:bg-[#0F0F0F] min-h-screen text-slate-900 dark:text-white transition-colors duration-500">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 relative">
          <div className="absolute -top-20 -left-10 w-96 h-96 bg-[#2E5BFF]/5 dark:bg-[#2E5BFF]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-white/60">Digital Command</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 uppercase tracking-widest text-[9px] font-bold">Manage articles, fiction, and editorial voices.</p>
          </div>
          <Link
            href="/chief/articles/new"
            className="relative z-10 flex items-center gap-2 bg-gradient-to-r from-slate-900 dark:from-white to-slate-700 dark:to-slate-200 text-white dark:text-black px-6 py-3.5 rounded-lg font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          >
            <Plus size={14} strokeWidth={3} />
            New Entry
          </Link>
        </div>

        {/* ── Stats Row ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-12 relative z-10">
          {[
            { label: 'Total',      count: counts.all,      accent: 'text-slate-900 dark:text-white' },
            { label: 'Articles',   count: counts.articles,  accent: 'text-slate-800 dark:text-white/80' },
            { label: 'Fiction',    count: counts.fiction,   accent: 'text-slate-700 dark:text-white/60' },
            { label: 'Voices',     count: counts.voices,    accent: 'text-slate-600 dark:text-white/40' },
            { label: 'Mythos',     count: counts.mythos,    accent: 'text-[#2E5BFF]' },
            { label: 'Published',  count: counts.published, accent: 'text-green-600 dark:text-green-500' },
            { label: 'Drafts',     count: counts.drafts,    accent: 'text-slate-400 dark:text-slate-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white dark:bg-gradient-to-br dark:from-white/10 dark:to-transparent border border-black/5 dark:border-white/10 rounded-2xl px-6 py-5 backdrop-blur-md shadow-sm dark:shadow-xl hover:border-black/20 dark:hover:border-white/20 transition-all">
              <p className="text-slate-500 dark:text-slate-400 text-[9px] uppercase tracking-[0.2em] font-bold mb-3">{stat.label}</p>
              <p className={`text-4xl font-serif font-bold ${stat.accent}`}>{stat.count}</p>
            </div>
          ))}
        </div>

        {/* ── Filter Tabs ──────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2 w-full">
          {(['All', 'Articles', 'Fiction', 'Voices', 'Mythos'] as const).map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 rounded text-[10px] font-bold uppercase tracking-[0.2em] transition-all group flex items-center gap-3 ${
                filter === tab
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-black font-black'
                  : 'bg-white dark:bg-white/5 text-slate-500 border border-black/5 dark:border-transparent hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
              <span className={`text-[9px] font-mono opacity-40 shrink-0`}>
                ({tab === 'All' ? counts.all : counts[tab.toLowerCase() as keyof typeof counts]})
              </span>
            </button>
          ))}
        </div>

        {/* ── Articles Table ───────────────────────────────────────── */}
        <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/10 text-slate-500 text-left text-[10px] uppercase tracking-widest">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((article, i) => (
                <tr
                  key={article.slug}
                  className={`border-b border-black/5 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${
                    i === filtered.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  {/* Title */}
                  <td className="px-6 py-4 font-serif font-medium max-w-[220px] text-slate-900 dark:text-white">
                    <span className="line-clamp-2 block">{article.title}</span>
                  </td>

                  {/* Type badge */}
                  <td className="px-6 py-4">
                    <span className={`inline-block text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold ${TYPE_COLORS[article.category]}`}>
                      {article.category}
                    </span>
                  </td>

                  {/* Topic Tags */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(article.tags || []).map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-black/5 dark:border-white/10 px-2 py-0.5 rounded font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Author */}
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs font-medium">{article.author}</td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-block text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-bold ${
                      article.status === 'Published'
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {article.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-slate-500 text-xs">{article.date}</td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
                      <Link href={`/article/${article.slug}`} className="hover:text-[#2E5BFF] dark:hover:text-white transition-colors" title="Preview">
                        <Eye size={15} />
                      </Link>
                      <Link 
                        href={`/chief/articles/${article.slug}/edit`} 
                        className="hover:text-[#2E5BFF] dark:hover:text-white transition-colors" 
                        title="Edit"
                      >
                        <Edit3 size={15} />
                      </Link>
                      <button 
                        onClick={(e) => handleDelete(e, article.slug)}
                        className="hover:text-red-500 dark:hover:text-red-400 transition-colors" 
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-600">
              <FileText size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm uppercase tracking-widest">No entries found</p>
            </div>
          )}
          </div>
        </div>

        {/* PRD V2 Quick Links */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              href: '/chief/hero',
              icon: Star,
              title: 'Spotlight Feature',
              desc: 'Select which articles take precedence in the Gateway row.',
              color: 'text-slate-800 dark:text-white',
              bg: 'bg-white dark:bg-white/5 border-black/5 dark:border-white/10',
            },
            {
              href: '/chief/tags',
              icon: Tags,
              title: 'Taxonomy Master',
              desc: 'Manage global filters and topic tags.',
              color: 'text-slate-700 dark:text-white/80',
              bg: 'bg-white dark:bg-white/5 border-black/5 dark:border-white/5',
            },
            {
              href: '/chief/voices',
              icon: Mic2,
              title: 'Voices Registry',
              desc: 'Curate editorial contributors and signature quotes.',
              color: 'text-slate-600 dark:text-white/60',
              bg: 'bg-white dark:bg-white/5 border-black/5 dark:border-white/5',
            },
          ].map(({ href, icon: Icon, title, desc, color, bg }) => (
            <Link
              key={title}
              href={href}
              className={`flex items-start gap-5 p-6 rounded-2xl border ${bg} hover:border-[#2E5BFF]/30 dark:hover:border-[#2E5BFF]/50 hover:bg-[#2E5BFF]/5 transition-all group shadow-sm dark:backdrop-blur-md dark:shadow-2xl relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 dark:bg-white/5 rounded-full blur-3xl group-hover:bg-[#2E5BFF]/10 dark:group-hover:bg-[#2E5BFF]/20 transition-colors pointer-events-none"></div>
              <Icon size={24} className={`${color} mt-0.5 shrink-0 group-hover:scale-110 group-hover:text-[#2E5BFF] transition-all relative z-10`} />
              <div className="relative z-10">
                <p className={`text-base font-bold uppercase tracking-widest ${color} mb-1.5`}>{title}</p>
                <p className="text-xs text-slate-500 font-serif italic leading-relaxed">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
  );
}
