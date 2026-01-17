'use client';

import { useState } from 'react';
import Link from 'next/link';
import RetroCard from '@/components/RetroCard';
import PixelCharacter from '@/components/PixelCharacter';
import PortfolioSection from '@/components/PortfolioSection';
import { ORGANIZATIONS, COMMITTEES } from '@/config/portfolio';

export default function ExperiencePage() {
  const [activeTab, setActiveTab] = useState<'org' | 'committee'>('org');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'ID' | '中文'>('EN');

  const translations = {
    EN: {
      title: 'Experience',
      back: '← Back to Home',
      org: 'ORGANISASI',
      committee: 'KEPANITIAAN',
    },
    ID: {
      title: 'Pengalaman',
      back: '← Kembali ke Beranda',
      org: 'ORGANISASI',
      committee: 'KEPANITIAAN',
    },
    中文: {
      title: '经历',
      back: '← 返回首页',
      org: '组织',
      committee: '委员会',
    },
  } as const;

  const t = translations[language];

  return (
    <div className={`min-h-screen font-neue transition-colors duration-300 ${
      darkMode 
        ? 'bg-linear-to-b from-gray-900 via-gray-800 to-gray-900'
        : 'bg-linear-to-b from-[#FFB6D9] via-pastel-pink to-[#FFC0CB]'
    }`}>
      {/* Floating clouds animation */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 left-10 w-32 h-16 bg-white rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-40 h-20 bg-white rounded-full animate-pulse delay-75" />
      </div>

      <main className="relative z-10 container mx-auto px-6 py-12 min-h-screen">
        {/* Header with controls */}
        <header className="mb-12">
          {/* Controls Bar */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center mb-6">
            {/* Back Button */}
            <Link href="/">
              <button className="px-3 py-2 bg-pastel-mint border-2 border-black font-bold text-[9px] sm:text-xs hover:bg-opacity-80 transition-all">
                {t.back}
              </button>
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-2 bg-pastel-yellow border-2 border-black font-bold text-[9px] sm:text-xs hover:bg-opacity-80 transition-all"
              title="Toggle Dark Mode"
            >
              {darkMode ? '☀️ LIGHT' : '🌙 DARK'}
            </button>

            {/* Language Toggle */}
            <div className="flex gap-1">
              {(['EN', 'ID', '中文'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-2 text-[8px] sm:text-[9px] font-bold border-2 border-black transition-all ${
                    language === lang ? 'bg-pastel-purple text-white' : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className={`font-press text-2xl sm:text-3xl md:text-5xl mb-4 drop-shadow-lg leading-relaxed ${
              darkMode ? 'text-pastel-yellow' : 'text-retro-text'
            }`}>
              {t.title.toUpperCase()}
            </h1>
          </div>
        </header>

        {/* Experience Content */}
        <div className="max-w-6xl mx-auto">
          <RetroCard title={t.title} className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b-2 border-retro-border/30">
              <button
                onClick={() => setActiveTab('org')}
                className={`px-4 py-2 font-press text-xs transition-colors border-b-2 ${
                  activeTab === 'org'
                    ? 'border-b-pastel-yellow text-pastel-yellow'
                    : 'border-b-transparent text-retro-text/50 hover:text-retro-text'
                }`}
              >
                {t.org}
              </button>
              <button
                onClick={() => setActiveTab('committee')}
                className={`px-4 py-2 font-press text-[10px] sm:text-xs transition-colors border-b-2 wrap-break-word ${
                  activeTab === 'committee'
                    ? 'border-b-pastel-yellow text-pastel-yellow'
                    : 'border-b-transparent text-retro-text/50 hover:text-retro-text'
                }`}
              >
                {t.committee}
              </button>
            </div>

            {/* Content */}
            {activeTab === 'org' ? (
              <PortfolioSection data={ORGANIZATIONS} />
            ) : (
              <PortfolioSection data={COMMITTEES} isCommittee />
            )}
          </RetroCard>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 font-neue text-sm text-retro-text/70">
          <p>© 2026 zhuoyaazh</p>
        </footer>
      </main>

      {/* Karakter Pixel di pojok */}
      <PixelCharacter />
    </div>
  );
}
