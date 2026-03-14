import Image from 'next/image';
import Link from 'next/link';

export interface StoryCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
}

function StoryCard({ slug, title, excerpt, category, imageUrl }: StoryCardProps) {
  return (
    <article className="flex flex-col gap-6 group">
      <Link href={`/article/${slug}`} className="block aspect-[4/5] overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900 relative">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </Link>
      <div className="flex flex-col gap-3">
        <span className="text-[#ec5b13] text-[10px] font-bold tracking-widest uppercase">
          {category}
        </span>
        <h3 className="text-2xl font-serif font-bold leading-snug group-hover:text-[#ec5b13] transition-colors text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {excerpt}
        </p>
        <Link
          href={`/article/${slug}`}
          className="text-xs font-bold border-b border-[#1a1a1a] dark:border-white self-start pb-1 mt-2 hover:border-[#ec5b13] hover:text-[#ec5b13] transition-colors"
        >
          Read Essay
        </Link>
      </div>
    </article>
  );
}

interface StoriesGridProps {
  stories: StoryCardProps[];
}

export default function StoriesGrid({ stories }: StoriesGridProps) {
  return (
    <section className="negative-space-section border-t border-slate-200 dark:border-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        {stories.map((story) => (
          <StoryCard key={story.slug} {...story} />
        ))}
      </div>
    </section>
  );
}
