'use client';

import { useState } from 'react';
import RetroCard from './RetroCard';
import PomodoroTimer from './PomodoroTimer';
import VisitorCounter from './VisitorCounter';
import PixelArtCanvas from './PixelArtCanvas';

type FunTab = 'pomodoro' | 'visitor' | 'pixelart';

type FunZoneProps = {
  title?: string;
  labels?: {
    pomodoro: string;
    visitor: string;
    pixelart: string;
  };
  pomodoroLabels?: Parameters<typeof PomodoroTimer>[0]['labels'];
  visitorLabels?: Parameters<typeof VisitorCounter>[0]['labels'];
  pixelArtLabels?: Parameters<typeof PixelArtCanvas>[0]['labels'];
};

export default function FunZone({ title = 'Fun Zone', labels, pomodoroLabels, visitorLabels, pixelArtLabels }: FunZoneProps) {
  const [activeTab, setActiveTab] = useState<FunTab>('pomodoro');
  const tabLabels = labels ?? {
    pomodoro: '⏱️ POMODORO',
    visitor: '👥 VISITORS',
    pixelart: '🎨 PIXEL ART',
  };

  return (
    <RetroCard title={title} className="lg:col-span-2">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 sm:mb-6 border-b-2 border-retro-border/30 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pomodoro')}
          className={`px-3 py-2 font-press text-[8px] sm:text-xs transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'pomodoro'
              ? 'border-b-pastel-yellow text-pastel-yellow'
              : 'border-b-transparent text-retro-text/50 hover:text-retro-text'
          }`}
        >
          {tabLabels.pomodoro}
        </button>
        <button
          onClick={() => setActiveTab('visitor')}
          className={`px-3 py-2 font-press text-[8px] sm:text-xs transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'visitor'
              ? 'border-b-pastel-yellow text-pastel-yellow'
              : 'border-b-transparent text-retro-text/50 hover:text-retro-text'
          }`}
        >
          {tabLabels.visitor}
        </button>
        <button
          onClick={() => setActiveTab('pixelart')}
          className={`px-3 py-2 font-press text-[8px] sm:text-xs transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'pixelart'
              ? 'border-b-pastel-yellow text-pastel-yellow'
              : 'border-b-transparent text-retro-text/50 hover:text-retro-text'
          }`}
        >
          {tabLabels.pixelart}
        </button>
      </div>

      {/* Content */}
      <div className="min-h-50">
        {activeTab === 'pomodoro' && <PomodoroTimer labels={pomodoroLabels} />}
        {activeTab === 'visitor' && <VisitorCounter labels={visitorLabels} />}
        {activeTab === 'pixelart' && <PixelArtCanvas labels={pixelArtLabels} />}
      </div>
    </RetroCard>
  );
}
