'use client';

import { useState, useEffect } from 'react';

type VisitorLabels = {
  loading?: string;
  heading?: string;
  thanks?: string;
};

export default function VisitorCounter({ labels = {} as VisitorLabels }) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current count from localStorage
    const currentCount = localStorage.getItem('visitor_count');
    
    if (currentCount) {
      setCount(parseInt(currentCount));
    } else {
      // First visitor
      const newCount = Math.floor(Math.random() * 1000) + 100; // Start with random number
      localStorage.setItem('visitor_count', newCount.toString());
      setCount(newCount);
    }

    // Increment on each visit
    const lastVisit = localStorage.getItem('last_visit');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
      const newCount = currentCount ? parseInt(currentCount) + 1 : 100;
      localStorage.setItem('visitor_count', newCount.toString());
      localStorage.setItem('last_visit', today);
      setCount(newCount);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="text-center text-[8px] sm:text-[9px] text-gray-600 font-bold">
        {labels.loading ?? 'Loading...'}
      </div>
    );
  }

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
