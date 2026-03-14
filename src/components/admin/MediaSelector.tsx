'use client';

import { useState, useEffect } from 'react';
import { getMedia } from '@/lib/api';
import { Search, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface MediaSelectorProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function MediaSelector({ onSelect, onClose }: MediaSelectorProps) {
  const [media, setMedia] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getMedia();
      setMedia(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = media.filter(m => 
    m.name?.toLowerCase().includes(search.toLowerCase()) || 
    m.url?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div className="bg-[#121212] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-tight">Media Library Selector</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Choose an existing asset or head to the Media Library to add more.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-8 py-6 bg-white/[0.02] border-b border-white/5">
          <div className="relative group">
            <input
              type="text"
              placeholder="Filter by name or URL..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-2xl px-14 py-4 text-sm text-white outline-none focus:border-[#ec5b13] transition-all uppercase tracking-[0.2em] font-bold placeholder:text-slate-700"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#ec5b13] transition-colors" size={20} />
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 gap-4">
              <Loader2 className="animate-spin text-[#ec5b13]" size={32} />
              <p className="text-[10px] font-bold uppercase tracking-widest">Accessing Registry...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-700 gap-6">
              <ImageIcon size={64} strokeWidth={1} className="opacity-20" />
              <div className="text-center">
                <p className="font-serif italic text-2xl mb-2">The archives are empty</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">No matching assets found in your library.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filtered.map(item => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.url)}
                  className="group relative aspect-square bg-black rounded-2xl overflow-hidden border border-white/5 hover:border-[#ec5b13]/50 transition-all duration-500 shadow-lg"
                >
                  <img 
                    src={item.url} 
                    alt={item.name} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1s] ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <p className="text-[9px] font-bold text-white uppercase tracking-[0.2em] truncate">{item.name || 'Unnamed Asset'}</p>
                  </div>
                  
                  {/* Select Overlay icon */}
                  <div className="absolute top-4 right-4 bg-[#ec5b13] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100 duration-300">
                    <ImageIcon size={14} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20 flex justify-center">
           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em]">Select an image to instantly apply it to your entry.</p>
        </div>
      </div>
    </div>
  );
}
