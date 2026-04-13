import { getArticlesByCategory, getTags } from '@/lib/api';
import ArchivesClient from './ArchivesClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles | THE INKSPIRE',
  description: 'A comprehensive record of scholarly depth, theological inquiry, and the currents of Islamic intellectual history.',
};

export default async function ArticlesPage() {
  const articles = await getArticlesByCategory('Articles');
  const customTags = await getTags();

  return (
    <main className="min-h-screen pb-24">
      {/* ── Hero Header ── */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #07308D 0%, transparent 60%), radial-gradient(circle at 80% 20%, #07308D 0%, transparent 50%)' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 py-28 md:py-36">
          <p className="text-[10px] font-bold text-[#07308D] mb-4">THE INKSPIRE</p>
          <h1 className="text-5xl md:text-7xl font-bold font-serif tracking-tight leading-none mb-6 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            Articles
          </h1>
          <div className="w-16 h-1 bg-[#07308D] mb-8" />
          <p className="text-slate-300 text-lg md:text-xl font-serif italic leading-relaxed max-w-2xl font-light">
            A comprehensive record of scholarly depth, theological inquiry, and the currents of Islamic intellectual history.
          </p>
        </div>
      </section>

      {/* ── Filtered Article Grid ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-16">
        <ArchivesClient initialArticles={articles} customTags={customTags} />
      </div>
    </main>
  );
}
