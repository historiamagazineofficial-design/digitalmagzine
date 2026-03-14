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
  Articles: 'bg-white/10 text-white',
  Fiction:  'bg-white/5 text-slate-300',
  Voices:   'bg-white/5 text-slate-400',
};

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',          href: '/admin' },
  { icon: FileText,        label: 'Articles',           href: '/admin' },
  { icon: PenTool,          label: 'New Article',        href: '/admin/articles/new' },
  { icon: Mic2,            label: 'Voices Editor',      href: '/admin/voices' },
  { icon: Star,            label: 'Dual-Feature Hero',  href: '/admin/hero' },
  { icon: Tags,            label: 'Tag Manager',        href: '/admin/tags' },
  { icon: ImageIcon,       label: 'Media Library',      href: '/admin/media' },
  { icon: MessageSquare,   label: 'Comments',           href: '/admin/comments' },
  { icon: Settings,        label: 'Site Settings',      href: '/admin/settings' },
];

export default function AdminDashboard() {
  const router   = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Articles' | 'Fiction' | 'Voices'>('All');

  useEffect(() => {
    const fetchArticles = async () => {
      const data = await getAllArticles();
      
      // Filter out mock deletions if Strapi is not enabled
      if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
        const deleted = JSON.parse(localStorage.getItem('historia_deleted_slugs') || '[]');
        const filtered = data.filter(a => !deleted.includes(a.slug));
        setArticles(filtered);
      } else {
        setArticles(data);
      }
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
    published: articles.filter(a => a.status === 'Published').length,
    drafts:    articles.filter(a => a.status === 'Draft').length,
  };


  return (
    <main className="px-10 py-10">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-serif font-bold">Content Manager</h2>
            <p className="text-slate-500 text-sm mt-1">Manage articles, fiction, and editorial voices.</p>
          </div>
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded font-bold uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-colors shadow-lg"
          >
            <Plus size={14} strokeWidth={3} />
            New Entry
          </Link>
        </div>

        {/* ── Stats Row ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {[
            { label: 'Total',      count: counts.all,      accent: 'text-white' },
            { label: 'Articles',   count: counts.articles,  accent: 'text-white/80' },
            { label: 'Fiction',    count: counts.fiction,   accent: 'text-white/60' },
            { label: 'Voices',     count: counts.voices,    accent: 'text-white/40' },
            { label: 'Published',  count: counts.published, accent: 'text-green-500' },
            { label: 'Drafts',     count: counts.drafts,    accent: 'text-slate-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 border border-white/5 rounded-xl px-5 py-4">
              <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-2">{stat.label}</p>
              <p className={`text-3xl font-serif font-bold ${stat.accent}`}>{stat.count}</p>
            </div>
          ))}
        </div>

        {/* ── Filter Tabs ──────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-6">
          {(['All', 'Articles', 'Fiction', 'Voices'] as const).map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 rounded text-[10px] font-bold uppercase tracking-[0.2em] transition-all group flex items-center gap-3 ${
                filter === tab
                  ? 'bg-white text-black font-black'
                  : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white'
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
        <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-500 text-left text-[10px] uppercase tracking-widest">
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
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                    i === filtered.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  {/* Title */}
                  <td className="px-6 py-4 font-serif font-medium max-w-[220px]">
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
                        <span key={tag} className="text-[10px] bg-white/5 text-slate-400 border border-white/10 px-2 py-0.5 rounded font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Author */}
                  <td className="px-6 py-4 text-slate-400 text-xs">{article.author}</td>

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
                    <div className="flex items-center gap-3 text-slate-500">
                      <Link href={`/en/article/${article.slug}`} className="hover:text-white transition-colors" title="Preview">
                        <Eye size={15} />
                      </Link>
                      <Link 
                        href={`/admin/articles/${article.slug}/edit`} 
                        className="hover:text-white transition-colors" 
                        title="Edit"
                      >
                        <Edit3 size={15} />
                      </Link>
                      <button 
                        onClick={(e) => handleDelete(e, article.slug)}
                        className="hover:text-red-400 transition-colors" 
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

        {/* PRD V2 Quick Links */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              href: '/admin/hero',
              icon: Star,
              title: 'Spotlight Feature',
              desc: 'Select which articles take precedence in the Gateway row.',
              color: 'text-white',
              bg: 'bg-white/5 border-white/10',
            },
            {
              href: '/admin/tags',
              icon: Tags,
              title: 'Taxonony Master',
              desc: 'Manage global filters and topic tags.',
              color: 'text-white/80',
              bg: 'bg-white/5 border-white/5',
            },
            {
              href: '/admin/voices',
              icon: Mic2,
              title: 'Voices Registry',
              desc: 'Curate editorial contributors and signature quotes.',
              color: 'text-white/60',
              bg: 'bg-white/5 border-white/5',
            },
          ].map(({ href, icon: Icon, title, desc, color, bg }) => (
            <Link
              key={title}
              href={href}
              className={`flex items-start gap-4 p-5 rounded-xl border ${bg} hover:bg-white/5 transition-all group`}
            >
              <Icon size={20} className={`${color} mt-0.5 shrink-0 group-hover:scale-110 transition-transform`} />
              <div>
                <p className={`text-sm font-bold ${color} mb-1`}>{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
  );
}
