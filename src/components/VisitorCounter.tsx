'use client';

import { useState, useEffect } from 'react';

type VisitorLabels = {
  heading?: string;
  thanks?: string;
};

export default function VisitorCounter({ labels = {} as VisitorLabels }) {
  const [count] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const current = localStorage.getItem('visitor_count');
    if (!current) {
      const num = Math.floor(Math.random() * 1000) + 100;
      localStorage.setItem('visitor_count', String(num));
      return num;
    }
    return parseInt(current);
  });

  useEffect(() => {
    const lastVisit = localStorage.getItem('last_visit');
    const today = new Date().toDateString();
    if (lastVisit !== today) {
      const current = localStorage.getItem('visitor_count') || '100';
      const next = parseInt(current) + 1;
      localStorage.setItem('visitor_count', String(next));
      localStorage.setItem('last_visit', today);
    }
  }, []);

  return (
    <div className="text-center space-y-2">
      <div className="text-[8px] sm:text-[9px] text-pastel-purple font-bold">
        {labels.heading ?? '🌟 YOU ARE VISITOR'}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-pastel-blue">
        #{count.toString().padStart(6, '0')}
      </div>
      <div className="text-[7px] sm:text-[8px] text-gray-500 font-bold">
        {labels.thanks ?? '✨ Thanks for stopping by! ✨'}
      </div>
    </div>
  );
}
