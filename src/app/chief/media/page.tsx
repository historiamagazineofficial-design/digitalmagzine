'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Link as LinkIcon, Search, Loader2, Check, ImageIcon } from 'lucide-react';
import { getMedia, deleteMedia } from '@/lib/api';

export default function MediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const data = await getMedia();
      setMediaItems(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}`);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          alert(`Failed to upload ${file.name}: ${data.error ?? 'Unknown error'}`);
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert(`Error uploading ${file.name}`);
      }
    }

    // Reset file input and refresh list
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploadProgress(null);
    setIsUploading(false);

    // Refresh media list
    const updated = await getMedia();
    setMediaItems(updated);
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    // Replaced native window.confirm with direct deletion for better UX and testability
    // If you want confirmation, a custom Tailwind modal is highly recommended.
    try {
      setDeletingId(id);
      const success = await deleteMedia(id);
      if (success) {
        setMediaItems(items => items.filter(m => m.id !== id));
      } else {
        alert('Failed to delete asset. Please check the server logs.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An unexpected error occurred while trying to delete.');
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = mediaItems.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-5 md:p-10 w-full max-w-[100vw] overflow-hidden">
      {/* Hidden file input (accepts multiple images) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold tracking-tight">Media Library</h2>
          <p className="text-slate-500 text-sm mt-1">Manage all images and assets used across The Inkspire.</p>
        </div>
        <button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded font-bold uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all shadow-xl disabled:opacity-50"
        >
          {isUploading
            ? <Loader2 size={14} className="animate-spin" />
            : <Upload size={14} strokeWidth={3} />}
          {isUploading ? 'Uploading...' : 'Upload Asset'}
        </button>
      </div>

      {/* Upload progress banner */}
      {uploadProgress && (
        <div className="mb-6 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-300">
          <Loader2 size={14} className="animate-spin text-white" />
          {uploadProgress}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-6 mb-10">
        <div className="relative flex-1 max-w-md group">
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-white transition-all text-xs font-sans uppercase tracking-widest placeholder:text-slate-600"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={16} />
        </div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          {filtered.length} Entries found
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-slate-500" size={32} />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-slate-600 gap-4">
          <ImageIcon size={40} strokeWidth={1} />
          <p className="text-[11px] font-bold uppercase tracking-widest">No assets found</p>
          <p className="text-[10px] text-slate-700">Click &quot;Upload Asset&quot; to add your first image.</p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map(media => (
            <div
              key={media.id}
              className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/20 transition-all"
            >
              <div className="aspect-[4/3] relative flex items-center justify-center bg-black overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={media.url}
                  alt={media.name}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-[1s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest truncate mb-2 text-slate-300" title={media.name}>
                  {media.name}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-4">
                  <span>{media.size}</span>
                  <span>{media.createdAt ? new Date(media.createdAt).toLocaleDateString() : media.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(media.url, media.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-3 rounded-lg transition-colors text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white"
                  >
                    {copiedId === media.id
                      ? <Check size={12} className="text-green-500" />
                      : <LinkIcon size={12} />}
                    {copiedId === media.id ? 'Copied' : 'Copy URL'}
                  </button>
                  <button
                    onClick={() => handleDelete(media.id)}
                    disabled={deletingId === media.id}
                    className="flex items-center justify-center p-3 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors text-slate-500 disabled:opacity-50"
                  >
                    {deletingId === media.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
