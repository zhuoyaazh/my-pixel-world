'use client';

import RetroCard from '@/components/RetroCard';
import PixelCharacter from '@/components/PixelCharacter';
import SpotifyEmbed from '@/components/SpotifyEmbed';
import RetroLinkButton from '@/components/RetroLinkButton';
import PortfolioSection from '@/components/PortfolioSection';
import WeatherWidget from '@/components/WeatherWidget';
import FunZone from '@/components/FunZone';
import Showcase from '@/components/Showcase';
import { INSTAGRAM_URL, PORTFOLIO_URL, GITHUB_URL, EMAIL_URL, EMAIL_URL_2 } from '@/config/links';
import { ORGANIZATIONS, COMMITTEES } from '@/config/portfolio';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'org' | 'committee'>('org');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'ID' | '中文'>('EN');
  const [searchQuery, setSearchQuery] = useState('');
  const translations = {
    EN: {
      welcome: 'Welcome to My Cozy Digital Space ✨',
      greeting: "Hi! I'm zhuoyaazh",
      about:
        'Physics Student at ITB | Psychology & Mental Health Enthusiast | Exploring Digital Art, IT, and Chinese Language & Culture | Passionate about Human Connection & Mental Wellbeing',
      search: '🔍 Search...',
      aboutTitle: 'About Me',
      linksTitle: 'Links',
      guestbookTitle: 'Guestbook',
      guestbook1: 'Share Your Thoughts!',
      guestbook2: 'Anonymous messages welcome ✨',
      guestbook3: '👉 Click to leave a message 👈',
      nowPlaying: 'Now Playing',
      weather: 'Weather',
      weatherLabels: {
        heading: '🌤️ WEATHER',
        auto: 'AUTO',
        placeholder: 'City...',
        loading: 'Loading weather...',
        humidity: 'Humidity',
        wind: 'Wind',
        errorLocation: 'Location access denied',
        errorFetch: 'Failed to fetch weather',
      },
      funZone: 'Fun Zone',
      funTabs: { pomodoro: '⏱️ POMODORO', visitor: '👥 VISITORS', pixelart: '🎨 PIXEL ART' },
      pomodoroLabels: {
        workTab: '🎯 WORK',
        breakTab: '☕ BREAK',
        focusText: '💪 Focus Time!',
        breakText: '🌸 Take a Break!',
        start: '▶️ START',
        pause: '⏸️ PAUSE',
        reset: '🔄 RESET',
      },
      visitorLabels: {
        loading: 'Loading...',
        heading: '🌟 YOU ARE VISITOR',
        thanks: '✨ Thanks for stopping by! ✨',
      },
      pixelArtLabels: {
        clear: '🗑️ CLEAR CANVAS',
      },
      showcase: 'Showcase',
      showcaseTabs: { projects: '💼 PROJECTS', blog: '📝 BLOG', gallery: '🖼️ GALLERY' },
      experience: 'Experience',
      org: 'ORGANISASI',
      committee: 'KEPANITIAAN',
      footer: 'Made with 💖 and lots of pixels',
    },
    ID: {
      welcome: 'Selamat datang di ruang digitalku ✨',
      greeting: 'Halo! Aku zhuoyaazh',
      about:
        'Mahasiswi Fisika ITB | Pemerhati Psikologi & Kesehatan Mental | Jelajahi Digital Art, IT, dan Bahasa & Budaya Mandarin | Peduli Koneksi Manusia & Wellbeing',
      search: '🔍 Cari...',
      aboutTitle: 'Tentang Aku',
      linksTitle: 'Tautan',
      guestbookTitle: 'Guestbook',
      guestbook1: 'Tinggalkan pesan!',
      guestbook2: 'Pesan anonim diterima ✨',
      guestbook3: '👉 Klik untuk kirim pesan 👈',
      nowPlaying: 'Sedang Diputar',
      weather: 'Cuaca',
      weatherLabels: {
        heading: '🌤️ CUACA',
        auto: 'OTO',
        placeholder: 'Kota...',
        loading: 'Memuat cuaca...',
        humidity: 'Kelembapan',
        wind: 'Angin',
        errorLocation: 'Akses lokasi ditolak',
        errorFetch: 'Gagal mengambil data cuaca',
      },
      funZone: 'Zona Seru',
      funTabs: { pomodoro: '⏱️ POMODORO', visitor: '👥 PENGUNJUNG', pixelart: '🎨 PIXEL ART' },
      pomodoroLabels: {
        workTab: '🎯 FOKUS',
        breakTab: '☕ ISTIRAHAT',
        focusText: '💪 Waktunya fokus!',
        breakText: '🌸 Saatnya rehat!',
        start: '▶️ MULAI',
        pause: '⏸️ JEDA',
        reset: '🔄 RESET',
      },
      visitorLabels: {
        loading: 'Memuat...',
        heading: '🌟 KAMU PENGUNJUNG',
        thanks: '✨ Terima kasih sudah mampir! ✨',
      },
      pixelArtLabels: {
        clear: '🗑️ HAPUS KANVAS',
      },
      showcase: 'Showcase',
      showcaseTabs: { projects: '💼 PROYEK', blog: '📝 BLOG', gallery: '🖼️ GALERI' },
      experience: 'Pengalaman',
      org: 'ORGANISASI',
      committee: 'KEPANITIAAN',
      footer: 'Dibuat dengan 💖 dan banyak piksel',
    },
    中文: {
      welcome: '欢迎来到我的像素世界 ✨',
      greeting: '嗨! 我是 zhuoyaazh',
      about:
        '物理系学生 | 心理健康爱好者 | 探索数字艺术、IT 和中文文化 | 热爱人与人之间的连接与身心健康',
      search: '🔍 搜索...',
      aboutTitle: '关于我',
      linksTitle: '链接',
      guestbookTitle: '留言簿',
      guestbook1: '分享你的想法!',
      guestbook2: '欢迎匿名留言 ✨',
      guestbook3: '👉 点此留言 👈',
      nowPlaying: '正在播放',
      weather: '天气',
      weatherLabels: {
        heading: '🌤️ 天气',
        auto: '自动定位',
        placeholder: '城市...',
        loading: '正在加载天气...',
        humidity: '湿度',
        wind: '风速',
        errorLocation: '无法获取定位',
        errorFetch: '获取天气失败',
      },
      funZone: '趣味区',
      funTabs: { pomodoro: '⏱️ 番茄钟', visitor: '👥 访客数', pixelart: '🎨 像素画' },
      pomodoroLabels: {
        workTab: '🎯 专注',
        breakTab: '☕ 休息',
        focusText: '💪 开始专注！',
        breakText: '🌸 放松一下！',
        start: '▶️ 开始',
        pause: '⏸️ 暂停',
        reset: '🔄 重置',
      },
      visitorLabels: {
        loading: '加载中...',
        heading: '🌟 你是访客',
        thanks: '✨ 感谢你的到访！ ✨',
      },
      pixelArtLabels: {
        clear: '🗑️ 清空画布',
      },
      showcase: '作品集',
      showcaseTabs: { projects: '💼 项目', blog: '📝 博客', gallery: '🖼️ 画廊' },
      experience: '经历',
      org: '组织',
      committee: '委员会',
      footer: '用 💖 和像素制作',
    },
  } as const;
  const t = translations[language];

  const query = searchQuery.trim().toLowerCase();
  const matches = (text?: string) => (text || '').toLowerCase().includes(query);

  const filteredOrganizations = query
    ? ORGANIZATIONS.map((entry) => ({
        ...entry,
        positions: entry.positions.filter(
          (p) => matches(entry.year) || matches(p.role) || matches(p.org) || matches(p.description)
        ),
      })).filter((e) => e.positions.length > 0)
    : ORGANIZATIONS;

  const filteredCommittees = query
    ? COMMITTEES.map((entry) => ({
        ...entry,
        roles: entry.roles.filter(
          (r) => matches(entry.year) || matches(r.role) || matches(r.event) || matches(r.description)
        ),
      })).filter((e) => e.roles.length > 0)
    : COMMITTEES;
  
  const linksData = [
    { label: '📧 Email (Pribadi)', href: EMAIL_URL, aria: 'Send personal email', className: 'bg-pastel-blue hover:bg-pastel-purple' },
    { label: '📧 Email (Studio)', href: EMAIL_URL_2, aria: 'Send studio email', className: 'bg-pastel-blue hover:bg-pastel-purple' },
    { label: '💼 LINKEDIN', href: PORTFOLIO_URL, aria: 'Open LinkedIn', className: 'bg-pastel-yellow hover:bg-pastel-purple' },
    { label: '💻 GITHUB', href: GITHUB_URL, aria: 'Open GitHub', className: 'bg-pastel-mint hover:bg-pastel-purple' },
    { label: '🎨 INSTAGRAM', href: INSTAGRAM_URL, aria: 'Open Instagram', className: 'bg-pastel-purple hover:bg-pastel-blue' },
  ];

  const filteredLinks = query ? linksData.filter((link) => matches(link.label)) : linksData;

  const showGuestbook =
    !query || matches(t.guestbookTitle) || matches(t.guestbook1) || matches(t.guestbook2) || matches(t.guestbook3);

  return (
    <div className={`min-h-screen font-neue transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-b from-[#FFB6D9] via-pastel-pink to-[#FFC0CB]'
    }`}>
      {/* Floating clouds animation - bisa ditambahin nanti */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 left-10 w-32 h-16 bg-white rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-40 h-20 bg-white rounded-full animate-pulse delay-75" />
      </div>

      <main className="relative z-10 container mx-auto px-6 py-12 min-h-screen">
        {/* Header with controls */}
        <header className="mb-12">
          {/* Controls Bar */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center mb-6">
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
              ZHUOYAAZH
            </h1>
            <p className={`font-neue text-base sm:text-xl px-4 ${
              darkMode ? 'text-pastel-pink' : 'text-retro-text'
            }`}>
              {t.welcome}
            </p>
          </div>
        </header>

        {/* Main Grid - Desktop Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Profile Card */}
          <RetroCard title={t.aboutTitle} className="lg:col-span-2">
            <div className="space-y-4">
              <p className="text-base sm:text-lg leading-relaxed text-retro-text">
                <span className="font-press text-xs sm:text-sm break-words">{t.greeting}</span> 👋
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-retro-text">
                ✨ {t.about}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 sm:px-3 py-1 bg-pastel-mint border-2 border-retro-border text-[10px] sm:text-xs font-press">
                  PHYSICS
                </span>
                <span className="px-2 sm:px-3 py-1 bg-pastel-purple border-2 border-retro-border text-[10px] sm:text-xs font-press">
                  PSYCHOLOGY
                </span>
                <span className="px-2 sm:px-3 py-1 bg-pastel-yellow border-2 border-retro-border text-[10px] sm:text-xs font-press">
                  DIGITAL ART
                </span>
                <span className="px-2 sm:px-3 py-1 bg-pastel-blue border-2 border-retro-border text-[10px] sm:text-xs font-press">
                  CHINESE 中文
                </span>
              </div>
            </div>
          </RetroCard>

          {/* Quick Links */}
          <RetroCard title={t.linksTitle} clickable>
            <div className="space-y-3">
              {filteredLinks.map((link) => (
                <RetroLinkButton key={link.label} href={link.href} ariaLabel={link.aria} className={link.className}>
                  {link.label}
                </RetroLinkButton>
              ))}

              {filteredLinks.length === 0 && (
                <p className="text-[8px] sm:text-[9px] text-gray-500 font-bold">No links found.</p>
              )}
            </div>
          </RetroCard>

          {/* Guestbook */}
          {showGuestbook && (
            <Link href="/messages">
              <RetroCard 
                title={t.guestbookTitle} 
                clickable
                className="bg-pastel-mint border-4 border-pastel-purple hover:border-pastel-blue hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-full px-6 py-5 sm:px-8 sm:py-6 bg-pastel-purple rounded-lg space-y-3">
                    <div className="text-4xl sm:text-5xl animate-bounce">💬</div>
                    <p className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wide">
                      {t.guestbook1}
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-white font-bold">
                      {t.guestbook2}
                    </p>
                    <p className="text-[8px] sm:text-xs font-bold text-pastel-yellow animate-pulse">
                      {t.guestbook3}
                    </p>
                  </div>
                </div>
              </RetroCard>
            </Link>
          )}

          {/* Spotify Widget */}
          <RetroCard title={t.nowPlaying} className="lg:col-span-2">
            <SpotifyEmbed
              src="https://open.spotify.com/embed/playlist/3IDNsoyqeq1nejHYCI2tjZ?utm_source=generator"
              responsive
              mobileHeight={200}
              desktopHeight={352}
              title="zhuoyaazh playlist"
            />
          </RetroCard>

          {/* Weather Widget */}
          <RetroCard title={t.weather}>
            <WeatherWidget labels={t.weatherLabels} />
          </RetroCard>

          {/* Fun Zone */}
          <FunZone
            labels={t.funTabs}
            title={t.funZone}
            pomodoroLabels={t.pomodoroLabels}
            visitorLabels={t.visitorLabels}
            pixelArtLabels={t.pixelArtLabels}
          />

          {/* Showcase */}
          <Showcase labels={t.showcaseTabs} title={t.showcase} searchQuery={searchQuery} />

          {/* Portfolio Section */}
          <RetroCard title={t.experience} className="lg:col-span-3">
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
                className={`px-4 py-2 font-press text-xs transition-colors border-b-2 ${
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
          <p>{t.footer}</p>
          <p className="mt-2 text-xs">© 2026 zhuoyaazh</p>
        </footer>
      </main>

      {/* Karakter Pixel di pojok */}
      <PixelCharacter />
    </div>
  );
}
