'use client';

import { useState, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  replies?: Comment[];
}

function CommentItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  return (
    <div className={`${depth > 0 ? 'ml-6 pl-6 border-l border-slate-200 dark:border-slate-800' : ''}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-black dark:text-white font-bold text-[10px]">
              {comment.author[0]}
            </div>
            <span className="font-bold text-[10px]">{comment.author}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">{comment.date}</span>
        </div>

        <p className="text-sm font-serif leading-relaxed pl-11 text-slate-700 dark:text-slate-300 italic">{comment.content}</p>

        <button
          onClick={() => setShowReply(!showReply)}
          className="text-[10px] font-bold text-slate-400 hover:text-black dark:hover:text-white transition-colors mt-3 pl-11 flex items-center gap-2"
        >
          <MessageSquare size={12} />
          {'Reply'}
        </button>

        {showReply && (
          <div className="mt-4 pl-11 flex gap-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={'Share your insight or reflection...'}
              rows={2}
              className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm px-4 py-3 outline-none focus:border-black dark:focus:border-white transition-all resize-none rounded-xl font-serif"
            />
            <button 
              onClick={() => {
                if (replyText.trim()) {
                  setReplyText('');
                  setShowReply(false);
                }
              }}
              className="self-end p-2 px-4 bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity rounded-full"
            >
              <Send size={15} />
            </button>
          </div>
        )}
      </div>

      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function LiteratureCircle({ articleSlug }: { articleSlug: string }) {
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/comments?article=${articleSlug}`);
        const data = await res.json();
        if (data.success) {
          setComments(data.data);
        }
      } catch (err) {}
    }
    load();
  }, [articleSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: name, content: newComment, article: articleSlug }),
      });
      const data = await res.json();
      
      if (data.success) {
        setComments(prev => [data.data, ...prev]);
        setNewComment('');
        setName('');
      }
    } catch (err) {} finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto px-6 mt-12 pt-16 border-t border-slate-200 dark:border-slate-800 zen-hide pb-20">
      <h3 className="font-serif text-3xl font-bold mb-3 tracking-tight">{'Stay Enlightened'}</h3>
      <p className="text-slate-500 mb-10 font-sans text-[10px] font-bold">
        {`${comments.length} reflections shared. Join the intellectual exchange.`}
      </p>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="mb-16 space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={'Your name'}
          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-4 text-sm outline-none focus:border-black dark:focus:border-white transition-all rounded-xl placeholder-slate-400 font-sans font-bold text-[10px]"
        />
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={'Share your insight or reflection...'}
            rows={4}
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-5 text-sm outline-none focus:border-black dark:focus:border-white transition-all resize-none rounded-2xl font-serif leading-relaxed placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || !name.trim() || isSubmitting}
            className="absolute bottom-4 right-4 flex items-center gap-3 bg-black text-white dark:bg-white dark:text-black px-6 py-3 text-[10px] font-bold hover:opacity-80 transition-all rounded-full disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-black/10"
          >
            <Send size={12} />
            {isSubmitting ? '...' : 'Post'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-12">
        {comments.map((comment) => (
          <div key={comment.id} className="last:border-b-0">
            <CommentItem comment={comment} />
          </div>
        ))}
      </div>
    </section>
  );
}
