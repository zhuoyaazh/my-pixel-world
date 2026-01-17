'use client';

import { OrgEntry, CommitteeEntry } from '@/config/portfolio';

interface PortfolioSectionProps {
  data: OrgEntry[] | CommitteeEntry[];
  isCommittee?: boolean;
}

export default function PortfolioSection({ data, isCommittee = false }: PortfolioSectionProps) {
  // Reverse data untuk tampilkan yang terbaru duluan
  const reversedData = [...data].reverse();

  return (
    <div className="space-y-0">
      {reversedData.map((entry, idx) => {
        const items = isCommittee
          ? (entry as CommitteeEntry).roles
          : (entry as OrgEntry).positions;

        return (
          <div key={idx} className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-pastel-purple via-pastel-blue to-pastel-pink" />

            {/* Year Dot & Label */}
            <div className="relative ml-8 pb-8">
              {/* Dot */}
              <div className="absolute -left-7 top-2 w-5 h-5 bg-white border-2 border-retro-border rounded-full shadow-retro" />

              {/* Year Badge */}
              <div className="mb-4">
                <span className="inline-block bg-pastel-yellow border-2 border-retro-border px-2 sm:px-3 py-1 font-press text-[10px] sm:text-xs rounded">
                  {entry.year}
                </span>
              </div>

              {/* Positions/Roles */}
              <div className="space-y-3">
                {items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="bg-white border-2 border-retro-border p-3 sm:p-4 shadow-retro hover:shadow-retro-hover transition-all"
                  >
                    <p className="font-press text-[10px] sm:text-xs md:text-sm text-retro-border mb-1 uppercase leading-relaxed wrap-break-word">
                      {item.role}
                    </p>
                    <p className="text-[10px] sm:text-xs text-retro-text flex items-start gap-2 mb-2 flex-wrap">
                      <span className="shrink-0">{isCommittee ? '🎯' : '🏢'}</span>
                      <strong className="wrap-break-word flex-1 text-retro-border">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {isCommittee ? (item as any).event : (item as any).org}
                      </strong>
                    </p>
                    {item.description && (
                      <p className="text-[10px] sm:text-xs text-retro-text/60 italic pl-3 sm:pl-5 border-l-2 border-pastel-purple/30 wrap-break-word leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
