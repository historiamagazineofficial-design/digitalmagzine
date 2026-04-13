import { getArticlesByCategory } from '@/lib/api';
import RecentPerspectives from '@/components/article/RecentPerspectives';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voices | THE INKSPIRE',
  description: 'Opinion pieces and editorial signatures from our contributing voices.',
};

export default async function VoicesPage() {
  const articles = await getArticlesByCategory('Voices');

  return (
    <main className="min-h-screen pb-24">
      {/* ── Dark Hero Header ── */}
      <section className="relative overflow-hidden bg-black text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 70% 60%, #07308D 0%, transparent 55%), radial-gradient(circle at 20% 20%, #07308D 0%, transparent 50%)',
          }}
        />
        {/* Subtle diagonal lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 py-28 md:py-36">
          <p className="text-[10px] font-bold text-[#07308D] mb-4">Editorial Signature</p>
          <h1
            className="text-5xl md:text-7xl font-bold font-serif tracking-tight leading-none mb-6 text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Voices
          </h1>
          <div className="w-16 h-1 bg-[#07308D] mb-8" />
          <p className="text-slate-300 text-lg md:text-xl font-serif italic leading-relaxed max-w-2xl font-light">
            &ldquo;The prominent contributors of our time — in their own words.&rdquo; Exploring the intersection of faith, history, and contemporary thought.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="py-12">
        {articles.length > 0 ? (
          <RecentPerspectives articles={articles} />
        ) : (
          <div className="text-center py-32 font-serif text-slate-400 italic text-2xl">
            The scrolls are silent for Voices.
          </div>
        )}
      </div>
    </main>
  );
}
