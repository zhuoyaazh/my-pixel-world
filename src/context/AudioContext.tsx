'use client';

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

const TRACKS = [
  { id: 1, name: 'aily inst', src: '/audio/aily inst.mp3', startTime: 127 }, // 2:07
  { id: 2, name: 'awn cozy inst', src: '/audio/awn cozy inst.mp3', startTime: 134 }, // 2:14
];

interface AudioContextType {
  isAudioPlaying: boolean;
  setIsAudioPlaying: (playing: boolean) => void;
  currentTrack: number;
  setCurrentTrack: (track: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isFirstPlayRef = useRef(true);

  // Load saved track from localStorage
  useEffect(() => {
    const savedTrack = localStorage.getItem('audioTrack');
    if (savedTrack) {
      const timer = setTimeout(() => {
        setCurrentTrack(parseInt(savedTrack));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // Save track selection
  useEffect(() => {
    localStorage.setItem('audioTrack', currentTrack.toString());
  }, [currentTrack]);

  // Handle track change
  useEffect(() => {
    if (!audioRef.current) return;
    
    const track = TRACKS.find(t => t.id === currentTrack);
    if (!track) return;

    const wasPlaying = isAudioPlaying;
    
    // Load new track
    audioRef.current.src = track.src;
    audioRef.current.currentTime = track.startTime;
    
    // Resume if was playing
    if (wasPlaying) {
      audioRef.current.play().catch(() => {
        setIsAudioPlaying(false);
      });
    }
  }, [currentTrack, isAudioPlaying]);

  // Handle audio play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isAudioPlaying) {
      // Only set start time on first play
      if (isFirstPlayRef.current) {
        const track = TRACKS.find(t => t.id === currentTrack);
        if (track) {
          audioRef.current.currentTime = track.startTime;
        }
        isFirstPlayRef.current = false;
      }
      audioRef.current.play().catch(() => {
        // Autoplay blocked or other error
        setIsAudioPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isAudioPlaying, currentTrack]);

  return (
    <AudioContext.Provider value={{ isAudioPlaying, setIsAudioPlaying, currentTrack, setCurrentTrack, audioRef }}>
      {children}
      {/* Background Music */}
      <audio
        ref={audioRef}
        src={TRACKS.find(t => t.id === currentTrack)?.src}
        loop
        crossOrigin="anonymous"
      />
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}
