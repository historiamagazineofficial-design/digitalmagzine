'use client';

import { useState } from 'react';
import { Share2, Twitter, Facebook, Link as LinkIcon, Check, MessageCircle } from 'lucide-react';

interface ShareBarProps {
  title: string;
  slug: string;
}

export default function ShareBar({ title, slug }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/article/${slug}` : '';
  const text = `Read "${title}" on THE INKSPIRE`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'X',
      icon: <Twitter size={16} />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={16} />,
      url: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
      color: 'hover:bg-green-500 hover:text-white',
    },
    {
      name: 'Facebook',
      icon: <Facebook size={16} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-600 hover:text-white',
    },
  ];

  return (
    <div className="flex flex-col gap-6 items-center lg:items-start zen-hide">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Share Article</span>
      <div className="flex lg:flex-col gap-3">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 rounded-full border border-black/5 dark:border-white/5 flex items-center justify-center transition-all duration-300 text-slate-500 ${link.color}`}
            title={`Share on ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className={`w-10 h-10 rounded-full border border-black/5 dark:border-white/5 flex items-center justify-center transition-all duration-300 ${
            copied ? 'bg-green-500 text-white border-green-500' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Copy Link"
        >
          {copied ? <Check size={16} /> : <LinkIcon size={16} />}
        </button>
      </div>
    </div>
  );
}
