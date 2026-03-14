interface QuoteSectionProps {
  quote: string;
  attribution: string;
}

export default function QuoteSection({ quote, attribution }: QuoteSectionProps) {
  return (
    <section className="negative-space-section flex flex-col items-center justify-center text-center bg-slate-100 dark:bg-slate-900/50 rounded-2xl px-8">
      {/* Quote icon using unicode instead of material-symbols for reliability */}
      <span className="text-5xl text-[#ec5b13]/40 mb-6 leading-none font-serif select-none">&ldquo;</span>
      <blockquote className="max-w-4xl">
        <p className="text-3xl md:text-4xl font-serif italic font-light text-slate-800 dark:text-slate-200 leading-relaxed">
          {quote}
        </p>
        <cite className="block mt-8 text-xs font-bold tracking-[0.3em] uppercase text-[#ec5b13] not-italic">
          — {attribution}
        </cite>
      </blockquote>
    </section>
  );
}
