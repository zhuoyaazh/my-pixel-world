'use client';

import { useAudio } from '@/context/AudioContext';

export default function AudioToggle() {
  const { isAudioPlaying, setIsAudioPlaying, currentTrack, setCurrentTrack } = useAudio();

  return (
    <div className="flex gap-1">
      <button
        onClick={() => setIsAudioPlaying(!isAudioPlaying)}
        className="px-3 py-2 bg-pastel-blue border-2 border-black font-bold text-[9px] sm:text-xs hover:bg-opacity-80 transition-all"
        title="Toggle Background Music"
      >
        {isAudioPlaying ? '🎧 ON' : '🎧 OFF'}
      </button>
      <select
        value={currentTrack}
        onChange={(e) => setCurrentTrack(parseInt(e.target.value))}
        className="px-2 py-2 bg-white border-2 border-black font-bold text-[9px] sm:text-xs hover:bg-gray-100 transition-all cursor-pointer"
        title="Select Track"
      >
        <option value={1}>🎵 1</option>
        <option value={2}>🎵 2</option>
      </select>
    </div>
  );
}
