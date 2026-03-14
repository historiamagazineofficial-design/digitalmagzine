import Image from 'next/image';

interface FeaturedPortraitProps {
  label: string;
  title: string;
  description: string;
  authorName: string;
  authorRole: string;
  authorAvatarUrl: string;
  portraitUrl: string;
}

export default function FeaturedPortrait({
  label, title, description, authorName, authorRole, authorAvatarUrl, portraitUrl,
}: FeaturedPortraitProps) {
  return (
    <section className="negative-space-section grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      {/* Text Content */}
      <div className="order-2 lg:order-1 flex flex-col gap-8">
        <span className="text-[#ec5b13] text-[10px] font-black tracking-[0.3em] uppercase">
          {label}
        </span>
        <h2 className="text-5xl font-serif font-bold leading-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>

        {/* Author badge */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden relative shrink-0">
            <Image src={authorAvatarUrl} alt={authorName} fill className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {authorName}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-widest">{authorRole}</p>
          </div>
        </div>

        <a
          href="#"
          className="inline-block px-10 py-4 bg-[#1a1a1a] dark:bg-white dark:text-[#1a1a1a] text-white text-xs font-bold tracking-[0.2em] uppercase rounded-full self-start hover:bg-[#ec5b13] dark:hover:bg-[#ec5b13] dark:hover:text-white transition-all duration-200"
        >
          Explore Profile
        </a>
      </div>

      {/* Portrait Image */}
      <div className="order-1 lg:order-2 rounded-2xl overflow-hidden aspect-square relative">
        <Image
          src={portraitUrl}
          alt={title}
          fill
          className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
        />
      </div>
    </section>
  );
}
