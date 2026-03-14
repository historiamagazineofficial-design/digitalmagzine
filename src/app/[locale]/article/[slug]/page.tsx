import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReaderControls from '@/components/article/ReaderControls';
import LiteratureCircle from '@/components/article/LiteratureCircle';
import RelatedPosts from '@/components/article/RelatedPosts';
import { getArticleBySlug } from '@/lib/api';
import { ReaderProvider } from '@/hooks/useReader';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  
  const article = await getArticleBySlug(slug, locale);
  const t = await getTranslations('article');
  
  if (!article) {
    notFound();
  }
  
  return (
    <ReaderProvider>
      <article className="min-h-screen relative pb-32 pt-20">
        {/* Article Header */}
        <header className="w-full max-w-4xl mx-auto px-6 py-12 text-center zen-hide">
          <div className="mb-8 flex justify-center items-center gap-4">
             <div className="h-px w-8 bg-black/10 dark:bg-white/10"></div>
             <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
               {article.category}
             </span>
             <div className="h-px w-8 bg-black/10 dark:bg-white/10"></div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] mb-10 text-black dark:text-white tracking-tight">
            {article.title}
          </h1>

          <div className="flex flex-col items-center justify-center gap-3">
             <div className="flex items-center gap-3">
                {article.authorImage ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                    <img 
                      src={article.authorImage} 
                      alt={article.author} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    {article.author.charAt(0)}
                  </div>
                )}
                <p className="text-sm font-bold uppercase tracking-widest text-black dark:text-white">
                  {article.author}
                </p>
             </div>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <time>{article.date}</time>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span>{article.readingTime}</span>
            </div>
          </div>
        </header>

        {/* Feature Image */}
        <div className="w-full max-w-6xl mx-auto px-6 mb-20 zen-hide">
          <div className="relative aspect-[21/9] w-full bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-black/5">
            <Image 
              src={article.imageUrl} 
              alt={article.title} 
              fill 
              className="object-cover transition-transform duration-[3s] hover:scale-105"
            />
          </div>
        </div>

        {/* Article Body */}
        <div className="w-full max-w-2xl mx-auto px-6 relative">
          <div 
            className="prose prose-slate dark:prose-invert prose-lg max-w-none font-serif leading-[1.8] text-slate-800 dark:text-slate-200 mb-20"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* About Author Section */}
          {(article.authorBio || article.authorImage) && (
            <div className="mt-16 pt-12 border-t border-black/5 dark:border-white/5 zen-hide">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                {article.authorImage && (
                  <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-slate-100 dark:border-slate-800 shadow-xl shadow-black/5">
                    <img 
                      src={article.authorImage} 
                      alt={article.author} 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2 block">
                    About the Writer
                  </span>
                  <h3 className="text-xl font-bold font-serif mb-3 text-black dark:text-white">
                    {article.author}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed italic font-serif">
                    {article.authorBio || "A contributing voice for The Historia digital magazine, exploring the deep-dive narratives of history and faith."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-24 zen-hide">
           <LiteratureCircle articleSlug={slug} />
        </div>

        {/* Related Posts */}
        <RelatedPosts 
          currentSlug={slug} 
          category={article.category}
          tags={article.tags || []}
          locale={locale}
        />

        <ReaderControls />
      </article>
    </ReaderProvider>
  );
}
