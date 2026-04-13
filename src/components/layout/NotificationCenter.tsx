'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, BellRing, X, ArrowRight, Sparkles, BookOpen, Mic2 } from 'lucide-react';
import Link from 'next/link';
import { Article, getAllArticles } from '@/lib/api';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadRecentUpdates() {
      try {
        const articles = await getAllArticles();
        // Simulate notifications from recent articles
        const recent = articles.slice(0, 3).map((a, i) => ({
          id: a.slug,
          title: a.title,
          excerpt: a.excerpt,
          date: a.date || 'Just now',
          type: a.category,
          isNew: i === 0,
        }));
        setNotifications(recent);
        setUnreadCount(recent.filter(n => n.isNew).length);
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    }

    loadRecentUpdates();
    
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const markAllAsRead = () => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) markAllAsRead();
        }}
        className="relative p-1.5 sm:p-2.5 bg-[#07308D]/5 dark:bg-[#07308D]/10 hover:bg-[#07308D]/15 rounded-xl transition-all border border-[#07308D]/10 group"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <BellRing className="w-4 h-4 sm:w-5 sm:h-5 text-[#07308D] animate-pulse" />
        ) : (
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-300 group-hover:text-[#07308D] transition-colors" />
        )}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#07308D] rounded-full border-2 border-white dark:border-slate-900"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden z-[70] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-5 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#07308D]" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Recent Updates</h3>
            </div>
            {unreadCount > 0 && (
              <span className="text-[9px] bg-[#07308D] text-white px-2 py-0.5 rounded-full font-bold">
                {unreadCount} NEW
              </span>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto no-scrollbar">
            {notifications.length > 0 ? (
              <div className="flex flex-col">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={`/article/${n.id}`}
                    onClick={() => setIsOpen(false)}
                    className="p-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-black/5 dark:border-white/5 last:border-0 group"
                  >
                    <div className="flex gap-4">
                      <div className={`mt-1 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        n.type === 'Fiction' ? 'bg-purple-500/10 text-purple-500' :
                        n.type === 'Voices' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-[#07308D]/10 text-[#07308D]'
                      }`}>
                        {n.type === 'Fiction' ? <BookOpen size={14} /> : 
                         n.type === 'Voices' ? <Mic2 size={14} /> : 
                         <Sparkles size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[8px] font-black uppercase tracking-widest ${
                            n.type === 'Fiction' ? 'text-purple-500' :
                            n.type === 'Voices' ? 'text-orange-500' :
                            'text-[#07308D]'
                          }`}>
                            {n.type}
                          </span>
                          <span className="text-[8px] text-slate-400 font-bold uppercase">{n.date}</span>
                        </div>
                        <h4 className="text-xs font-serif font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#07308D] transition-colors">
                          {n.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {n.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Bell size={24} className="mx-auto mb-4 text-slate-300 dark:text-slate-700 opacity-20" />
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">No new notifications</p>
              </div>
            )}
          </div>

          <Link
            href="/archives"
            className="p-4 bg-slate-50 dark:bg-white/5 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#07308D] hover:bg-[#07308D] hover:text-white transition-all group"
            onClick={() => setIsOpen(false)}
          >
            View All Archives
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}
