import { ReactNode } from 'react';

interface RetroCardProps {
  children: ReactNode;
  className?: string;
  clickable?: boolean;
  title?: string;
}

export default function RetroCard({ 
  children, 
  className = '', 
  clickable = false,
  title 
}: RetroCardProps) {
  const baseStyles = "bg-white border-4 border-retro-border p-4 sm:p-6 shadow-retro transition-all";
  const clickableStyles = clickable 
    ? "cursor-pointer hover:shadow-retro-hover active:translate-y-1 active:shadow-none" 
    : "";

  return (
    <div className={`${baseStyles} ${clickableStyles} ${className}`}>
      {title && (
        <h3 className="font-press text-[10px] sm:text-xs mb-3 sm:mb-4 text-pastel-yellow uppercase tracking-wide break-words drop-shadow-lg">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
