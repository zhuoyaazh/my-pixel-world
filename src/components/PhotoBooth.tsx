'use client';

import { useRef, useState, useEffect } from 'react';
import RetroCard from './RetroCard';

type GridLayout = 3 | 4 | 6;
type StripColor = 'pink' | 'yellow' | 'blue' | 'purple' | 'mint';
type Decoration = 'hearts' | 'stars' | 'flowers' | 'pixels' | 'none';
type CameraFilter = 'natural' | 'vibrant' | 'soft' | 'cool' | 'warm' | 'smooth';

const cameraFilters: Record<CameraFilter, string> = {
  natural: 'brightness(1) contrast(1) saturate(1)',
  vibrant: 'brightness(1.05) contrast(1.15) saturate(1.3) hue-rotate(2deg)',
  soft: 'brightness(1.08) contrast(0.9) saturate(1.1) blur(0.3px)',
  cool: 'brightness(1) contrast(1.1) saturate(1) hue-rotate(-5deg)',
  warm: 'brightness(1.05) contrast(1.05) saturate(1.2) hue-rotate(8deg)',
  smooth: 'brightness(1.02) contrast(1.08) saturate(1.15) blur(0.2px)',
};

const stripColors: Record<StripColor, string> = {
  pink: '#FFD1DC',
  yellow: '#FDFD96',
  blue: '#AEC6CF',
  purple: '#E0BBE4',
  mint: '#D5F4E6',
};

const decorations: Record<Decoration, string> = {
  hearts: '💖',
  stars: '⭐',
  flowers: '🌸',
  pixels: '■',
  none: '',
};

export default function PhotoBooth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [gridLayout, setGridLayout] = useState<GridLayout>(4);
  const [stripColor, setStripColor] = useState<StripColor>('pink');
  const [decoration, setDecoration] = useState<Decoration>('hearts');
  const [timerDuration, setTimerDuration] = useState<3 | 5 | 10>(3);
  const [countdown, setCountdown] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [retakingIndex, setRetakingIndex] = useState<number | null>(null);
  const [cameraFilter, setCameraFilter] = useState<CameraFilter>('vibrant');

  // Initialize camera
  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });
      console.log('Stream received:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('Stream attached to video element');
        videoRef.current.play().catch(err => console.error('Play error:', err));
        setCameraActive(true);
        console.log('Camera active set to true');
      } else {
        console.error('videoRef.current is null');
      }
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Unable to access camera. Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  // Mirror video to canvas
  useEffect(() => {
    if (!cameraActive || !videoRef.current) return;

    const canvas = document.getElementById('display-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        // Flip horizontally (remove mirror)
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, -canvas.width, 0);
        ctx.scale(-1, 1);
      }
      requestAnimationFrame(drawFrame);
    };

    const frameId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(frameId);
  }, [cameraActive]);

  // Capture photo with countdown
  const capturePhoto = (retakingIdx?: number) => {
    setCountdown(timerDuration);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Take photo with proper 3:4 aspect ratio crop
          if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
              const videoWidth = videoRef.current.videoWidth;
              const videoHeight = videoRef.current.videoHeight;
              
              // Calculate crop to maintain 3:4 aspect ratio (portrait)
              const targetAspect = 3 / 4; // width/height
              let cropWidth = videoWidth;
              let cropHeight = videoWidth / targetAspect;
              
              if (cropHeight > videoHeight) {
                cropHeight = videoHeight;
                cropWidth = videoHeight * targetAspect;
              }
              
              const offsetX = (videoWidth - cropWidth) / 2;
              const offsetY = (videoHeight - cropHeight) / 2;
              
              canvasRef.current.width = cropWidth;
              canvasRef.current.height = cropHeight;
              
              // Flip horizontally (remove mirror)
              context.scale(-1, 1);
              context.drawImage(
                videoRef.current,
                offsetX,
                offsetY,
                cropWidth,
                cropHeight,
                -cropWidth,
                0,
                cropWidth,
                cropHeight
              );
              context.scale(-1, 1);
              const photo = canvasRef.current.toDataURL('image/png');

              if (retakingIdx !== undefined) {
                const newPhotos = [...photos];
                newPhotos[retakingIdx] = photo;
                setPhotos(newPhotos);
                setRetakingIndex(null);
              } else {
                setPhotos((prev) => [...prev, photo]);
              }
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const clearPhotos = () => {
    setPhotos([]);
    setShowPreview(false);
    setRetakingIndex(null);
  };

  const downloadStrip = () => {
    if (photos.length === 0) return;

    const downloadCanvas = document.createElement('canvas');
    const ctx = downloadCanvas.getContext('2d');
    if (!ctx) return;

    const photoWidth = 240;
    const photoHeight = 320; // 3:4 aspect ratio
    const stripPadding = 30;
    const rows = gridLayout;

    downloadCanvas.width = photoWidth + stripPadding * 2;
    downloadCanvas.height = photoHeight * rows + stripPadding * (rows + 1);

    // Background color
    ctx.fillStyle = stripColors[stripColor];
    ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);

    // Decoration text if enabled
    if (decoration !== 'none') {
      ctx.font = '30px Arial';
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      for (let i = 0; i < rows; i++) {
        ctx.fillText(decorations[decoration], stripPadding + 10, (i + 1) * (photoHeight + stripPadding) - 20);
        ctx.fillText(decorations[decoration], photoWidth + stripPadding - 40, (i + 1) * (photoHeight + stripPadding) - 20);
      }
    }

    // Draw photos (use first `rows` photos)
    const photosToUse = photos.slice(0, rows);
    const img = new Image();

    let loadedCount = 0;
    photosToUse.forEach((photoData, index) => {
      img.onload = () => {
        const yPos = stripPadding + index * (photoHeight + stripPadding);
        const xPos = stripPadding;
        
        // Draw photo maintaining aspect ratio
        ctx.drawImage(img, xPos, yPos, photoWidth, photoHeight);

        loadedCount++;
        if (loadedCount === photosToUse.length) {
          // Download
          const link = document.createElement('a');
          link.href = downloadCanvas.toDataURL('image/png');
          link.download = `photobooth-${Date.now()}.png`;
          link.click();
        }
      };
      img.src = photoData;
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hidden video element - always mounted for ref to work */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: 'none' }}
      />
      
      {!showPreview ? (
        <>
          {/* Camera View with Thumbnails */}
          {cameraActive ? (
            <RetroCard className="space-y-4">
              <h3 className="text-[10px] sm:text-xs font-bold text-[#d6336c] uppercase tracking-wide">
                CAMERA PREVIEW
              </h3>

              {/* Main Camera + Thumbnails Layout */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Camera Preview (Left) */}
                <div className="flex-1">
                  <div className="relative bg-black border-4 border-black overflow-hidden">
                    <canvas
                      id="display-canvas"
                      className="w-full"
                      style={{ filter: cameraFilters[cameraFilter] }}
                    />
                    {countdown > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-6xl sm:text-8xl font-bold text-pastel-yellow animate-bounce">
                          {countdown}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        if (retakingIndex !== null) {
                          capturePhoto(retakingIndex);
                        } else {
                          capturePhoto();
                        }
                      }}
                      disabled={countdown > 0 || photos.length >= gridLayout}
                      className="flex-1 p-2 sm:p-3 bg-pastel-blue border-2 border-black font-bold text-[9px] sm:text-xs hover:bg-opacity-80 disabled:opacity-50 transition-all"
                    >
                      📸 SNAP ({timerDuration}s)
                    </button>
                    <button
                      onClick={stopCamera}
                      className="flex-1 p-2 sm:p-3 bg-pastel-purple border-2 border-black font-bold text-[9px] sm:text-xs hover:bg-opacity-80 transition-all"
                    >
                      STOP
                    </button>
                  </div>
                </div>

                {/* Photo Thumbnails (Right) */}
                <div className="sm:w-32">
                  <div className="text-[8px] sm:text-[9px] font-bold text-pastel-purple mb-2 text-center">
                    {photos.length} / {gridLayout} PHOTOS
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 auto-rows-max">
                    {photos.map((photo, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={photo}
                          alt={`Photo ${idx + 1}`}
                          className="w-full border-2 border-black bg-black cursor-pointer hover:opacity-80 transition-all"
                        />
                        <div className="absolute top-0 right-0 bg-pastel-yellow text-black text-[7px] sm:text-[8px] font-bold px-1 py-0.5">
                          #{idx + 1}
                        </div>
                        <button
                          onClick={() => {
                            if (retakingIndex === idx) {
                              setRetakingIndex(null);
                            } else {
                              setRetakingIndex(idx);
                            }
                          }}
                          className={`absolute inset-0 flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-all ${
                            retakingIndex === idx
                              ? 'bg-pastel-blue/80'
                              : 'bg-black/50 hover:bg-black/70'
                          }`}
                        >
                          {retakingIndex === idx ? '✓ RETAKE' : '⟲ RETAKE'}
                        </button>
                      </div>
                    ))}

                    {/* Empty slots */}
                    {Array.from({ length: gridLayout - photos.length }).map((_, idx) => (
                      <div
                        key={`empty-${idx}`}
                        className="aspect-square border-2 border-dashed border-gray-400 bg-gray-100 flex items-center justify-center text-[10px] sm:text-xs font-bold text-gray-500"
                      >
                        {photos.length + idx + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {photos.length > 0 && (
                <button
                  onClick={() => setShowPreview(true)}
                  className="w-full p-2 sm:p-3 bg-pastel-yellow border-2 border-black font-bold text-[9px] sm:text-xs hover:bg-opacity-80 transition-all"
                >
                  ✓ PREVIEW STRIP ({photos.length}/{gridLayout})
                </button>
              )}
            </RetroCard>
          ) : (
            <div className="p-4 bg-pastel-blue/20 border-4 border-dashed border-pastel-blue rounded text-center text-[9px] sm:text-xs font-bold text-pastel-blue">
              📷 Camera not started. Click START CAMERA in settings below.
            </div>
          )}

          {/* Controls */}
          <RetroCard className="space-y-4">
            <h3 className="text-[10px] sm:text-xs font-bold text-[#d6336c] uppercase tracking-wide">
              ⚙️ SETTINGS
            </h3>

            {/* Grid Layout */}
            <div>
              <label className="text-[8px] sm:text-[9px] font-bold text-pastel-purple block mb-2">
                Grid Layout
              </label>
              <div className="flex gap-2">
                {[3, 4, 6].map((grid) => (
                  <button
                    key={grid}
                    onClick={() => setGridLayout(grid as GridLayout)}
                    className={`flex-1 p-3 border-4 font-bold text-[9px] sm:text-xs transition-all ${
                      gridLayout === grid
                        ? 'bg-pastel-blue border-black text-black shadow-lg scale-105'
                        : 'bg-gray-200 border-gray-400 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {gridLayout === grid && '✓ '}{grid}x1
                  </button>
                ))}
              </div>
            </div>

            {/* Camera Filter */}
            <div>
              <label className="text-[8px] sm:text-[9px] font-bold text-pastel-purple block mb-2">
                Filter
              </label>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(cameraFilters) as CameraFilter[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setCameraFilter(filter)}
                    className={`px-3 py-2 border-4 font-bold text-[8px] sm:text-[9px] transition-all ${
                      cameraFilter === filter
                        ? 'bg-pastel-purple border-black text-black shadow-lg scale-105'
                        : 'bg-gray-200 border-gray-400 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {cameraFilter === filter && '✓ '}{filter.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Duration */}
            <div>
              <label className="text-[8px] sm:text-[9px] font-bold text-pastel-purple block mb-2">
                Timer
              </label>
              <div className="flex gap-2">
                {[3, 5, 10].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setTimerDuration(duration as 3 | 5 | 10)}
                    className={`flex-1 p-3 border-4 font-bold text-[9px] sm:text-xs transition-all ${
                      timerDuration === duration
                        ? 'bg-pastel-yellow border-black text-black shadow-lg scale-105'
                        : 'bg-gray-200 border-gray-400 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {timerDuration === duration && '✓ '}{duration}s
                  </button>
                ))}
              </div>
            </div>

            {/* Strip Color */}
            <div>
              <label className="text-[8px] sm:text-[9px] font-bold text-pastel-purple block mb-2">
                Strip Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(stripColors) as StripColor[]).map((color) => (
                  <button
                    key={color}
                    onClick={() => setStripColor(color)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 border-4 transition-all font-bold text-lg flex items-center justify-center ${
                      stripColor === color
                        ? 'border-black scale-110 shadow-lg'
                        : 'border-gray-400 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: stripColors[color] }}
                    title={color}
                  >
                    {stripColor === color && '✓'}
                  </button>
                ))}
              </div>
            </div>

            {/* Decoration */}
            <div>
              <label className="text-[8px] sm:text-[9px] font-bold text-pastel-purple block mb-2">
                Decoration
              </label>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(decorations) as Decoration[]).map((dec) => (
                  <button
                    key={dec}
                    onClick={() => setDecoration(dec)}
                    className={`px-3 py-2 border-4 font-bold text-[8px] sm:text-[9px] transition-all ${
                      decoration === dec
                        ? 'bg-pastel-mint border-black text-black shadow-lg scale-105'
                        : 'bg-gray-200 border-gray-400 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {decoration === dec && '✓ '}{dec === 'none' ? 'NONE' : `${decorations[dec]} ${dec.toUpperCase()}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Camera Button */}
            {!cameraActive && (
              <button
                onClick={startCamera}
                className="w-full p-3 bg-pastel-mint border-2 border-black font-bold text-[9px] sm:text-xs hover:bg-opacity-80 transition-all"
              >
                🎥 START CAMERA
              </button>
            )}
          </RetroCard>
        </>
      ) : (
        /* Preview & Download */
        <RetroCard className="space-y-4">
          <h3 className="text-[10px] sm:text-xs font-bold text-[#d6336c] uppercase tracking-wide">
            📸 YOUR PHOTOBOOTH STRIP
          </h3>

          {/* Strip Preview */}
          <div
            className="p-4 sm:p-6 border-4 border-black mx-auto"
            style={{
              backgroundColor: stripColors[stripColor],
              maxWidth: '320px',
            }}
          >
            {photos.slice(0, gridLayout).map((photo, index) => (
              <div key={index} className="mb-4 last:mb-0 border-2 border-black bg-black overflow-hidden">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-auto"
                  style={{ aspectRatio: '3/4' }}
                />
              </div>
            ))}

            {/* Decorations */}
            {decoration !== 'none' && (
              <>
                <div className="absolute left-2 top-4 text-2xl sm:text-3xl opacity-30">
                  {decorations[decoration]}
                </div>
                <div className="absolute right-2 bottom-4 text-2xl sm:text-3xl opacity-30">
                  {decorations[decoration]}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={downloadStrip}
              disabled={photos.length === 0}
              className="w-full p-3 bg-pastel-yellow border-2 border-black font-bold text-[9px] sm:text-xs hover:bg-opacity-80 disabled:opacity-50 transition-all"
            >
              ⬇️ DOWNLOAD STRIP
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 p-2 sm:p-3 bg-pastel-blue border-2 border-black font-bold text-[8px] sm:text-[9px] hover:bg-opacity-80 transition-all"
              >
                ← BACK TO CAMERA
              </button>
              <button
                onClick={clearPhotos}
                className="flex-1 p-2 sm:p-3 bg-pastel-purple border-2 border-black font-bold text-[8px] sm:text-[9px] hover:bg-opacity-80 transition-all"
              >
                🗑️ CLEAR ALL
              </button>
            </div>
          </div>

          {/* Photo Count */}
          <p className="text-[8px] sm:text-[9px] text-gray-600 font-bold text-center">
            {photos.length} / {gridLayout} photos
          </p>
        </RetroCard>
      )}

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
