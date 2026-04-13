import { getArticlesByCategory } from '@/lib/api';
import ArchivesClient from '../archives/ArchivesClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mythos | THE INKSPIRE',
  description: 'The greatest works by legendary poets, writers, and scholars — myths, epics, and timeless tales preserved for eternity.',
};

export default async function MythosPage() {
  const mythosArticles = await getArticlesByCategory('Mythos');
  const legacyArticles = await getArticlesByCategory('Legendary');
  const articles = [...mythosArticles, ...legacyArticles];
  const tags = Array.from(new Set(articles.flatMap(a => a.tags || [])));

  return (
    <main className="min-h-screen pb-24">
      {/* ── Dark Hero Header ── */}
      <section className="relative overflow-hidden bg-black text-white">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 70%, #7c3aed 0%, transparent 55%), radial-gradient(circle at 90% 10%, #07308D 0%, transparent 45%)',
          }}
        />
        {/* Star-field effect */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 py-28 md:py-36">
          <p className="text-[10px] font-bold text-[#07308D] mb-4">Legends & Epics</p>
          <h1
            className="text-5xl md:text-7xl font-bold font-serif tracking-tight leading-none mb-6 text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Mythos
          </h1>
          <div className="w-16 h-1 bg-[#07308D] mb-8" />
          <p className="text-slate-300 text-lg md:text-xl font-serif italic leading-relaxed max-w-2xl font-light">
            The greatest works by legendary poets, writers, and scholars — myths, epics, and timeless tales preserved for eternity.
          </p>
        </div>
      </section>

      {/* ── Filtered Grid ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-16">
        <ArchivesClient initialArticles={articles} customTags={tags} />
      </div>
    </main>
  );
}
