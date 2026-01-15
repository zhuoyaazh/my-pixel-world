'use client';

import { useState, useEffect } from 'react';

type PomodoroLabels = {
  workTab?: string;
  breakTab?: string;
  focusText?: string;
  breakText?: string;
  start?: string;
  pause?: string;
  reset?: string;
};

export default function PomodoroTimer({ labels = {} as PomodoroLabels }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            // Timer done
            if (mode === 'work') {
              setMode('break');
              setMinutes(5);
            } else {
              setMode('work');
              setMinutes(25);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'work' ? 25 : 5);
    setSeconds(0);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setMinutes(newMode === 'work' ? 25 : 5);
    setSeconds(0);
    setIsActive(false);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Mode Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => switchMode('work')}
          className={`flex-1 p-2 font-bold text-[8px] sm:text-[9px] border-2 border-black transition-all ${
            mode === 'work' ? 'bg-pastel-blue' : 'bg-gray-200'
          }`}
        >
          {labels.workTab ?? '🎯 WORK'}
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 p-2 font-bold text-[8px] sm:text-[9px] border-2 border-black transition-all ${
            mode === 'break' ? 'bg-pastel-mint' : 'bg-gray-200'
          }`}
        >
          {labels.breakTab ?? '☕ BREAK'}
        </button>
      </div>

      {/* Timer Display */}
      <div className="text-center space-y-2">
        <div className="text-3xl sm:text-4xl font-bold text-pastel-purple">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="text-[8px] sm:text-[9px] text-gray-600 font-bold">
          {mode === 'work'
            ? labels.focusText ?? '💪 Focus Time!'
            : labels.breakText ?? '🌸 Take a Break!'}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={toggleTimer}
          className="flex-1 p-2 bg-pastel-yellow border-2 border-black font-bold text-[8px] sm:text-[9px] hover:bg-opacity-80 transition-all"
        >
          {isActive ? labels.pause ?? '⏸️ PAUSE' : labels.start ?? '▶️ START'}
        </button>
        <button
          onClick={resetTimer}
          className="flex-1 p-2 bg-pastel-purple border-2 border-black font-bold text-[8px] sm:text-[9px] hover:bg-opacity-80 transition-all"
        >
          {labels.reset ?? '🔄 RESET'}
        </button>
      </div>
    </div>
  );
}
