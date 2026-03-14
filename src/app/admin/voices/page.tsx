'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mic2, Plus, Save, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { getVoices, saveVoice, deleteVoice } from '@/lib/api';
import MediaSelector from '@/components/admin/MediaSelector';

interface VoiceEntry {
  id: string;
  contributor: string;
  role: string;
  quote: string;
  imageUrl: string;
}

export default function VoicesEditorPage() {
  const [voices, setVoices] = useState<VoiceEntry[]>([]);
  const [newVoice, setNewVoice] = useState({ contributor: '', role: '', quote: '', imageUrl: '' });
  const [adding, setAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMediaSelector, setShowMediaSelector] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getVoices();
      setVoices(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const save = async () => {
    if (!newVoice.contributor || !newVoice.quote) return;
    const success = await saveVoice(newVoice);
    if (success) {
      const updatedData = await getVoices();
      setVoices(updatedData);
      setNewVoice({ contributor: '', role: '', quote: '', imageUrl: '' });
      setAdding(false);
    }
  };

  const remove = async (id: string) => {
    const success = await deleteVoice(id);
    if (success) {
      setVoices(voices.filter(v => v.id !== id));
    }
  };

  return (
    <main className="px-10 py-10">
      <Link href="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft size={15} /> Back to Dashboard
      </Link>

      <div className="max-w-3xl">
        <div className="flex items-center gap-4 mb-2">
          <Mic2 size={24} className="text-white opacity-40" />
          <h1 className="text-3xl font-serif font-bold uppercase tracking-tighter">Voices Registry</h1>
        </div>
        <p className="text-slate-500 text-[11px] uppercase tracking-[0.2em] font-medium mb-12">
          CURATE EDITORIAL CONTRIBUTORS — SIGNATURE QUOTES & HEADSHOTS.
        </p>

        {/* Voices List */}
        <div className="space-y-4 mb-6">
          {voices.map(voice => (
            <div key={voice.id} className="flex gap-5 items-start p-5 bg-white/[0.03] border border-white/5 rounded-xl group hover:border-white/10 transition-all">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-800 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={voice.imageUrl} alt={voice.contributor} className="w-full h-full object-cover" />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm">{voice.contributor}</p>
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">{voice.role}</p>
                <p className="text-slate-300 text-sm italic font-serif leading-relaxed">
                  &ldquo;{voice.quote}&rdquo;
                </p>
              </div>
              {/* Actions */}
              <button
                onClick={() => remove(voice.id)}
                className="text-slate-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Add new voice */}
        {adding ? (
          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl space-y-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-4 bg-[#ec5b13] rounded-full"></div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 font-bold">New Registry Entry</p>
            </div>
            
            <div className="grid gap-6">
              {[
                { key: 'contributor', label: 'Contributor Name', placeholder: 'e.g. Dr. Ahmad Kareem' },
                { key: 'role',        label: 'Role / Title',      placeholder: 'e.g. Theologian & Scholar' },
                { key: 'imageUrl',    label: 'Headshot URL',      placeholder: 'https://...', isImage: true },
              ].map(field => (
                <div key={field.key} className="space-y-2">
                  <label className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold font-sans">{field.label}</label>
                  <div className={`flex items-center bg-black/40 border border-white/10 rounded-xl focus-within:border-[#ec5b13] transition-all ${field.isImage ? 'pr-1' : ''}`}>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={(newVoice as Record<string, string>)[field.key]}
                      onChange={e => setNewVoice({ ...newVoice, [field.key]: e.target.value })}
                      className="flex-1 bg-transparent px-4 py-3.5 text-white text-sm outline-none placeholder-slate-700 transition-all uppercase tracking-widest text-[10px] font-bold"
                    />
                    {field.isImage && (
                      <button
                        type="button"
                        onClick={() => setShowMediaSelector(true)}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-slate-400 hover:text-white"
                        title="Select from Media Library"
                      >
                        <ImageIcon size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="space-y-2">
                <label className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold">Signature Quote</label>
                <textarea
                  rows={3}
                  placeholder="The voice's defining statement..."
                  value={newVoice.quote}
                  onChange={e => setNewVoice({ ...newVoice, quote: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white text-sm placeholder-slate-700 focus:outline-none focus:border-[#ec5b13] transition-all resize-none italic font-serif leading-relaxed"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={save}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded text-[10px] font-bold uppercase tracking-widest transition-colors shadow-lg"
              >
                <Save size={14} strokeWidth={3} /> Save Voice
              </button>
              <button
                onClick={() => setAdding(false)}
                className="text-slate-500 hover:text-white text-xs uppercase tracking-wider transition-colors px-3"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 w-full justify-center py-4 border border-dashed border-white/10 rounded-xl text-slate-500 hover:text-white hover:border-white/20 transition-all text-sm"
          >
            <Plus size={16} /> Add New Voice
          </button>
        )}
      </div>

      {showMediaSelector && (
        <MediaSelector 
          onSelect={(url) => {
            setNewVoice({ ...newVoice, imageUrl: url });
            setShowMediaSelector(false);
          }}
          onClose={() => setShowMediaSelector(false)}
        />
      )}
    </main>
  );
}
