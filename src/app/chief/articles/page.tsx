'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText, PenTool, Mic2, LayoutDashboard, Tags,
  Image as ImageIcon, Star, MessageSquare, Settings,
  Plus, Eye, Edit3, Trash2, Loader2
} from 'lucide-react';

import { getAllArticles, deleteArticle, updateArticle, Article } from '@/lib/api';

const TYPE_COLORS: Record<string, string> = {
  Articles: 'bg-white/10 text-white',
  Fiction:  'bg-white/5 text-slate-300',
  Voices:   'bg-white/5 text-slate-400',
  Mythos: 'bg-[#07308D]/20 text-[#07308D]',
};

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Articles' | 'Fiction' | 'Voices' | 'Mythos'>('All');

  const fetchArticles = async () => {
    setIsLoading(true);
    const data = await getAllArticles();
    setArticles(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (slug: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const success = await deleteArticle(slug);
      if (success) {
        setArticles(prev => prev.filter(a => a.slug !== slug));
      } else {
        alert('Failed to delete entry.');
      }
    }
  };

  const handleToggleHomepage = async (slug: string, currentStatus: boolean) => {
    // Optimistic UI update could be added here, but awaiting for safety is fine
    const success = await updateArticle(slug, { showOnHomepage: !currentStatus });
    if (success) {
      setArticles(prev => prev.map(a => 
        a.slug === slug ? { ...a, showOnHomepage: !currentStatus } : a
      ));
    } else {
      alert('Failed to update homepage visibility.');
    }
  };

  const filtered = filter === 'All' ? articles : articles.filter(a => a.category === filter);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-[#07308D]" size={32} />
      </div>
    );
  }

  return (
    <main className="p-5 md:p-10 w-full max-w-[100vw]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-serif font-bold">Archives Registry</h2>
          <p className="text-slate-400 text-[9px] uppercase tracking-widest font-bold mt-1">Full inventory of all platform entries.</p>
        </div>
        <Link
          href="/chief/articles/new"
          className="flex items-center gap-2 bg-[#07308D] text-white px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-[#07308D]/80 transition-all shadow-lg shadow-[#07308D]/20"
        >
          <Plus size={14} strokeWidth={3} />
          Create New Entry
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar">
        {(['All', 'Articles', 'Fiction', 'Voices', 'Mythos'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2 rounded text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
              filter === tab
                ? 'bg-white text-black'
                : 'bg-white/5 text-slate-500 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-500 text-[10px] uppercase tracking-widest">
                <th className="px-8 py-5">Title & Taxonomy</th>
                <th className="px-8 py-5">Identity</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Homepage</th>
                <th className="px-8 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(article => (
                <tr key={article.slug} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <span className="font-serif text-base font-bold text-white group-hover:text-[#07308D] transition-colors line-clamp-1">{article.title}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${TYPE_COLORS[article.category] || TYPE_COLORS.Articles}`}>
                          {article.category}
                        </span>
                        <span className="text-[9px] text-slate-600 font-mono">/{article.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      {article.authorImage && (
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10">
                          <img src={article.authorImage} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="text-xs text-slate-400 font-medium">{article.author}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${
                      article.status === 'Published' 
                        ? 'text-green-500' 
                        : article.status?.toLowerCase().includes('fail')
                          ? 'text-red-500 font-black flex items-center gap-1'
                          : 'text-yellow-500'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button
                      onClick={() => handleToggleHomepage(article.slug, article.showOnHomepage !== false)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${article.showOnHomepage !== false ? 'bg-[#07308D]' : 'bg-slate-700'}`}
                      title={article.showOnHomepage !== false ? "Hide from Homepage" : "Show on Homepage"}
                    >
                      <span className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all ${article.showOnHomepage !== false ? 'left-[calc(100%-1.25rem)]' : 'left-1'}`}></span>
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/article/${article.slug}`} 
                        className="p-2 text-slate-500 hover:text-white bg-white/0 hover:bg-white/5 rounded-lg transition-all"
                        title="Live View"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link 
                        href={`/chief/articles/${article.slug}/edit`} 
                        className="p-2 text-slate-500 hover:text-white bg-white/0 hover:bg-white/5 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(article.slug)}
                        className="p-2 text-slate-500 hover:text-red-400 bg-white/0 hover:bg-red-400/10 rounded-lg transition-all"
                        title="Discard"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <FileText size={20} className="text-slate-600" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-600">No matching entries found in archives</p>
          </div>
        )}
      </div>
    </main>
  );
}
