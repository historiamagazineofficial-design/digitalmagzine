'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, Fingerprint, Key, Shield, ArrowRight } from 'lucide-react';
import Image from 'next/image';

function AdminLoginContent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/chief';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push(callbackUrl);
      } else {
        setError('AUTHENTICATION FAILED. UNAUTHORIZED USER.');
      }
    } catch (err) {
      setError('SYSTEM ERROR. UNABLE TO INITIATE SEQUENCE.');
    }
  };

  return (
    <div className="font-sans bg-[#f8f6f6] dark:bg-[#0F0F0F] text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-300">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#2E5BFF]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md px-6 z-10">
        
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a3aff] to-[#2E5BFF] mb-6 shadow-2xl shadow-[#2E5BFF]/30">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
              <path d="M50 80 Q30 70 12 72 L12 30 Q30 28 50 42 Z" fill="white" opacity="0.7" />
              <path d="M50 80 Q70 70 88 72 L88 30 Q70 28 50 42 Z" fill="white" opacity="0.9" />
              <path d="M50 8 L58 38 L54 42 L50 80 L46 42 L42 38 Z" fill="white" />
              <circle cx="50" cy="10" r="3.5" fill="white" />
            </svg>
          </div>
          <div className="flex flex-col items-center leading-none mb-2">
            <span className="text-[10px] font-black tracking-[0.3em] text-[#2E5BFF] uppercase">THE</span>
            <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-900 dark:text-slate-100">INKSPIRE</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm tracking-[0.2em] uppercase opacity-70">Command Center Access</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-[#2E5BFF] dark:text-[#D4AF37] uppercase tracking-widest mb-2 px-1">Identity Signature</label>
              <div className="relative">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg py-3 pl-12 pr-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#2E5BFF] dark:focus:border-[#D4AF37] focus:ring-1 focus:ring-[#2E5BFF] dark:focus:ring-[#D4AF37] transition-all font-sans"
                  placeholder="Admin Username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-[#2E5BFF] dark:text-[#D4AF37] uppercase tracking-widest mb-2 px-1">Security Key</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg py-3 pl-12 pr-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#2E5BFF] dark:focus:border-[#D4AF37] focus:ring-1 focus:ring-[#2E5BFF] dark:focus:ring-[#D4AF37] transition-all font-sans"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 dark:text-red-400 text-xs font-bold tracking-widest uppercase text-center mt-2 animate-pulse">{error}</p>
            )}

            {/* MFA Notification (Subtle) */}
            <div className="flex items-center gap-3 py-2 px-3 bg-[#2E5BFF]/5 border border-[#2E5BFF]/20 rounded-lg">
              <Shield className="text-[#2E5BFF] w-4 h-4 shrink-0" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-tighter leading-tight">Multi-factor authentication required for session initiation.</span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#2E5BFF] hover:bg-[#2E5BFF]/90 text-white font-bold tracking-[0.2em] py-4 rounded-lg transition-all shadow-lg shadow-[#2E5BFF]/20 flex items-center justify-center gap-2 group mt-2"
            >
              <span>INITIATE SEQUENCE</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
            <a href="#" className="hover:text-[#2E5BFF] dark:hover:text-[#D4AF37] transition-colors">Emergency Reset</a>
            <span className="h-1 w-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
            <a href="#" className="hover:text-[#2E5BFF] dark:hover:text-[#D4AF37] transition-colors">Systems Status</a>
          </div>
        </div>

        {/* System Footer Info */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-800"></div>
            <span className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] font-bold">Encrypted Node 7.2.0</span>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-800"></div>
          </div>
          <div className="w-12 h-12 mx-auto opacity-30 grayscale contrast-125 relative">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBD8KEMuRQx0_rWWzNdsyFpZm9xh1uHZDgUSl1KcZGrctMGQaHhQpEsuXsR289OEXRyEWibuRiX5KA2BKiUdH5xgIn5W4hVusvmuaQ8vbUXRzEfxZjKEM9U0UO7mD5r4LNNV5M_M9IIvXI0vlgiFapxJjLg4hKyFmcTrV5eF93zmHD4eEVYoAd2FmI_F5ippJF2zfcCgbIdkIh9p03XdU4fQLRJ5BskuIebpzgzqMOD8G_Q6Wq75sagTOgf4CXCyjEZ7PRVj2r4hA4" 
              alt="The Inkspire Seal"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] overflow-hidden z-0">
        <div className="grid grid-cols-12 h-full w-full">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-r border-slate-900 dark:border-slate-100 h-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white bg-[#0f0f0f]">Loading Command Center...</div>}>
      <AdminLoginContent />
    </Suspense>
  )
}
