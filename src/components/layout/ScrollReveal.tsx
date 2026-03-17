'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
}

export default function ScrollReveal({ children, className = '', threshold = 0.1 }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold });

    const current = domRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [threshold]);

  return (
    <div
      ref={domRef}
      className={`scroll-reveal ${isVisible ? 'visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
