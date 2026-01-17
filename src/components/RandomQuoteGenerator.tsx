'use client';

import { useState, useEffect, useCallback } from 'react';

interface Quote {
  text: string;
  author: string;
  category: 'motivation' | 'psychology' | 'mentalhealth';
}

interface RandomQuoteGeneratorProps {
  labels: {
    heading: string;
    refresh: string;
    loading: string;
    category: {
      motivation: string;
      psychology: string;
      mentalhealth: string;
    };
  };
}

const QUOTES: Quote[] = [
  // Motivation Quotes
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'motivation' },
  { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt', category: 'motivation' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', category: 'motivation' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt', category: 'motivation' },
  { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson', category: 'motivation' },
  { text: 'It always seems impossible until it\'s done.', author: 'Nelson Mandela', category: 'motivation' },
  { text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins', category: 'motivation' },
  { text: 'Your limitation—it\'s only your imagination.', author: 'Anonymous', category: 'motivation' },
  { text: 'Great things never come from comfort zones.', author: 'Anonymous', category: 'motivation' },
  { text: 'Dream it. Wish it. Do it.', author: 'Anonymous', category: 'motivation' },

  // Psychology Quotes
  { text: 'The mind is everything. What you think you become.', author: 'Buddha', category: 'psychology' },
  { text: 'We cannot change what we are not aware of, and once we are aware, we cannot help but change.', author: 'Sheryl Sandberg', category: 'psychology' },
  { text: 'The curious paradox is that when I accept myself just as I am, then I can change.', author: 'Carl Rogers', category: 'psychology' },
  { text: 'Everything can be taken from a man but one thing: the last of human freedoms—to choose one\'s attitude.', author: 'Viktor Frankl', category: 'psychology' },
  { text: 'The good life is a process, not a state of being. It is a direction not a destination.', author: 'Carl Rogers', category: 'psychology' },
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle', category: 'psychology' },
  { text: 'The greatest discovery of my generation is that human beings can alter their lives by altering their attitudes.', author: 'William James', category: 'psychology' },
  { text: 'What we think, we become.', author: 'Buddha', category: 'psychology' },
  { text: 'Knowing yourself is the beginning of all wisdom.', author: 'Aristotle', category: 'psychology' },
  { text: 'Between stimulus and response there is a space. In that space is our power to choose our response.', author: 'Viktor Frankl', category: 'psychology' },

  // Mental Health Quotes
  { text: 'Mental health is not a destination, but a process. It\'s about how you drive, not where you\'re going.', author: 'Noam Shpancer', category: 'mentalhealth' },
  { text: 'You don\'t have to be positive all the time. It\'s perfectly okay to feel sad, angry, annoyed, frustrated, scared and anxious. Having feelings doesn\'t make you a negative person. It makes you human.', author: 'Lori Deschene', category: 'mentalhealth' },
  { text: 'Self-care is not selfish. You cannot serve from an empty vessel.', author: 'Eleanor Brown', category: 'mentalhealth' },
  { text: 'Healing takes time, and asking for help is a courageous step.', author: 'Mariska Hargitay', category: 'mentalhealth' },
  { text: 'There is hope, even when your brain tells you there isn\'t.', author: 'John Green', category: 'mentalhealth' },
  { text: 'It\'s okay to not be okay, as long as you are not giving up.', author: 'Karen Salmansohn', category: 'mentalhealth' },
  { text: 'Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.', author: 'Anonymous', category: 'mentalhealth' },
  { text: 'Be kind to yourself. You\'re doing the best you can.', author: 'Anonymous', category: 'mentalhealth' },
  { text: 'You are not your illness. You have an individual story to tell. You have a name, a history, a personality. Staying yourself is part of the battle.', author: 'Julian Seifter', category: 'mentalhealth' },
  { text: 'Mental health needs a great deal of attention. It\'s the final taboo and it needs to be faced and dealt with.', author: 'Adam Ant', category: 'mentalhealth' },
  { text: 'Taking care of your mental health is just as important as taking care of your physical health.', author: 'Anonymous', category: 'mentalhealth' },
  { text: 'Sometimes the bravest thing you can do is ask for help.', author: 'Anonymous', category: 'mentalhealth' },
  { text: 'Progress, not perfection.', author: 'Anonymous', category: 'mentalhealth' },
  { text: 'You are stronger than you think. You are not alone.', author: 'Anonymous', category: 'mentalhealth' },
  { text: 'Small steps in the right direction can turn out to be the biggest step of your life.', author: 'Anonymous', category: 'mentalhealth' },
];

export default function RandomQuoteGenerator({ labels }: RandomQuoteGeneratorProps) {
  const [filter, setFilter] = useState<'all' | Quote['category']>('all');
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(() => {
    const filteredQuotes = QUOTES;
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    return filteredQuotes[randomIndex];
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomQuote = useCallback(() => {
    const filteredQuotes = filter === 'all' 
      ? QUOTES 
      : QUOTES.filter(q => q.category === filter);
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    return filteredQuotes[randomIndex];
  }, [filter]);

  const refreshQuote = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote());
      setIsAnimating(false);
    }, 300);
  }, [getRandomQuote]);

  // Refresh when filter changes (async to avoid sync setState warning)
  useEffect(() => {
    const id = setTimeout(() => refreshQuote(), 0);
    return () => clearTimeout(id);
  }, [filter, refreshQuote]);

  const getCategoryColor = (category: Quote['category']) => {
    switch (category) {
      case 'motivation': return 'bg-pastel-yellow';
      case 'psychology': return 'bg-pastel-mint';
      case 'mentalhealth': return 'bg-pastel-purple text-white';
      default: return 'bg-white';
    }
  };

  const getCategoryIcon = (category: Quote['category']) => {
    switch (category) {
      case 'motivation': return '🔥';
      case 'psychology': return '🧠';
      case 'mentalhealth': return '💚';
      default: return '💬';
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-2 py-1 text-[9px] sm:text-[10px] font-bold border-2 border-black transition-all ${
            filter === 'all' ? 'bg-pastel-blue text-white' : 'bg-white hover:bg-gray-100'
          }`}
        >
          ALL
        </button>
        <button
          onClick={() => setFilter('motivation')}
          className={`px-2 py-1 text-[9px] sm:text-[10px] font-bold border-2 border-black transition-all ${
            filter === 'motivation' ? 'bg-pastel-yellow' : 'bg-white hover:bg-gray-100'
          }`}
        >
          🔥 {labels.category.motivation}
        </button>
        <button
          onClick={() => setFilter('psychology')}
          className={`px-2 py-1 text-[9px] sm:text-[10px] font-bold border-2 border-black transition-all ${
            filter === 'psychology' ? 'bg-pastel-mint' : 'bg-white hover:bg-gray-100'
          }`}
        >
          🧠 {labels.category.psychology}
        </button>
        <button
          onClick={() => setFilter('mentalhealth')}
          className={`px-2 py-1 text-[9px] sm:text-[10px] font-bold border-2 border-black transition-all ${
            filter === 'mentalhealth' ? 'bg-pastel-purple text-white' : 'bg-white hover:bg-gray-100'
          }`}
        >
          💚 {labels.category.mentalhealth}
        </button>
      </div>

      {/* Quote Display */}
      {currentQuote ? (
        <div
          className={`transition-opacity duration-300 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className={`${getCategoryColor(currentQuote.category)} border-4 border-black p-4 space-y-3`}>
            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <span className="text-lg">{getCategoryIcon(currentQuote.category)}</span>
              <span className="text-[8px] font-bold uppercase tracking-wide">
                {labels.category[currentQuote.category]}
              </span>
            </div>

            {/* Quote Text */}
            <blockquote className="text-xs sm:text-sm leading-relaxed font-bold italic">
              &ldquo;{currentQuote.text}&rdquo;
            </blockquote>

            {/* Author */}
            <p className="text-[9px] sm:text-[10px] font-bold text-right">
              — {currentQuote.author}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border-4 border-black p-6 text-center">
          <p className="text-[10px] font-bold text-gray-500">{labels.loading}</p>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={refreshQuote}
        disabled={isAnimating}
        className="w-full px-4 py-2 bg-pastel-pink border-2 border-black font-bold text-[10px] sm:text-xs hover:bg-opacity-80 disabled:opacity-50 transition-all"
      >
        🔄 {labels.refresh}
      </button>

      {/* Pixel Art Decoration */}
      <div className="flex justify-center gap-1">
        <div className="w-2 h-2 bg-pastel-yellow border border-black" />
        <div className="w-2 h-2 bg-pastel-mint border border-black" />
        <div className="w-2 h-2 bg-pastel-purple border border-black" />
        <div className="w-2 h-2 bg-pastel-pink border border-black" />
        <div className="w-2 h-2 bg-pastel-blue border border-black" />
      </div>
    </div>
  );
}
