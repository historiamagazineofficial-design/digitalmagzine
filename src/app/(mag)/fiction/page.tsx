import type { Metadata } from 'next';
import { getArticlesByCategory } from '@/lib/api';
import FictionClient from './FictionClient';

export const metadata: Metadata = {
  title: 'Fiction | THE INKSPIRE',
  description: 'Explore our curated collection of contemporary narratives, short stories, and experimental prose.',
};

export default async function FictionPage() {
  const fictionArticles = await getArticlesByCategory('Fiction');

  return (
    <main className="min-h-screen pb-24">
      {/* ── Hero Header ── */}
      <section className="relative overflow-hidden bg-black text-white">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 30%, #07308D 0%, transparent 55%), radial-gradient(circle at 10% 80%, #4a1a6b 0%, transparent 50%)',
          }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 py-28 md:py-36">
          <p className="text-[10px] font-bold text-[#07308D] mb-4">The Narrative Wing</p>
          <h1 className="text-5xl md:text-7xl font-bold font-serif tracking-tight leading-none mb-6 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            Fiction
          </h1>
          <div className="w-16 h-1 bg-[#07308D] mb-8" />
          <p className="text-slate-300 text-lg md:text-xl font-serif italic leading-relaxed max-w-2xl font-light">
            &ldquo;Fiction is the lie through which we tell the truth.&rdquo; — Explore our curated collection of contemporary narratives, short stories, and experimental prose.
          </p>
        </div>
      </section>

      {/* ── Fiction Grid ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-16">
        <FictionClient initialArticles={fictionArticles} />
      </div>
    </main>
  );
}
