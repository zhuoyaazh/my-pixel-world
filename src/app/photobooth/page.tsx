'use client';

import Link from 'next/link';
import PhotoboothWidget from '@/components/PhotoboothWidget';
import RetroCard from '@/components/RetroCard';

export default function PhotoBoothPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#FFB6D9] via-pastel-pink to-[#FFC0CB] p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pastel-yellow" style={{ fontFamily: 'var(--font-press)' }}>
            PHOTOBOOTH
          </h1>
          <p className="text-[10px] sm:text-xs text-gray-600 font-bold">
            Capture cute moments & create your pixel-perfect strip! ✨
          </p>
        </div>

        {/* Main PhotoBooth Component */}
        <PhotoboothWidget />

        {/* Info Card */}
        <RetroCard className="space-y-2">
          <h3 className="text-[10px] sm:text-xs font-bold text-[#d6336c] uppercase tracking-wide">
            💡 HOW TO USE
          </h3>
          <ul className="text-[8px] sm:text-[9px] text-gray-700 font-bold space-y-1">
            <li>• Click START CAMERA to begin</li>
            <li>• Customize your settings (grid, timer, color, decoration)</li>
            <li>• Click SNAP to capture photos with countdown timer</li>
            <li>• Preview your strip and download it!</li>
            <li>• Share your photobooth moments 📸</li>
          </ul>
        </RetroCard>

        {/* Back Button */}
        <Link href="/">
          <button className="w-full p-3 bg-pastel-purple text-black border-2 border-black font-bold text-[9px] sm:text-xs hover:bg-pastel-blue transition-all">
            ← BACK HOME
          </button>
        </Link>
      </div>
    </div>
  );
}
