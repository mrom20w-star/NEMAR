import React from 'react';
import { ZikoLogo } from './ZikoLogo';

interface HeaderProps {
  onlineCount: number;
  latency: string;
}

export const Header: React.FC<HeaderProps> = ({
  onlineCount,
  latency,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#06070a]/90 border-b border-red-900/30 px-3.5 sm:px-6 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand: NEMAR */}
        <div className="flex items-center gap-2.5">
          <ZikoLogo size="sm" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-cyber font-black tracking-wider text-base sm:text-lg text-white">
                <span className="text-red-500 text-glow-crimson">NEMAR</span>
              </span>
              <span className="text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded bg-red-950/60 border border-red-700/50 text-red-400">
                VIP
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono-cyber font-bold text-red-400">{latency}</span>
              <span>•</span>
              <span className="font-mono-cyber text-zinc-300 font-semibold">
                {onlineCount.toLocaleString()} Online
              </span>
            </div>
          </div>
        </div>

        {/* Live Server Status Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/50 border border-red-800/50 text-xs font-mono font-bold text-red-400 shadow-[0_0_12px_rgba(153,27,27,0.3)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-cyber font-black tracking-wide">LIVE SERVER</span>
          </div>
        </div>
      </div>
    </header>
  );
};
