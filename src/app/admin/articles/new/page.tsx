'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Loader2, Image as ImageIcon } from 'lucide-react';
import { createArticle, getTags } from '@/lib/api';
import MediaSelector from '@/components/admin/MediaSelector';

// PRD V2 taxonomy: Articles, Fiction, Voices
const CONTENT_TYPES = ['Articles', 'Fiction', 'Voices'];
const STATUSES = ['Draft', 'Published', 'Scheduled'];
const DEFAULT_TAGS = [
  '#QuranicStudy', '#Sufism', '#Literature', '#Theology',
  '#Kalam', '#History', '#Poetry', '#Opinion',
];

export default function NewArticlePage() {
  const router = useRouter();
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
  });
  const [tags, setTags] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!form.title) {
      alert('Title is required');
      return;
    }

    setIsSaving(true);
    
    // Auto-generate slug if not provided (Strapi usually handles this, but good for validation)
    const slug = form.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    const success = await createArticle({
      ...form,
      slug,
      tags,
      category: form.type as any, // Map 'type' to 'category' for API
      status: form.status as any,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readingTime: `${Math.ceil(form.content.split(' ').length / 200)} min read`
    });

    if (success) {
      setSaved(true);
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } else {
      alert('Failed to save article. Please check your connection or API token.');
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-black border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} />
            Back
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-sm font-serif">New Entry</span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={form.lang}
            onChange={(e) => handleChange('lang', e.target.value)}
            className="bg-white/5 border border-white/10 text-sm text-white px-4 py-2 outline-none hover:border-[#ec5b13] transition-colors rounded-lg cursor-pointer"
          >
            <option value="en" className="bg-black">English</option>
            <option value="ar" className="bg-black">Arabic (عربي)</option>
            <option value="ml" className="bg-black">Malayalam</option>
          </select>
          <select
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="bg-white/5 border border-white/10 text-sm text-white px-4 py-2 outline-none hover:border-[#ec5b13] transition-colors rounded-lg cursor-pointer"
          >
            {STATUSES.map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
          </select>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#ec5b13] text-white px-5 py-2 text-sm font-bold uppercase tracking-wider hover:bg-[#ec5b13]/80 transition-colors rounded-lg shadow-lg shadow-[#ec5b13]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-12 grid grid-cols-3 gap-8">
        {/* Editor (left) */}
        <div className="col-span-2 flex flex-col gap-6">
          <input
            type="text"
            placeholder="Article Title..."
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full bg-transparent border-b border-white/10 text-white text-4xl font-serif font-bold py-3 outline-none placeholder-white/20 focus:border-[#D4AF37] transition-colors"
          />
          <textarea
            placeholder="Write a short excerpt..."
            value={form.excerpt}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            rows={2}
            className="w-full bg-white/5 border border-white/10 text-gray-300 px-5 py-4 text-base outline-none focus:border-[#D4AF37] transition-colors rounded-sm resize-none font-serif placeholder-white/20"
          />
          <textarea
            placeholder="Start writing your article... (HTML supported)"
            value={form.content}
            onChange={(e) => handleChange('content', e.target.value)}
            rows={20}
            className="w-full bg-white/5 border border-white/10 text-gray-300 px-5 py-4 text-base outline-none focus:border-[#D4AF37] transition-colors rounded-sm resize-y font-mono text-sm leading-relaxed placeholder-white/20"
          />
        </div>

        {/* Sidebar (right) */}
        <div className="flex flex-col gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-4 bg-[#ec5b13] rounded-full"></div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white/50">Entry Configuration</h3>
            </div>

            {/* Content Type */}
            <div className="space-y-3">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Content Architecture</label>
              <div className="grid grid-cols-3 gap-2">
                {CONTENT_TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleChange('type', t)}
                    className={`py-2 text-[9px] font-bold rounded-lg uppercase tracking-wider border transition-all ${
                      form.type === t
                        ? 'bg-[#ec5b13] border-[#ec5b13] text-white shadow-lg shadow-[#ec5b13]/20'
                        : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Author Section */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Identity & Bio</label>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  placeholder="Author name"
                  className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-[#ec5b13] transition-colors rounded-xl placeholder-slate-700 font-medium"
                />

                <div className="group relative flex items-center bg-black/40 border border-white/10 rounded-xl focus-within:border-[#ec5b13] transition-all">
                  <input
                    type="text"
                    value={form.authorImage}
                    onChange={(e) => handleChange('authorImage', e.target.value)}
                    placeholder="Author headshot URL..."
                    className="flex-1 bg-transparent text-white px-4 py-3 text-sm outline-none placeholder-slate-700 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaTarget('authorImage')}
                    className="p-3 text-slate-500 hover:text-white transition-colors"
                    title="Open Media Library"
                  >
                    <ImageIcon size={16} />
                  </button>
                </div>

                <textarea
                  value={form.authorBio}
                  onChange={(e) => handleChange('authorBio', e.target.value)}
                  placeholder="Short contributor bio..."
                  rows={3}
                  className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-[#ec5b13] transition-colors rounded-xl placeholder-slate-700 resize-none font-serif leading-relaxed"
                />
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-3 pt-4 border-t border-white/5">
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
                        ? 'bg-[#ec5b13]/20 border-[#ec5b13]/50 text-[#ec5b13]'
                        : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Cover Imagery */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Feature Imagery</label>
              <div className="group relative flex items-center bg-black/40 border border-white/10 rounded-xl focus-within:border-[#ec5b13] transition-all">
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  placeholder="Cover image URL..."
                  className="flex-1 bg-transparent text-white px-4 py-3 text-sm outline-none placeholder-slate-700 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setMediaTarget('imageUrl')}
                  className="p-3 text-slate-500 hover:text-white transition-colors"
                  title="Open Media Library"
                >
                  <ImageIcon size={16} />
                </button>
              </div>
              {form.imageUrl && (
                <div className="mt-4 aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/50 border border-white/10 relative group/preview">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover/preview:scale-110 transition-transform duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute inset-x-0 bottom-0 p-3 italic text-[9px] text-white/40 font-serif">Visual Preview</div>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="group flex items-center justify-center gap-3 w-full bg-white/5 border border-white/10 text-slate-400 px-5 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black hover:border-white transition-all rounded-2xl shadow-xl"
            title="Preview Article (Sample)"
          >
            <Eye size={16} className="transition-transform group-hover:scale-110" />
            Launch Live Preview
          </button>
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
