import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReaderControls from '@/components/article/ReaderControls';
import LiteratureCircle from '@/components/article/LiteratureCircle';
import RelatedPosts from '@/components/article/RelatedPosts';
import ShareBar from '@/components/article/ShareBar';
import { getArticleBySlug } from '@/lib/api';
import { ReaderProvider } from '@/hooks/useReader';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const paramsData = await params;
  const slug = decodeURIComponent(paramsData.slug);
  const article = await getArticleBySlug(slug);

  if (!article) return {};

  const defaultImage = '/icon-512x512.png';
  const ogImage = article.imageUrl || defaultImage;

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.title,
      images: [ogImage],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const paramsData = await params;
  const slug = decodeURIComponent(paramsData.slug);
    
  const article = await getArticleBySlug(slug);
    
  if (!article) {
    notFound();
  }
  
  // Detect if content is Malayalam to apply correct typography even if locale is 'en'
  const isMalayalam = /[\u0D00-\u0D7F]/.test(article.title + article.content);
  const contentLanguage = isMalayalam ? 'ml' : 'en';
  
  return (
    <ReaderProvider>
      <article className="min-h-screen relative pb-32 pt-32" lang={contentLanguage}>
        {/* Article Header */}
        <header className="w-full max-w-4xl mx-auto px-6 py-12 md:py-24 flex flex-col items-start text-left">
          <div className="mb-10 flex items-center gap-4">
             <div className="h-[2px] w-12 bg-[#2E5BFF]"></div>
             <span className="text-[11px] font-bold text-[#2E5BFF]">
               {article.category}
             </span>
          </div>

          <h1 className="mb-12 text-black dark:text-white tracking-tight leading-[1.1] max-w-4xl" style={isMalayalam ? {} : { textAlign: 'left', marginLeft: 0, marginRight: 'auto' }}>
            {article.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16 w-full pt-8 border-t border-black/10 dark:border-white/10">
            <div className={`flex items-center gap-4 ${isMalayalam ? 'ml-author-pill !mr-auto !ml-0' : ''}`}>
              {article.authorImage ? (
                <div className="w-12 h-12 rounded-full overflow-hidden border border-black/5 dark:border-white/5 shrink-0 shadow-sm">
                  <img 
                    src={article.authorImage} 
                    alt={article.author} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[12px] font-bold shrink-0 shadow-sm border border-black/5 dark:border-white/5">
                  {article.author.charAt(0)}
                </div>
              )}
              <div className="flex flex-col justify-center">
                <span className="text-[9px] font-bold text-slate-400 mb-1 leading-none">Written By</span>
                <p className={isMalayalam ? "text-lg font-bold leading-none mt-1" : "text-sm font-bold text-black dark:text-white leading-none mt-1"}>
                  {article.author}
                </p>
              </div>
            </div>
            
            <div className="hidden md:block w-px h-10 bg-black/10 dark:bg-white/10"></div>
            
            <div className="flex flex-col justify-center">
              <span className="text-[9px] font-bold text-slate-400 mb-1 leading-none">Published</span>
              <div className="flex items-center gap-3 text-[11px] font-bold text-black dark:text-white mt-1">
                <time>{article.date}</time>
                <span className="w-1 h-1 rounded-full bg-[#2E5BFF]"></span>
                <span>{article.readingTime}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Feature Image */}
        <div className="w-full max-w-6xl mx-auto px-6 mb-20">
          <div className="relative aspect-[21/9] w-full bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-black/5">
            <Image 
              src={article.imageUrl || '/icon-512x512.png'} 
              alt={article.title} 
              fill 
              className="object-cover transition-transform duration-[3s] hover:scale-105"
            />
          </div>
        </div>

        {/* Article Body Section with Sidebar */}
        <div className="w-full max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Desktop Sharing Sidebar */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-40">
              <ShareBar title={article.title} slug={slug} />
            </div>
          </aside>

          {/* Body Content */}
          <div className="lg:col-span-10 xl:col-span-8 xl:col-start-2">
            <div 
              className={`prose prose-slate dark:prose-invert prose-lg max-w-none font-serif text-slate-800 dark:text-slate-200 mb-20 ${
                article.tags?.some(tag => ['poem', '#poem', 'poetry', '#poetry'].includes(tag.toLowerCase())) 
                ? 'poetry-format' 
                : ''
              } ${isMalayalam ? '' : 'leading-[1.8]'}`}
              style={{ fontSize: 'var(--reader-font-size, 1.25rem)' }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Mobile Sharing Bar (Horizontal) - Only visible when not in Zen mode */}
            <div className="lg:hidden mt-12 py-8 border-y border-black/5 dark:border-white/5">
              <ShareBar title={article.title} slug={slug} />
            </div>
            
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
                    <span className="text-[10px] font-bold text-slate-400 mb-2 block">
                      About the Writer
                    </span>
                    <h3 className="text-xl font-bold font-serif mb-3 text-black dark:text-white">
                      {article.author}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed italic font-serif">
                      {article.authorBio || "A contributing voice for The Inkspire digital magazine, exploring the deep-dive narratives of history and faith."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-24 zen-hide">
           <LiteratureCircle articleSlug={slug} />
        </div>

        {/* Related Posts */}
        <RelatedPosts 
          currentSlug={slug} 
          category={article.category}
          tags={article.tags || []}
        />

        <ReaderControls />
      </article>
    </ReaderProvider>
  );
}
