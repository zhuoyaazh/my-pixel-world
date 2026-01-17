'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import RetroCard from './RetroCard';

type Mode = 'idle' | 'countdown' | 'capturing' | 'edit' | 'decoration';
type LayoutType = 'strip-3' | 'strip-4' | 'strip-6' | 'grid-2x2';
type FilterOption = 'natural' | 'vibrant' | 'grayscale' | 'sepia' | 'warm' | 'cool' | 'pixelate';
type TimerOption = 3 | 5 | 10;

type Sticker = {
  id: string;
  grid: string[][];
  gridWidth: number;
  gridHeight: number;
  x: number;
  y: number;
  size: number;
};

// Konfigurasi Filter CSS
const filterPresets: Record<FilterOption, string> = {
  natural: 'brightness(1) contrast(1) saturate(1)',
  vibrant: 'brightness(1.1) contrast(1.2) saturate(1.3)',
  grayscale: 'grayscale(100%) contrast(1.1)',
  sepia: 'sepia(60%) contrast(1.1)',
  warm: 'brightness(1.05) sepia(0.2) saturate(1.2) hue-rotate(10deg)',
  cool: 'brightness(1.05) saturate(1.1) hue-rotate(-10deg)',
  pixelate: 'brightness(1) contrast(1) saturate(1)',
};

// Pixel Art Canvas Config
const PIXEL_GRID_SIZE = 16;
const PIXEL_COLORS = ['#FFD1DC', '#FFDAB9', '#E6E6FA', '#B0E0E6', '#98D8C8', '#FF6B9D', '#FFD700', '#87CEEB', '#000000', '#FFFFFF', '🧹'];
const ERASER_MARKER = '🧹';

// Konfigurasi Warna Frame
const frameColors: Record<string, string> = {
  pink: '#FFD1DC',
  yellow: '#FDFD96',
  blue: '#AEC6CF',
  purple: '#E0BBE4',
  mint: '#D5F4E6',
  white: '#FFFFFF',
  black: '#2D2D2D',
};

// Konfigurasi Layout dengan photo aspect ratio
const layoutConfig: Record<LayoutType, { count: number; name: string; cols: number; rows: number; photoAspect: string }> = {
  'strip-3': { count: 3, name: '3-Photo Strip (Landscape)', cols: 1, rows: 3, photoAspect: '4/3' },
  'strip-4': { count: 4, name: '4-Photo Strip (Landscape)', cols: 1, rows: 4, photoAspect: '4/3' },
  'strip-6': { count: 6, name: '6-Photo Strip (Landscape)', cols: 2, rows: 3, photoAspect: '4/3' },
  'grid-2x2': { count: 4, name: '2×2 Grid (Portrait)', cols: 2, rows: 2, photoAspect: '3/4' },
};

export default function PhotoboothWidget() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const downloadCanvasRef = useRef<HTMLCanvasElement>(null);

  // --- STATE ---
  const [mode, setMode] = useState<Mode>('idle');
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>('strip-4');
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('vibrant');
  const [frameColor, setFrameColor] = useState('pink');
  const [selectedTimer, setSelectedTimer] = useState<TimerOption>(3);
  const [pixelateSize, setPixelateSize] = useState(8);
  
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(0);
  
  const [stripText, setStripText] = useState('');
  
  // Pixel Art Canvas State
  const [pixelGrid, setPixelGrid] = useState<string[][]>(
    Array(PIXEL_GRID_SIZE).fill(null).map(() => Array(PIXEL_GRID_SIZE).fill('#FFFFFF'))
  );
  const [selectedColor, setSelectedColor] = useState(PIXEL_COLORS[8]); // Black
  
  // Stickers State
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [placingSticker, setPlacingSticker] = useState<string[][] | null>(null);
  const [savedStickers, setSavedStickers] = useState<Sticker[]>([]);
  const [showSavedStickers, setShowSavedStickers] = useState(false);

  // Load saved stickers from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('photoboothSavedStickers');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedStickers(parsed);
      }
    } catch (err) {
      console.error('Failed to load saved stickers:', err);
    }
  }, []);

  const photosRequired = layoutConfig[selectedLayout].count;

  const getStripDimensions = useCallback(() => {
    const config = layoutConfig[selectedLayout];
    const singleW = config.photoAspect === '4/3' ? 320 : 240;
    const singleH = config.photoAspect === '4/3' ? 240 : 320;
    const gap = 20;
    const border = 30;
    const textAreaHeight = 50;
    const totalW = (config.cols * singleW) + ((config.cols - 1) * gap) + (border * 2);
    const totalH = (config.rows * singleH) + ((config.rows - 1) * gap) + (border * 2) + textAreaHeight;
    return { config, singleW, singleH, gap, border, textAreaHeight, totalW, totalH };
  }, [selectedLayout]);

  // --- CAMERA LOGIC ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Pastikan video mulai play agar canvas tidak hitam
        void videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      alert('Gagal akses kamera. Pastikan diizinkan ya!');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      try { videoRef.current.pause(); } catch {}
      setCameraActive(false);
    }
  };

  // --- AUTO STOP CAMERA WHEN LEAVING IDLE/COUNTDOWN/CAPTURING MODES ---
  useEffect(() => {
    if (mode === 'edit' || mode === 'decoration') {
      stopCamera();
    }
  }, [mode]);

  // --- ENSURE CAMERA STOPS ON UNMOUNT ---
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // --- PREVIEW DRAWING (Real-time dengan dynamic aspect ratio) ---
  useEffect(() => {
    if (!cameraActive || !videoRef.current || !displayCanvasRef.current) return;

    const ctx = displayCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const renderFrame = () => {
        if (!videoRef.current || !displayCanvasRef.current) return;
        
        const video = videoRef.current;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const videoW = video.videoWidth;
            const videoH = video.videoHeight;
            
            // Parse aspect ratio dari layout
            const [numerator, denominator] = layoutConfig[selectedLayout].photoAspect.split('/').map(Number);
            const targetAspect = numerator / denominator;

            // Hitung crop biar pas di tengah
            let cropH = videoH;
            let cropW = videoH * targetAspect;

            if (cropW > videoW) {
                cropW = videoW;
                cropH = videoW / targetAspect;
            }

            const cropX = (videoW - cropW) / 2;
            const cropY = (videoH - cropH) / 2;

            // Set ukuran canvas
            displayCanvasRef.current.width = cropW;
            displayCanvasRef.current.height = cropH;

            // Flip Horizontal (Mirroring)
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(
                video, 
                cropX, cropY, cropW, cropH,
                -cropW, 0, cropW, cropH
            );
            ctx.restore();
        }
        requestAnimationFrame(renderFrame);
    };
    renderFrame();
  }, [cameraActive, selectedLayout, mode]);

  // --- CAPTURE PHOTO ---
  const capturePhoto = () => {
    if (!videoRef.current || !captureCanvasRef.current) return;
    const ctx = captureCanvasRef.current.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const video = videoRef.current;
    const videoW = video.videoWidth;
    const videoH = video.videoHeight;
    
    const [numerator, denominator] = layoutConfig[selectedLayout].photoAspect.split('/').map(Number);
    const targetAspect = numerator / denominator;

    let cropH = videoH;
    let cropW = videoH * targetAspect;

    if (cropW > videoW) {
        cropW = videoW;
        cropH = videoW / targetAspect;
    }
    const cropX = (videoW - cropW) / 2;
    const cropY = (videoH - cropH) / 2;

    captureCanvasRef.current.width = 640;
    captureCanvasRef.current.height = Math.round(640 / targetAspect);

    // Flip & Draw
    ctx.save();
    ctx.scale(-1, 1);
    ctx.filter = filterPresets[selectedFilter]; 
    ctx.drawImage(video, cropX, cropY, cropW, cropH, -640, 0, 640, captureCanvasRef.current.height);
    ctx.restore();

    // Apply pixelate if selected
    if (selectedFilter === 'pixelate') {
      const imageData = ctx.getImageData(0, 0, captureCanvasRef.current.width, captureCanvasRef.current.height);
      const pixelated = pixelateImageData(imageData, pixelateSize);
      ctx.putImageData(pixelated, 0, 0);
    }

    const photoData = captureCanvasRef.current.toDataURL('image/png');
    return photoData;
  };

  // --- PIXELATE HELPER ---
  const pixelateImageData = (imageData: ImageData, blockSize: number) => {
    const { width, height, data } = imageData;
    for (let y = 0; y < height; y += blockSize) {
      for (let x = 0; x < width; x += blockSize) {
        let r = 0, g = 0, b = 0, count = 0;
        for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
          for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
            const i = ((y + dy) * width + (x + dx)) * 4;
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
          for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
            const i = ((y + dy) * width + (x + dx)) * 4;
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
          }
        }
      }
    }
    return imageData;
  };

  // --- COUNTDOWN & CAPTURE SEQUENCE (Manual next, bukan auto) ---
  const startCountdown = () => {
    setCountdown(selectedTimer);
    setMode('countdown');

    let count = selectedTimer;
    const timer = setInterval(() => {
        count--;
        setCountdown(count);
        
        if (count <= 0) {
            clearInterval(timer);
            // Capture foto
            if (capturedImages.length >= photosRequired) {
              stopCamera();
              setMode('edit');
              return;
            }
            const photoData = capturePhoto();
            if (photoData) {
                setCapturedImages(prev => {
                  if (prev.length >= photosRequired) return prev;
                  return [...prev, photoData];
                });
                // advance implicitly via capturedImages length
            }
            setMode('capturing'); // Tunggu user klik "Next Photo" atau "Done"
        }
    }, 1000);
  };

  // --- RETAKE PHOTO (Ganti foto specific index) ---
  const retakePhoto = (index: number) => {
    // no need to track current index globally
    setCountdown(selectedTimer);
    setMode('countdown');

    let count = selectedTimer;
    const timer = setInterval(() => {
        count--;
        setCountdown(count);
        
        if (count <= 0) {
            clearInterval(timer);
            const photoData = capturePhoto();
            if (photoData) {
                setCapturedImages(prev => {
                    const updated = [...prev];
                    updated[index] = photoData;
                    return updated;
                });
            }
            setMode('capturing');
        }
    }, 1000);
  };


  // --- DOWNLOAD FINAL STRIP WITH DECORATIONS & TEXT ---
  const downloadStrip = () => {
    if (!downloadCanvasRef.current) return;
    const canvas = downloadCanvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const { config, singleW, singleH, gap, border, totalW, totalH } = getStripDimensions();

    canvas.width = totalW;
    canvas.height = totalH;

    // 1. Background
    ctx.fillStyle = frameColors[frameColor];
    ctx.fillRect(0, 0, totalW, totalH);

    // 2. Draw photos
    capturedImages.slice(0, photosRequired).forEach((photoData, idx) => {
        const img = new Image();
        img.src = photoData;
        
        img.onload = () => {
            const col = idx % config.cols;
            const row = Math.floor(idx / config.cols);
            
            const x = border + (col * (singleW + gap));
            const y = border + (row * (singleH + gap));
            
            ctx.drawImage(img, x, y, singleW, singleH);
        };
    });

    // 3. Draw stickers
    ctx.imageSmoothingEnabled = false;
    stickers.forEach((sticker) => {
      const cellSize = sticker.size / sticker.gridWidth;
      sticker.grid.forEach((row, rowIdx) => {
        row.forEach((color, colIdx) => {
          if (color !== '#FFFFFF') {
            ctx.fillStyle = color;
            ctx.fillRect(
              sticker.x + (colIdx * cellSize),
              sticker.y + (rowIdx * cellSize),
              cellSize,
              cellSize
            );
          }
        });
      });
    });

    // 4. Draw custom text (with margin below last photo, centered)
    if (stripText) {
        const textMargin = 38; // ~1cm visually
        ctx.font = "14px Arial";
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(stripText, totalW / 2, border + (config.rows * singleH) + ((config.rows - 1) * gap) + textMargin);
    }

    // 5. Copyright
    ctx.font = "10px Arial";
    ctx.fillStyle = '#666666';
    ctx.fillText('© zhuoyaazh', totalW - 80, totalH - 10);

    // 6. Download
    setTimeout(() => {
        const link = document.createElement('a');
        link.download = `photobooth-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }, 100);
  };

  // --- PIXEL ART CANVAS FUNCTIONS ---
  const paintPixel = (row: number, col: number) => {
    const newGrid = [...pixelGrid];
    if (selectedColor === ERASER_MARKER) {
      newGrid[row][col] = '#FFFFFF';
    } else {
      newGrid[row][col] = selectedColor;
    }
    setPixelGrid(newGrid);
  };

  const clearPixelCanvas = () => {
    setPixelGrid(Array(PIXEL_GRID_SIZE).fill(null).map(() => Array(PIXEL_GRID_SIZE).fill('#FFFFFF')));
  };

  const createSticker = () => {
    // Find bounding box of non-white pixels
    let minRow = PIXEL_GRID_SIZE, maxRow = -1;
    let minCol = PIXEL_GRID_SIZE, maxCol = -1;

    pixelGrid.forEach((row, rowIdx) => {
      row.forEach((color, colIdx) => {
        if (color !== '#FFFFFF') {
          minRow = Math.min(minRow, rowIdx);
          maxRow = Math.max(maxRow, rowIdx);
          minCol = Math.min(minCol, colIdx);
          maxCol = Math.max(maxCol, colIdx);
        }
      });
    });

    // Check if canvas has any non-white pixels
    if (minRow === PIXEL_GRID_SIZE) {
      alert('Gambar dulu pixel art-nya! 🎨');
      return;
    }

    // Crop to bounding box
    const croppedHeight = maxRow - minRow + 1;
    const croppedWidth = maxCol - minCol + 1;
    const croppedGrid: string[][] = [];
    for (let r = minRow; r <= maxRow; r++) {
      const row: string[] = [];
      for (let c = minCol; c <= maxCol; c++) {
        row.push(pixelGrid[r][c]);
      }
      croppedGrid.push(row);
    }

    // Create new sticker with cropped grid and dimensions
    const newSticker: Sticker = {
      id: Date.now().toString(),
      grid: croppedGrid,
      gridWidth: croppedWidth,
      gridHeight: croppedHeight,
      x: 0,
      y: 0,
      size: 60,
    };

    // Save to both active stickers and saved stickers
    setPlacingSticker(croppedGrid);
    const updated = [...savedStickers, newSticker];
    setSavedStickers(updated);
    try {
      localStorage.setItem('photoboothSavedStickers', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save sticker:', err);
    }
    alert('Sticker disimpan! Klik di strip untuk menaruhnya. ✨');
  };

  const useSavedSticker = (saved: Sticker) => {
    setPlacingSticker(saved.grid);
    alert('Klik di strip untuk menaruh sticker! ✨');
  };

  const handleStripClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placingSticker) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Default sticker size is 60px
    const stickerSize = 60;
    const gridHeight = placingSticker.length;
    const gridWidth = placingSticker[0]?.length || 1;
    
    const newSticker: Sticker = {
      id: Date.now().toString(),
      grid: placingSticker,
      gridWidth: gridWidth,
      gridHeight: gridHeight,
      x: x - stickerSize / 2,
      y: y - stickerSize / 2,
      size: stickerSize,
    };
    
    setStickers(prev => [...prev, newSticker]);
    setPlacingSticker(null);
    clearPixelCanvas();
  };

  // --- RENDER ---
  return (
    <div className="space-y-6">
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <canvas ref={captureCanvasRef} className="hidden" />
      <canvas ref={downloadCanvasRef} className="hidden" />

      {mode === 'decoration' ? (
        // === DECORATION/PIXEL ART STICKER EDITOR ===
        <RetroCard>
          <h3 className="text-center font-press text-sm text-retro-border mb-4">🎨 PIXEL ART STICKER 🎨</h3>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center max-w-6xl mx-auto w-full">
            {/* LEFT: PREVIEW STRIP (CLICKABLE FOR PLACING STICKERS) */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-[9px] font-bold text-gray-600">
                {placingSticker ? '👆 KLIK DI STRIP UNTUK TARUH STICKER' : 'PREVIEW STRIP'}
              </p>
              {(() => {
                const { totalW, totalH, gap, border, config, singleW, singleH } = getStripDimensions();
                const previewWidth = 260;
                const previewHeight = Math.round((totalH / totalW) * previewWidth);
                const scale = previewWidth / totalW;
                const textMargin = 76;
                return (
                  <div 
                    onClick={handleStripClick}
                    className={`p-4 border-4 border-black shadow-retro transition-colors duration-300 relative ${placingSticker ? 'cursor-crosshair ring-4 ring-pastel-yellow' : ''}`}
                    style={{ backgroundColor: frameColors[frameColor] }}
                  >
                    <div
                      className="relative mx-auto"
                      style={{ width: previewWidth, height: previewHeight }}
                    >
                      <div 
                        className="grid"
                        style={{ 
                          gridTemplateColumns: `repeat(${config.cols}, ${singleW * scale}px)`,
                          gap: `${gap * scale}px`,
                          padding: `${border * scale}px`,
                          backgroundColor: frameColors[frameColor],
                        }}
                      >
                        {capturedImages.slice(0, photosRequired).map((photo, i) => (
                            <img key={i} src={photo} alt="Strip" className="border-2 border-black bg-white object-cover pointer-events-none" 
                              style={{width: singleW * scale, height: singleH * scale, imageRendering: selectedFilter === 'pixelate' ? 'pixelated' : 'auto'}} />
                        ))}
                      </div>

                      {/* Render placed stickers */}
                      {stickers.map((sticker) => {
                        const cellSize = sticker.size / sticker.gridWidth;
                        return (
                          <div 
                            key={sticker.id}
                            className="absolute pointer-events-none"
                            style={{
                              left: sticker.x,
                              top: sticker.y,
                              width: sticker.gridWidth * cellSize,
                              height: sticker.gridHeight * cellSize,
                            }}
                          >
                            <div 
                              className="grid gap-0"
                              style={{
                                gridTemplateColumns: `repeat(${sticker.gridWidth}, ${cellSize}px)`,
                                imageRendering: 'pixelated',
                              }}
                            >
                              {sticker.grid.map((row, rowIdx) =>
                                row.map((color, colIdx) => (
                                  <div
                                    key={`${rowIdx}-${colIdx}`}
                                    style={{
                                      backgroundColor: color === '#FFFFFF' ? 'transparent' : color,
                                      width: cellSize,
                                      height: cellSize,
                                    }}
                                  />
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Text preview */}
                    {stripText && (
                      <div
                        className="absolute left-0 top-0 pointer-events-none w-full"
                        style={{
                          transform: `translate(0, ${(border + (config.rows * singleH) + ((config.rows - 1) * gap) + 38) * scale}px)`,
                          textAlign: 'center'
                        }}
                      >
                        <p className="text-[10px] text-gray-800" style={{ lineHeight: 1 }}>
                          {stripText}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
              
              {stickers.length > 0 && (
                <button
                  onClick={() => setStickers([])}
                  className="text-[9px] px-3 py-1 bg-red-100 border-2 border-black font-bold hover:bg-red-200"
                >
                  🗑️ Hapus Semua Sticker
                </button>
              )}
            </div>

            {/* RIGHT: PIXEL ART CANVAS & CONTROLS */}
            <div className="space-y-4 w-full lg:max-w-md">
              {/* Frame Color */}
              <div>
                <p className="font-bold text-xs mb-2 text-retro-border">FRAME COLOR</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(frameColors).map(([name, hex]) => (
                    <button
                      key={name}
                      onClick={() => setFrameColor(name)}
                      className={`w-8 h-8 rounded-full border-2 border-black hover:scale-110 transition ${frameColor === name ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Pixel Art Canvas */}
              <div>
                <p className="font-bold text-xs mb-2 text-retro-border">GAMBAR PIXEL ART</p>
                
                {/* Color Palette */}
                <div className="flex gap-1 justify-center flex-wrap mb-3">
                  {PIXEL_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`border-2 transition-all ${
                        selectedColor === color ? 'border-pastel-purple scale-110' : 'border-black'
                      } ${color === ERASER_MARKER ? 'px-2 py-1 text-xs font-bold bg-white' : 'w-6 h-6 sm:w-8 sm:h-8'}`}
                      style={color !== ERASER_MARKER ? { backgroundColor: color } : {}}
                      title={color === ERASER_MARKER ? 'Eraser' : color}
                    >
                      {color === ERASER_MARKER ? color : ''}
                    </button>
                  ))}
                </div>

                {/* Canvas Grid */}
                <div className="flex justify-center">
                  <div 
                    className="grid gap-0 border-2 border-black bg-white"
                    style={{ 
                      gridTemplateColumns: `repeat(${PIXEL_GRID_SIZE}, minmax(0, 1fr))`,
                      width: '100%',
                      maxWidth: '280px',
                      aspectRatio: '1/1'
                    }}
                  >
                    {pixelGrid.map((row, rowIndex) =>
                      row.map((cellColor, colIndex) => (
                        <button
                          key={`${rowIndex}-${colIndex}`}
                          onClick={() => paintPixel(rowIndex, colIndex)}
                          className="aspect-square border border-gray-200 hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: cellColor }}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Canvas Actions */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={clearPixelCanvas}
                    className="p-2 bg-red-100 border-2 border-black font-bold text-[9px] hover:bg-red-200 transition-all"
                  >
                    🗑️ CLEAR
                  </button>
                  <button
                    onClick={createSticker}
                    className="p-2 bg-pastel-yellow border-2 border-black font-bold text-[9px] hover:bg-yellow-200 transition-all"
                  >
                    ✨ CREATE STICKER
                  </button>
                </div>

                {/* Saved Stickers */}
                {savedStickers.length > 0 && (
                  <div className="mt-4 p-3 bg-pastel-pink/20 border-2 border-black rounded">
                    <button
                      onClick={() => setShowSavedStickers(!showSavedStickers)}
                      className="w-full text-[9px] font-bold text-left mb-2 hover:bg-white/50 p-1"
                    >
                      {showSavedStickers ? '▼' : '▶'} SAVED STICKERS ({savedStickers.length})
                    </button>
                    
                    {showSavedStickers && (
                      <div className="space-y-2">
                        {savedStickers.map((saved, idx) => (
                          <div key={saved.id} className="flex gap-2 items-center">
                            <button
                              onClick={() => useSavedSticker(saved)}
                              className="flex-1 text-[8px] p-2 bg-white border-2 border-black font-bold hover:bg-pastel-yellow transition-all"
                            >
                              #{idx + 1} USE
                            </button>
                            <button
                              onClick={() => {
                                const updated = savedStickers.filter(s => s.id !== saved.id);
                                setSavedStickers(updated);
                                localStorage.setItem('photoboothSavedStickers', JSON.stringify(updated));
                              }}
                              className="text-[8px] p-2 bg-red-100 border-2 border-black font-bold hover:bg-red-200 transition-all whitespace-nowrap"
                            >
                              🗑️ DELETE
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Text Input */}
              <div>
                <p className="font-bold text-xs mb-2 text-retro-border">CUSTOM TEXT</p>
                <input 
                  type="text" 
                  value={stripText} 
                  onChange={(e) => setStripText(e.target.value)}
                  placeholder="Tulis teks apa saja..."
                  maxLength={50}
                  className="w-full px-3 py-2 border-2 border-black text-xs font-press"
                />
              </div>

              <button 
                onClick={downloadStrip}
                className="w-full py-3 bg-pastel-mint border-2 border-black font-press text-xs shadow-retro hover:translate-y-1 whitespace-nowrap"
              >
                DOWNLOAD PNG ⬇️
              </button>

              <button 
                onClick={() => { stopCamera(); setMode('edit'); }}
                className="w-full py-2 bg-pastel-pink border-2 border-black font-bold text-xs whitespace-nowrap"
              >
                BACK TO PHOTOS 🔄
              </button>
            </div>
          </div>
        </RetroCard>
      ) : mode === 'edit' ? (
        // === PHOTO REVIEW & RETAKE ===
        <RetroCard>
          <h3 className="text-center font-press text-sm text-retro-border mb-4">📸 REVIEW YOUR PHOTOS 📸</h3>
          
          <div className="flex flex-col gap-6 items-center">
            {/* Photos Grid - Clickable untuk retake */}
            <div 
              className="grid gap-4 p-6 border-4 border-black shadow-retro overflow-x-auto"
              style={{ 
                gridTemplateColumns: `repeat(${layoutConfig[selectedLayout].cols}, 1fr)`,
                backgroundColor: frameColors[frameColor]
              }}
            >
              {Array.from({ length: photosRequired }).map((_, i) => (
                <div 
                  key={i}
                  onClick={() => retakePhoto(i)}
                  className="border-2 border-dashed border-gray-400 cursor-pointer hover:bg-gray-100 flex items-center justify-center"
                  style={{width: layoutConfig[selectedLayout].photoAspect === '4/3' ? '160px' : '120px', height: layoutConfig[selectedLayout].photoAspect === '4/3' ? '120px' : '160px'}}
                >
                  {capturedImages[i] ? (
                    <img src={capturedImages[i]} alt="Photo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-xs text-center">Click to retake<br/>#{i+1}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button 
                onClick={() => { stopCamera(); setMode('decoration'); }}
                disabled={capturedImages.length < photosRequired}
                className="px-6 py-3 bg-pastel-mint border-2 border-black font-press text-xs shadow-retro hover:translate-y-1 disabled:opacity-50"
              >
                PIXEL DECORATION 🎨
              </button>

              <button 
                onClick={() => { 
                  setMode('idle'); 
                  setCapturedImages([]); 
                  setStickers([]); 
                  setPixelGrid(Array(PIXEL_GRID_SIZE).fill(null).map(() => Array(PIXEL_GRID_SIZE).fill('#FFFFFF'))); 
                  setStripText(''); 
                  if (videoRef.current) { void videoRef.current.play(); } 
                }}
                className="px-6 py-3 bg-pastel-pink border-2 border-black font-bold text-xs"
              >
                START OVER 🔄
              </button>
            </div>

            <p className="text-[10px] text-gray-600 text-center">
              {capturedImages.length} / {photosRequired} photos • Click any photo to retake
            </p>
          </div>
        </RetroCard>
      ) : (
        // === MAIN CAMERA & COUNTDOWN PHASE ===
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* KAMERA */}
          <div className="w-full lg:flex-1">
            <RetroCard className="relative p-0 overflow-hidden bg-black flex items-center justify-center min-h-56 sm:min-h-80">
              {!cameraActive ? (
                <div className="text-center p-8">
                  <p className="text-pastel-blue mb-4 font-press text-xs">CAMERA OFF</p>
                  <button onClick={startCamera} className="bg-pastel-yellow border-2 border-black px-6 py-3 font-press text-xs shadow-retro hover:translate-y-1 whitespace-nowrap">
                    START CAMERA 📸
                  </button>
                </div>
              ) : (
                <>
                  <canvas 
                    ref={displayCanvasRef} 
                    className="w-full h-full object-contain bg-black"
                    style={{ filter: filterPresets[selectedFilter] }}
                  />
                  
                  {mode === 'countdown' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                      <span className="text-8xl font-press text-white animate-ping drop-shadow-md">
                        {countdown}
                      </span>
                    </div>
                  )}
                </>
              )}
            </RetroCard>

            {/* Action Buttons */}
            {cameraActive && (mode === 'idle' || mode === 'capturing') && (
              <div className="space-y-2 mt-4">
                {mode === 'idle' && (
                  <button 
                    onClick={startCountdown}
                    className="w-full bg-pastel-blue border-2 border-black py-4 font-press text-sm shadow-retro active:translate-y-1 whitespace-nowrap"
                  >
                    TAKE PHOTO! ✨
                  </button>
                )}
                {mode === 'capturing' && (
                  <div className="flex gap-2">
                    {capturedImages.length < photosRequired && (
                      <button 
                        onClick={startCountdown}
                        className="flex-1 bg-pastel-green border-2 border-black py-2 font-press text-xs shadow-retro active:translate-y-1 whitespace-nowrap"
                      >
                        NEXT PHOTO →
                      </button>
                    )}
                    {capturedImages.length >= photosRequired && (
                      <button 
                        onClick={() => { stopCamera(); setMode('edit'); }}
                        className="flex-1 bg-pastel-mint border-2 border-black py-2 font-press text-xs shadow-retro active:translate-y-1 whitespace-nowrap"
                      >
                        DONE ✓
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SETTINGS */}
          <div className="w-full lg:w-80 space-y-4">
            
            {/* Progress */}
            <RetroCard className="bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-xs text-retro-border">PROGRESS</span>
                <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full">
                  {Math.min(capturedImages.length, photosRequired)} / {photosRequired}
                </span>
              </div>
              <div className="w-full bg-gray-200 border border-black h-4">
                <div 
                  className="bg-pastel-blue h-full transition-all"
                  style={{width: `${Math.min((capturedImages.length / photosRequired) * 100, 100)}%`}}
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {Array.from({ length: photosRequired }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => retakePhoto(i)}
                    className="border border-black bg-white h-16 overflow-hidden flex items-center justify-center hover:bg-gray-100"
                    title={`Retake photo ${i + 1}`}
                  >
                    {capturedImages[i] ? (
                      <img src={capturedImages[i]} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-gray-400">#{i + 1}</span>
                    )}
                  </button>
                ))}
              </div>
            </RetroCard>

            {/* Layout Selector */}
            <RetroCard className="space-y-4">
              <div>
                <label className="text-[10px] font-bold block mb-1">LAYOUT</label>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(layoutConfig).map(([key, conf]) => (
                    <button
                      key={key}
                      disabled={mode !== 'idle'}
                      onClick={() => {
                        setSelectedLayout(key as LayoutType);
                        setCapturedImages([]);
                      }}
                      className={`text-[8px] font-bold border-2 border-black py-2 ${selectedLayout === key ? 'bg-pastel-purple' : 'bg-white hover:bg-gray-50'}`}
                    >
                      {conf.name}
                    </button>
                    ))}
                  </div>
                </div>

                {/* Timer Selector */}
              <div>
                <label className="text-[10px] font-bold block mb-1">TIMER</label>
                <div className="flex gap-2">
                  {[3, 5, 10].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTimer(t as TimerOption)}
                      disabled={cameraActive && (mode === 'countdown' || mode === 'capturing')}
                      className={`flex-1 font-bold border-2 border-black py-2 text-xs ${selectedTimer === t ? 'bg-pastel-yellow' : 'bg-white'}`}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Selector */}
              <div>
                <label className="text-[10px] font-bold block mb-1">FILTER</label>
                <div className="grid grid-cols-3 gap-1 mb-2">
                  {Object.keys(filterPresets).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter as FilterOption)}
                      className={`text-[9px] font-bold border-2 border-black py-1 uppercase ${selectedFilter === filter ? 'bg-pastel-yellow' : 'bg-white'}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                
                {/* Pixelate Size Slider */}
                {selectedFilter === 'pixelate' && (
                  <div className="mt-2">
                    <label className="text-[9px] text-gray-600 block mb-1">Block Size: {pixelateSize}px</label>
                    <input
                      type="range"
                      min="4"
                      max="16"
                      step="2"
                      value={pixelateSize}
                      onChange={(e) => setPixelateSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

            </RetroCard>
          </div>
        </div>
      )}
    </div>
  );
}
