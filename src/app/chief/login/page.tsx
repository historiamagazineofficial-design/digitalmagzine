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
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#07308D]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md px-6 z-10">
        
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-[#07308D] mb-8 shadow-2xl shadow-[#07308D]/40 group-hover:scale-105 transition-transform duration-500">
            <img src="/maink.png" alt="Icon" className="w-14 h-14 object-contain" />
          </div>
          <div className="relative h-[3rem] sm:h-[4rem] aspect-[4.5/1] mx-auto transition-all duration-300 mb-4 mt-2">
            <img src="/title .png" alt="The Inkspire" className="absolute inset-0 w-full h-full object-contain brightness-0 dark:hidden" />
            <img src="/title .png" alt="" className="absolute inset-0 w-full h-full object-contain dark:hidden" style={{ clipPath: 'inset(40% 0 0 38%)' }} />
            <img src="/title .png" alt="The Inkspire" className="absolute inset-0 w-full h-full object-contain hidden dark:block" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm tracking-[0.2em] uppercase opacity-70">Command Center Access</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-[#07308D] dark:text-[#D4AF37] uppercase tracking-widest mb-2 px-1">Identity Signature</label>
              <div className="relative">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg py-3 pl-12 pr-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#07308D] dark:focus:border-[#D4AF37] focus:ring-1 focus:ring-[#07308D] dark:focus:ring-[#D4AF37] transition-all font-sans"
                  placeholder="Admin Username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-[#07308D] dark:text-[#D4AF37] uppercase tracking-widest mb-2 px-1">Security Key</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg py-3 pl-12 pr-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#07308D] dark:focus:border-[#D4AF37] focus:ring-1 focus:ring-[#07308D] dark:focus:ring-[#D4AF37] transition-all font-sans"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 dark:text-red-400 text-xs font-bold tracking-widest uppercase text-center mt-2 animate-pulse">{error}</p>
            )}

            {/* MFA Notification (Subtle) */}
            <div className="flex items-center gap-3 py-2 px-3 bg-[#07308D]/5 border border-[#07308D]/20 rounded-lg">
              <Shield className="text-[#07308D] w-4 h-4 shrink-0" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-tighter leading-tight">Multi-factor authentication required for session initiation.</span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#07308D] hover:bg-[#07308D]/90 text-white font-bold tracking-[0.2em] py-4 rounded-lg transition-all shadow-lg shadow-[#07308D]/20 flex items-center justify-center gap-2 group mt-2"
            >
              <span>INITIATE SEQUENCE</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
            <a href="#" className="hover:text-[#07308D] dark:hover:text-[#D4AF37] transition-colors">Emergency Reset</a>
            <span className="h-1 w-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
            <a href="#" className="hover:text-[#07308D] dark:hover:text-[#D4AF37] transition-colors">Systems Status</a>
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
              src="/maink.png" 
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
