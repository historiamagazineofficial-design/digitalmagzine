'use client';

import { useState, useEffect } from 'react';
import { Save, Settings, Globe, Share2, Palette, Loader2 } from 'lucide-react';
import { getSiteSettings, saveSiteSettings } from '@/lib/api';

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'THE HISTORIA',
    description: 'A Digital Magazine exploration into the intersection of faith, art, and history.',
    contactEmail: 'editor@thehistoria.com',
    socialTwitter: '',
    socialInstagram: '',
    primaryColor: '#ec5b13',
  });

  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getSiteSettings();
      setSettings(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    const success = await saveSiteSettings(settings);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <Loader2 className="animate-spin text-white opacity-20" size={32} />
      </div>
    );
  }

  return (
    <main className="px-10 py-10">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-4">
            <Settings className="text-[#ec5b13]" size={28} />
            Site Configuration
          </h2>
          <p className="text-slate-500 text-sm mt-2 uppercase tracking-[0.2em] font-bold text-[10px]">Global Magazine Identity & Infrastructure</p>
        </div>
        <button
          onClick={handleSave}
          className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#ec5b13] hover:text-white transition-all shadow-2xl"
        >
          <Save size={16} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
          {saved ? 'Configuration Saved' : 'Update Records'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Identity */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-1 h-4 bg-[#ec5b13] rounded-full"></div>
            <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-white/50">General Identity</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2 font-bold">Site Authority Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={e => setSettings({...settings, siteName: e.target.value})}
                className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-[#ec5b13] transition-colors font-bold uppercase tracking-widest text-[11px]"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2 font-bold">Global Meta Description</label>
              <textarea
                value={settings.description}
                onChange={e => setSettings({...settings, description: e.target.value})}
                rows={4}
                className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-[#ec5b13] transition-colors resize-none text-sm font-serif leading-relaxed"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2 font-bold">Official Contact Registry</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-[#ec5b13] transition-colors font-medium"
              />
            </div>
          </div>
        </div>

        {/* Social & Palette */}
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="w-1 h-4 bg-[#ec5b13] rounded-full"></div>
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-white/50">Social Presence</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2 font-bold">Twitter X Profile</label>
                <input
                  type="text"
                  placeholder="@username"
                  value={settings.socialTwitter}
                  onChange={e => setSettings({...settings, socialTwitter: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-[#ec5b13] transition-colors font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2 font-bold">Instagram Visuals</label>
                <input
                  type="text"
                  placeholder="@username"
                  value={settings.socialInstagram}
                  onChange={e => setSettings({...settings, socialInstagram: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-[#ec5b13] transition-colors font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="w-1 h-4 bg-[#ec5b13] rounded-full"></div>
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-white/50">Brand Foundation</h3>
            </div>
            
            <div className="flex items-center gap-6 p-6 bg-black/40 border border-white/5 rounded-2xl">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={e => setSettings({...settings, primaryColor: e.target.value})}
                className="w-16 h-16 bg-transparent border-none rounded-xl cursor-pointer"
              />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-1">Primary Accent</p>
                <p className="text-xs text-[#ec5b13] font-mono font-bold">{settings.primaryColor}</p>
                <p className="text-[9px] text-slate-600 uppercase tracking-widest mt-2">Applied to buttons, links & accents</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
