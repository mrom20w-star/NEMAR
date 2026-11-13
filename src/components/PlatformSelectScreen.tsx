import React from 'react';
import { ShieldCheck, Zap, Radio, ChevronRight, CheckCircle2, Award, Flame } from 'lucide-react';
import { PLATFORMS } from '../data/platforms';
import { PlatformConfig, Language } from '../types';
import { sound } from '../utils/sound';
import { ZikoLogo } from './ZikoLogo';

interface PlatformSelectScreenProps {
  selectedPlatform: PlatformConfig;
  onSelectPlatform: (platform: PlatformConfig) => void;
  onProceed: () => void;
  lang: Language;
}

export const PlatformSelectScreen: React.FC<PlatformSelectScreenProps> = ({
  selectedPlatform,
  onSelectPlatform,
  onProceed,
  lang,
}) => {
  return (
    <div className="flex flex-col min-h-full py-6 px-4 sm:px-6 max-w-md mx-auto w-full gap-5">
      {/* Top Banner / Hero */}
      <div className="text-center space-y-2.5">
        <div className="flex justify-center">
          <ZikoLogo size="lg" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-xs font-bold text-red-400 shadow-[0_0_14px_rgba(153,27,27,0.35)]">
          <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
          <span>NEMAR Official VIP Portal</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Certified Platform
        </h1>

        <p className="text-xs text-zinc-400 font-medium max-w-xs mx-auto leading-relaxed">
          Official {selectedPlatform.name} server synced with NEMAR algorithms at 99% accuracy
        </p>
      </div>

      {/* Platform List */}
      <div className="space-y-3.5">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatform.id === platform.id;
          return (
            <div
              key={platform.id}
              onClick={() => {
                sound.playClick();
                onSelectPlatform(platform);
              }}
              className={`relative rounded-2xl border p-4 transition-all duration-300 cursor-pointer overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-r from-red-950/80 via-[#0b0608] to-zinc-950 border-red-700 shadow-[0_0_25px_rgba(153,27,27,0.45)] scale-[1.01]'
                  : 'bg-zinc-950/70 border-white/10 hover:border-red-900/50 hover:bg-zinc-900/60'
              }`}
            >
              {platform.recommended && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-red-900 to-red-700 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-xl flex items-center gap-1 shadow-md">
                  <Flame className="w-3 h-3 text-amber-300" />
                  RECOMMENDED VIP
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-black border border-red-900/40 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    <img
                      src={platform.img}
                      alt={platform.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-white font-cyber tracking-wide">
                        {platform.name}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-red-500 fill-red-500/20" />
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-400 font-medium truncate">
                      {platform.tagline}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="px-2 py-0.5 rounded-lg bg-red-950/70 border border-red-800/50 text-[11px] font-black text-red-400 font-mono">
                    {platform.accuracy}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500 mt-1">
                    {platform.latency}
                  </span>
                </div>
              </div>

              {/* Extra badges */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
                <span className="flex items-center gap-1 text-red-400 font-bold">
                  <Zap className="w-3 h-3" />
                  {platform.geo}
                </span>
                <span className="font-mono text-zinc-500">
                  Official Promo Code:{' '}
                  <strong className="text-white font-mono-cyber">{platform.promoCode}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Server specs */}
      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-red-950/50 flex items-center justify-center gap-1.5 text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
          <span className="text-[10px] font-bold">
            100% Encrypted Security
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-red-950/50 flex items-center justify-center gap-1.5 text-zinc-400">
          <Award className="w-3.5 h-3.5 text-red-400" />
          <span className="text-[10px] font-bold">
            Instant Certified Server
          </span>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={() => {
          sound.playSuccess();
          onProceed();
        }}
        className="w-full h-13 rounded-2xl bg-gradient-to-r from-red-900 via-red-800 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-crimson border border-red-600/30 active:scale-[0.98] transition-all cursor-pointer mt-2"
      >
        <span>
          Continue Activation ({selectedPlatform.name})
        </span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
