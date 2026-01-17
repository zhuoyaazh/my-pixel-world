'use client';

import { useState } from 'react';
import Link from 'next/link';
import PixelCharacter from '@/components/PixelCharacter';
import Showcase from '@/components/Showcase';

export default function ShowcasePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'ID' | '中文'>('EN');
  const [searchQuery, setSearchQuery] = useState('');

  const translations = {
    EN: {
      title: 'Showcase',
      back: '← Back to Home',
      search: '🔍 Search...',
      showcaseTabs: { projects: '💼 PROJECTS', blog: '📝 BLOG', gallery: '🖼️ GALLERY' },
    },
    ID: {
      title: 'Showcase',
      back: '← Kembali ke Beranda',
      search: '🔍 Cari...',
      showcaseTabs: { projects: '💼 PROYEK', blog: '📝 BLOG', gallery: '🖼️ GALERI' },
    },
    中文: {
      title: '作品集',
      back: '← 返回首页',
      search: '🔍 搜索...',
      showcaseTabs: { projects: '💼 项目', blog: '📝 博客', gallery: '🖼️ 画廊' },
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

            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search}
                className="w-full px-3 py-2 text-[9px] sm:text-xs border-2 border-black bg-white font-bold placeholder-gray-400"
              />
            </div>

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

        {/* Showcase Content */}
        <div className="max-w-6xl mx-auto">
          <Showcase labels={t.showcaseTabs} title={t.title} searchQuery={searchQuery} />
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
