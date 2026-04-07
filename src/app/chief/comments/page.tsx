'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, Check, X, MessageSquareWarning, Loader2 } from 'lucide-react';
import { getFlaggedComments, approveComment, deleteComment } from '@/lib/api';

export default function CommentsModerationPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getFlaggedComments();
      setFlags(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleApprove = async (id: string) => {
    const success = await approveComment(id);
    if (success) {
      setFlags(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleReject = async (id: string) => {
    if (window.confirm('Delete this comment permanently?')) {
      const success = await deleteComment(id);
      if (success) {
        setFlags(prev => prev.filter(f => f.id !== id));
      }
    }
  };
  return (
    <main className="p-5 md:p-10 w-full max-w-[100vw] overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
            <ShieldAlert className="text-red-500" />
            Comment Moderation
          </h2>
          <p className="text-gray-500 text-sm mt-1">Review flagged comments from the Literature Circles.</p>
        </div>
      </div>

      <div className="space-y-4 max-w-4xl">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-white opacity-20" size={32} />
          </div>
        ) : (
          <>
            {flags.map(flag => (
              <div key={flag.id} className="bg-white/5 border border-white/5 rounded-sm p-6 flex items-start gap-6">
                <div className="bg-white/10 p-3 rounded-sm shrink-0">
                  <MessageSquareWarning className="text-gray-400" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-sm tracking-wide">{flag.author}</span>
                      <span className="text-gray-500 text-xs ml-3">{flag.date}</span>
                    </div>
                    <span className="bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
                      {flag.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 font-serif leading-relaxed text-sm mb-4">
                    "{flag.content}"
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-gray-500">
                      Posted on: <span className="text-[#D4AF37]">{flag.article}</span>
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleApprove(flag.id)}
                        className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-green-500/20 hover:text-green-400 transition-colors px-3 py-2 rounded-sm text-gray-400"
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button 
                        onClick={() => handleReject(flag.id)}
                        className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-colors px-3 py-2 rounded-sm text-gray-400"
                      >
                        <X size={14} /> Reject & Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {flags.length === 0 && (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-sm">
                <ShieldAlert className="mx-auto text-gray-600 mb-4" size={32} />
                <p className="text-gray-400 font-serif">No pending comments requiring moderation.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
