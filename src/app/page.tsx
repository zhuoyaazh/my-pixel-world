'use client';

import RetroCard from '@/components/RetroCard';
import PixelCharacter from '@/components/PixelCharacter';
import SpotifyEmbed from '@/components/SpotifyEmbed';
import RetroLinkButton from '@/components/RetroLinkButton';
import PortfolioSection from '@/components/PortfolioSection';
import { INSTAGRAM_URL, PORTFOLIO_URL, EMAIL_URL, EMAIL_URL_2 } from '@/config/links';
import { ORGANIZATIONS, COMMITTEES } from '@/config/portfolio';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'org' | 'committee'>('org');
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFB6D9] via-pastel-pink to-[#FFC0CB] font-neue">
      {/* Floating clouds animation - bisa ditambahin nanti */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 left-10 w-32 h-16 bg-white rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-40 h-20 bg-white rounded-full animate-pulse delay-75" />
      </div>

      <main className="relative z-10 container mx-auto px-6 py-12 min-h-screen">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="font-press text-3xl md:text-5xl text-retro-text mb-4 drop-shadow-lg">
            ZHUOYAAZH
          </h1>
          <p className="font-neue text-xl text-retro-text">
            Welcome to My Cozy Digital Space ✨
          </p>
        </header>

        {/* Main Grid - Desktop Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Profile Card */}
          <RetroCard title="About Me" className="lg:col-span-2">
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-retro-text">
                <span className="font-press text-sm">嗨! 我是 zhuoyaazh</span> 👋
              </p>
              <p className="text-sm leading-relaxed text-retro-text">
                ✨ Physics Student at ITB | Psychology & Mental Health Enthusiast | Exploring Digital Art, IT, and Chinese Language & Culture | Passionate about Human Connection & Mental Wellbeing
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-pastel-mint border-2 border-retro-border text-xs font-press">
                  PHYSICS
                </span>
                <span className="px-3 py-1 bg-pastel-purple border-2 border-retro-border text-xs font-press">
                  PSYCHOLOGY
                </span>
                <span className="px-3 py-1 bg-pastel-yellow border-2 border-retro-border text-xs font-press">
                  DIGITAL ART
                </span>
                <span className="px-3 py-1 bg-pastel-blue border-2 border-retro-border text-xs font-press">
                  CHINESE 中文
                </span>
              </div>
            </div>
          </RetroCard>

          {/* Quick Links */}
          <RetroCard title="Links" clickable>
            <div className="space-y-3">
              <RetroLinkButton href={EMAIL_URL} ariaLabel="Send personal email" className="bg-pastel-blue hover:bg-pastel-purple">
                📧 Email (Pribadi)
              </RetroLinkButton>
              <RetroLinkButton href={EMAIL_URL_2} ariaLabel="Send studio email" className="bg-pastel-blue hover:bg-pastel-purple">
                📧 Email (Studio)
              </RetroLinkButton>
              <RetroLinkButton href={PORTFOLIO_URL} ariaLabel="Open LinkedIn" className="bg-pastel-yellow hover:bg-pastel-purple">
                💼 LINKEDIN
              </RetroLinkButton>
              <RetroLinkButton href={INSTAGRAM_URL} ariaLabel="Open Instagram" className="bg-pastel-mint hover:bg-pastel-purple">
                🎨 INSTAGRAM
              </RetroLinkButton>
            </div>
          </RetroCard>

          {/* Spotify Widget */}
          <RetroCard title="Now Playing" className="lg:col-span-2">
            <SpotifyEmbed
              src="https://open.spotify.com/embed/playlist/3IDNsoyqeq1nejHYCI2tjZ?utm_source=generator"
              responsive
              mobileHeight={200}
              desktopHeight={352}
              title="zhuoyaazh playlist"
            />
          </RetroCard>

          {/* Placeholder for Weather Widget */}
          <RetroCard title="Weather">
            <div className="text-center space-y-3">
              <div className="text-5xl">☀️</div>
              <p className="font-press text-sm">28°C</p>
              <p className="text-sm text-retro-text/70">Bandung, ID</p>
            </div>
          </RetroCard>

          {/* Portfolio Section */}
          <RetroCard title="Experience" className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b-2 border-retro-border/30">
              <button
                onClick={() => setActiveTab('org')}
                className={`px-4 py-2 font-press text-xs transition-colors border-b-2 ${
                  activeTab === 'org'
                    ? 'border-b-retro-border text-retro-border'
                    : 'border-b-transparent text-retro-text/50 hover:text-retro-text'
                }`}
              >
                ORGANISASI
              </button>
              <button
                onClick={() => setActiveTab('committee')}
                className={`px-4 py-2 font-press text-xs transition-colors border-b-2 ${
                  activeTab === 'committee'
                    ? 'border-b-retro-border text-retro-border'
                    : 'border-b-transparent text-retro-text/50 hover:text-retro-text'
                }`}
              >
                KEPANITIAAN
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
          <p>Made with 💖 and lots of pixels</p>
          <p className="mt-2 text-xs">© 2026 zhuoyaazh</p>
        </footer>
      </main>

      {/* Karakter Pixel di pojok */}
      <PixelCharacter />
    </div>
  );
}
