'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PixelCharacterProps {
  imageSrc?: string;
  message?: string;
}

export default function PixelCharacter({ 
  imageSrc = '/images/character.png',
  message = 'Hi! I\'m here! ✨' 
}: PixelCharacterProps) {
  const [isWaving, setIsWaving] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className="fixed bottom-8 right-8 z-50 cursor-pointer select-none group"
      onClick={() => setIsWaving(!isWaving)}
    >
      <div className={`transition-transform duration-300 ${isWaving ? 'animate-bounce' : 'group-hover:scale-110'}`}>
        <div className="relative">
          {/* Karakter Pixel */}
          <div className="w-32 h-32 bg-white border-4 border-retro-border shadow-retro overflow-hidden relative">
            {!imageError ? (
              <Image
                src={imageSrc}
                alt="Pixel Character"
                fill
                className="object-contain pixelated p-2"
                onError={() => setImageError(true)}
                priority
              />
            ) : (
              // Fallback jika gambar belum ada
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pastel-pink to-pastel-purple">
                <span className="text-5xl">🎨</span>
              </div>
            )}
          </div>
          
          {/* Speech bubble */}
          {isWaving && (
            <div className="absolute -top-20 -left-8 bg-white border-3 border-retro-border p-3 shadow-retro whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
              <p className="font-neue text-sm">{message}</p>
              {/* Triangle pointer */}
              <div className="absolute -bottom-2 left-8 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-retro-border" />
            </div>
          )}

          {/* Hover hint */}
          {!isWaving && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="font-press text-xs text-retro-border drop-shadow-lg whitespace-nowrap">
                CLICK ME!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
