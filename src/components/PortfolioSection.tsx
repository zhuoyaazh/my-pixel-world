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
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pastel-purple via-pastel-blue to-pastel-pink" />

            {/* Year Dot & Label */}
            <div className="relative ml-8 pb-8">
              {/* Dot */}
              <div className="absolute -left-7 top-2 w-5 h-5 bg-white border-2 border-retro-border rounded-full shadow-retro" />

              {/* Year Badge */}
              <div className="mb-4">
                <span className="inline-block bg-pastel-yellow border-2 border-retro-border px-3 py-1 font-press text-xs rounded">
                  {entry.year}
                </span>
              </div>

              {/* Positions/Roles */}
              <div className="space-y-3">
                {items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="bg-white border-2 border-retro-border p-4 shadow-retro hover:shadow-retro-hover transition-all"
                  >
                    <p className="font-press text-sm text-retro-border mb-1 uppercase">
                      {item.role}
                    </p>
                    <p className="text-xs text-retro-text flex items-center gap-2 mb-2">
                      <span>{isCommittee ? '🎯' : '🏢'}</span>
                      <strong>{isCommittee ? (item as any).event : (item as any).org}</strong>
                    </p>
                    {item.description && (
                      <p className="text-xs text-retro-text/60 italic pl-5 border-l-2 border-pastel-purple/30">
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
