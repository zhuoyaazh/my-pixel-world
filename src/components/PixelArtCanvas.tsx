'use client';

import { useState } from 'react';

type PixelArtLabels = {
  clear?: string;
};

const GRID_SIZE = 16;
const COLORS = ['#FFD1DC', '#FFDAB9', '#E6E6FA', '#B0E0E6', '#98D8C8', '#000000', '#FFFFFF'];

export default function PixelArtCanvas({ labels = {} as PixelArtLabels }) {
  const [grid, setGrid] = useState<string[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('#FFFFFF'))
  );
  const [selectedColor, setSelectedColor] = useState('#000000');

  const paintCell = (row: number, col: number) => {
    const newGrid = [...grid];
    newGrid[row][col] = selectedColor;
    setGrid(newGrid);
  };

  const clearCanvas = () => {
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('#FFFFFF')));
  };

  return (
    <div className="space-y-3">
      {/* Color Palette */}
      <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-6 h-6 sm:w-8 sm:h-8 border-2 transition-all ${
              selectedColor === color ? 'border-pastel-purple scale-110' : 'border-black'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      {/* Canvas Grid */}
      <div className="flex justify-center">
        <div 
          className="grid gap-0 border-2 border-black bg-white"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: '100%',
            maxWidth: '280px',
            aspectRatio: '1/1'
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cellColor, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => paintCell(rowIndex, colIndex)}
                className="aspect-square border border-gray-200 hover:opacity-80 transition-opacity"
                style={{ backgroundColor: cellColor }}
              />
            ))
          )}
        </div>
      </div>

      {/* Clear Button */}
      <button
        onClick={clearCanvas}
        className="w-full p-2 bg-pastel-purple border-2 border-black font-bold text-[8px] sm:text-[9px] hover:bg-opacity-80 transition-all"
      >
        {labels.clear ?? '🗑️ CLEAR CANVAS'}
      </button>
    </div>
  );
}
