'use client';

import { useState } from 'react';

interface PixelCharacterProps {
  imageSrc?: string;
  message?: string;
}

export default function PixelCharacter({ 
  imageSrc = '/images/character.png',
  message = '嗨! Welcome! ✨' 
}: PixelCharacterProps) {
  const [isWaving, setIsWaving] = useState(false);
  // Always show fallback since character image is not available
  const [imageError, setImageError] = useState(true);

  return (
    <div 
      className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 cursor-pointer select-none group"
      onClick={() => setIsWaving(!isWaving)}
    >
      <div className={`transition-transform duration-300 ${isWaving ? 'animate-bounce' : 'group-hover:scale-110'}`}>
        <div className="relative">
          {/* Karakter Pixel */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white border-3 sm:border-4 border-retro-border shadow-retro overflow-hidden relative flex items-center justify-center">
            {!imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt="Pixel Character"
                className="max-w-full max-h-full object-contain p-2 pixelated"
                onError={() => setImageError(true)}
              />
            ) : (
              // Fallback jika gambar belum ada
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-pastel-pink to-pastel-purple">
                <span className="text-3xl sm:text-4xl md:text-5xl">🎨</span>
              </div>
            )}
          </div>
          
          {/* Speech bubble */}
          {isWaving && (
            <div className="absolute -top-16 sm:-top-20 -left-4 sm:-left-8 bg-white border-2 sm:border-3 border-retro-border p-2 sm:p-3 shadow-retro whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
              <p className="font-neue text-xs sm:text-sm">{message}</p>
              {/* Triangle pointer */}
              <div className="absolute -bottom-2 left-6 sm:left-8 w-0 h-0 border-l-6 sm:border-l-8 border-l-transparent border-r-6 sm:border-r-8 border-r-transparent border-t-6 sm:border-t-8 border-t-retro-border" />
            </div>
          )}

          {/* Hover hint */}
          {!isWaving && (
            <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="font-press text-[8px] sm:text-xs text-retro-border drop-shadow-lg whitespace-nowrap">
                CLICK ME!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
