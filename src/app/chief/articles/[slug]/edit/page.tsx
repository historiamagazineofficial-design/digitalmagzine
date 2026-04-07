'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Eye, Loader2, Image as ImageIcon } from 'lucide-react';
import { getArticleBySlug, updateArticle, Article, getTags } from '@/lib/api';
import MediaSelector from '@/components/admin/MediaSelector';
import RichTextEditor from '@/components/admin/RichTextEditor';

const CONTENT_TYPES = ['Articles', 'Fiction', 'Mythos', 'Voices'];
const STATUSES = ['Draft', 'Published', 'Scheduled'];
const DEFAULT_TAGS = [
  '#QuranicStudy', '#Sufism', '#Literature', '#Theology',
  '#History', '#Poetry', '#Opinion',
];

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    type: 'Articles',
    author: '',
    authorImage: '',
    authorBio: '',
    status: 'Draft',
    imageUrl: '',
    lang: 'en',
    showOnHomepage: true,
  });
  const [tags, setTags] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mediaTarget, setMediaTarget] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([...DEFAULT_TAGS]);

  useEffect(() => {
    async function loadTags() {
      const storedTags = await getTags();
      if (storedTags && storedTags.length > 0) {
        setAvailableTags(Array.from(new Set([...DEFAULT_TAGS, ...storedTags])));
      }
    }
    loadTags();
  }, []);

  useEffect(() => {
    async function loadArticle() {
      if (!slug) return;
      const article = await getArticleBySlug(slug); // Default to en for editor
      if (article) {
        setForm({
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          type: article.category,
          author: article.author,
          authorImage: (article as any).authorImage || '',
          authorBio: (article as any).authorBio || '',
          status: article.status,
          imageUrl: article.imageUrl,
          lang: 'en',
          showOnHomepage: article.showOnHomepage !== false,
        });
        setTags(article.tags || []);
      }
      setIsLoading(false);
    }
    loadArticle();
  }, [slug]);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!form.title) {
      alert('Title is required');
      return;
    }

    setIsSaving(true);
    
    // Explicitly destructure form to ensure we send correct fields
    const { type, ...rest } = form;
    
    const success = await updateArticle(slug, {
      ...rest,
      category: type,
      tags,
    });

    if (success) {
      setSaved(true);
      setTimeout(() => {
        router.push('/chief');
        router.refresh();
      }, 1500);
    } else {
      alert('Failed to update article. Please check your connection or API token.');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-[#2E5BFF]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F0F0F] text-slate-900 dark:text-white transition-colors duration-500">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-white dark:bg-black border-b border-black/10 dark:border-white/5 p-4 md:px-8 md:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-4">
          <Link href="/chief" className="flex items-center gap-2 text-slate-500 hover:text-black dark:hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} />
            Back
          </Link>
          <div className="w-px h-4 bg-black/10 dark:bg-white/10" />
          <span className="text-sm font-serif">Edit Entry: {slug}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <select
            value={form.lang}
            onChange={(e) => handleChange('lang', e.target.value)}
            className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-slate-900 dark:text-white px-4 py-2 outline-none hover:border-[#2E5BFF] transition-colors rounded-lg cursor-pointer"
          >
            <option value="en" className="bg-white dark:bg-black text-slate-900 dark:text-white">English</option>
            <option value="ar" className="bg-white dark:bg-black text-slate-900 dark:text-white">Arabic (عربي)</option>
            <option value="ml" className="bg-white dark:bg-black text-slate-900 dark:text-white">Malayalam</option>
          </select>
          <select
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-slate-900 dark:text-white px-4 py-2 outline-none hover:border-[#2E5BFF] transition-colors rounded-lg cursor-pointer"
          >
            {STATUSES.map(s => <option key={s} value={s} className="bg-white dark:bg-black text-slate-900 dark:text-white">{s}</option>)}
          </select>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#2E5BFF] text-white px-5 py-2 text-sm font-bold uppercase tracking-wider hover:bg-[#2E5BFF]/80 transition-colors rounded-lg shadow-lg shadow-[#2E5BFF]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saved ? 'Updated!' : 'Update'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl w-full mx-auto p-4 md:p-8 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor (Left - 2 Columns) */}
        <div className="lg:col-span-2 flex flex-col gap-6 w-full max-w-full">
          <input
            type="text"
            placeholder="Article Title..."
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full bg-transparent border-b border-black/10 dark:border-white/10 text-slate-900 dark:text-white text-2xl md:text-3xl lg:text-4xl font-serif font-bold py-3 outline-none placeholder-slate-400 dark:placeholder-white/20 focus:border-[#2E5BFF] transition-colors"
          />
          <textarea
            placeholder="Write a short excerpt..."
            value={form.excerpt}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            rows={2}
            className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-700 dark:text-gray-300 px-5 py-4 text-base outline-none focus:border-[#2E5BFF] transition-colors rounded-lg resize-none font-serif placeholder-slate-400 dark:placeholder-white/20"
          />

          <RichTextEditor
            content={form.content}
            onChange={(content) => handleChange('content', content)}
          />
        </div>

        {/* Sidebar Configuration (Right - 1 Column) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 flex flex-col gap-8 shadow-xl dark:shadow-2xl backdrop-blur-sm sticky top-24">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-4 bg-[#2E5BFF] rounded-full"></div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 dark:text-white/50">Entry Configuration</h3>
            </div>

            {/* Content Type & Visibility */}
            <div className="grid grid-cols-1 gap-8 pt-4 border-t border-black/5 dark:border-white/5">
              <div className="space-y-4">
                <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Category & Section</label>
                <div className="grid grid-cols-2 gap-2">
                  {CONTENT_TYPES.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleChange('type', t)}
                      className={`py-2.5 text-[9px] font-bold rounded-lg uppercase tracking-wider border transition-all ${
                        form.type === t
                          ? 'bg-[#2E5BFF] border-[#2E5BFF] text-white shadow-lg shadow-[#2E5BFF]/20'
                          : 'bg-slate-50 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Visibility Settings</label>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl h-[90px]">
                  <div>
                    <p className="text-[10px] text-slate-900 dark:text-white uppercase tracking-widest font-bold">Show on Homepage</p>
                    <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider leading-relaxed">Featured on the main landing page.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, showOnHomepage: !prev.showOnHomepage }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${form.showOnHomepage ? 'bg-[#2E5BFF]' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <span className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all ${form.showOnHomepage ? 'left-[calc(100%-1.25rem)]' : 'left-1'}`}></span>
                  </button>
                </div>
              </div>
            </div>

            {/* Author Section */}
            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Identity & Bio</label>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  placeholder="Author name"
                  className="w-full bg-slate-50 dark:bg-black/40 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white px-4 py-3 text-sm outline-none focus:border-[#2E5BFF] transition-colors rounded-xl placeholder-slate-400 dark:placeholder-slate-700 font-medium"
                />

                <div className="group relative flex items-center bg-slate-50 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl focus-within:border-[#2E5BFF] transition-all">
                  <input
                    type="text"
                    value={form.authorImage}
                    onChange={(e) => handleChange('authorImage', e.target.value)}
                    placeholder="Author headshot URL..."
                    className="flex-1 bg-transparent text-slate-900 dark:text-white px-4 py-3 text-sm outline-none placeholder-slate-400 dark:placeholder-slate-700 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaTarget('authorImage')}
                    className="p-3 text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <ImageIcon size={16} />
                  </button>
                </div>

                <textarea
                  value={form.authorBio}
                  onChange={(e) => handleChange('authorBio', e.target.value)}
                  placeholder="A brief biography..."
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-black/40 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white px-4 py-3 text-sm outline-none focus:border-[#2E5BFF] transition-colors rounded-xl placeholder-slate-400 dark:placeholder-slate-700 resize-none font-serif leading-relaxed"
                />
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Taxonomy Tags</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setTags(prev =>
                        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                      )
                    }
                    className={`text-[9px] px-3 py-1.5 rounded-lg border font-bold uppercase transition-all ${
                      tags.includes(tag)
                        ? 'bg-[#2E5BFF]/20 border-[#2E5BFF]/50 text-[#2E5BFF]'
                        : 'bg-slate-50 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Cover Imagery */}
            <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Feature Imagery</label>
              <div className="group relative flex items-center bg-slate-50 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl focus-within:border-[#2E5BFF] transition-all">
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  placeholder="Cover image URL..."
                  className="flex-1 bg-transparent text-slate-900 dark:text-white px-4 py-3 text-sm outline-none placeholder-slate-400 dark:placeholder-slate-700 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setMediaTarget('imageUrl')}
                  className="p-3 text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                >
                  <ImageIcon size={16} />
                </button>
              </div>
              {form.imageUrl && (
                <div className="mt-4 aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/50 border border-black/10 dark:border-white/10 relative group/preview">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover/preview:scale-110 transition-transform duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute inset-x-0 bottom-0 p-3 italic text-[9px] text-white/40 font-serif">Visual Preview</div>
                </div>
              )}
            </div>
          </div>

          <Link
            href={`/article/${slug}`}
            className="group flex items-center justify-center gap-3 w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-500 dark:text-slate-400 px-5 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-slate-100 dark:hover:bg-white hover:text-black hover:border-black/20 dark:hover:border-white transition-all rounded-2xl shadow-sm dark:shadow-xl"
          >
            <Eye size={16} className="transition-transform group-hover:scale-110" />
            Launch Live Preview
          </Link>
        </div>
      </div>

      {mediaTarget && (
        <MediaSelector 
          onSelect={(url) => {
            if (mediaTarget) handleChange(mediaTarget, url);
            setMediaTarget(null);
          }}
          onClose={() => setMediaTarget(null)}
        />
      )}
    </div>
  );
}
