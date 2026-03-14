'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Saves and restores scroll position when navigating back/forward
export default function ScrollRestorer() {
  const pathname = usePathname();

  useEffect(() => {
    // On mount of a new page, check if there was a saved scroll position from history
    const saved = sessionStorage.getItem(`scroll:${pathname}`);
    if (saved) {
      const pos = parseInt(saved, 10);
      // Small timeout to let the page render fully before scrolling
      setTimeout(() => {
        window.scrollTo({ top: pos, behavior: 'instant' });
      }, 100);
    }

    // Save scroll position before navigating away
    const saveScroll = () => {
      sessionStorage.setItem(`scroll:${pathname}`, String(window.scrollY));
    };

    window.addEventListener('beforeunload', saveScroll);
    return () => {
      // Also save on unmount (navigation within SPA)
      saveScroll();
      window.removeEventListener('beforeunload', saveScroll);
    };
  }, [pathname]);

  return null;
}
