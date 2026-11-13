import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Radar,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../../utils/sound';
import { CrashSignal, Language, PlatformConfig } from '../../types';
import { ZikoLogo } from '../ZikoLogo';

interface CrashPredictorProps {
  platform: PlatformConfig;
  userId: string;
  onBack: () => void;
  lang: Language;
}

const INITIAL_SIGNALS: CrashSignal[] = [
  { id: '1', multiplier: 2.45, time: '18:42:10', confidence: 99, status: 'safe' },
  { id: '2', multiplier: 3.82, time: '18:40:45', confidence: 98, status: 'high' },
  { id: '3', multiplier: 1.94, time: '18:39:20', confidence: 99, status: 'safe' },
  { id: '4', multiplier: 7.20, time: '18:37:50', confidence: 97, status: 'ultra' },
  { id: '5', multiplier: 2.15, time: '18:36:15', confidence: 99, status: 'safe' },
];

export const CrashPredictor: React.FC<CrashPredictorProps> = ({
  platform,
  userId,
  onBack,
  lang,
}) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState<number | null>(2.84);
  const [safeExit, setSafeExit] = useState<number>(2.55);
  const [confidence, setConfidence] = useState<number>(99);
  const [prevSignals, setPrevSignals] = useState<CrashSignal[]>(INITIAL_SIGNALS);
  const [flightProgress, setFlightProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlightProgress((p) => (p >= 100 ? 0 : p + 2));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleGetPrediction = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setCurrentMultiplier(null);
    sound.playScan();

    let ticks = 0;
    const ticker = setInterval(() => {
      ticks++;
      sound.playRadarTick();
      if (ticks >= 8) {
        clearInterval(ticker);
      }
    }, 200);

    setTimeout(() => {
      clearInterval(ticker);
      const baseMults = [1.88, 2.14, 2.45, 2.92, 3.15, 3.84, 4.20, 5.65];
      const selected = baseMults[Math.floor(Math.random() * baseMults.length)];
      const safe = parseFloat((selected * 0.9).toFixed(2));
      const conf = Math.floor(Math.random() * 2) + 98;

      setCurrentMultiplier(selected);
      setSafeExit(safe);
      setConfidence(conf);
      setIsCalculating(false);
      sound.playSignalLocked();

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      setPrevSignals((prev) => [
        {
          id: String(Date.now()),
          multiplier: selected,
          time: timeStr,
          confidence: conf,
          status: selected > 5 ? 'ultra' : selected > 3 ? 'high' : 'safe',
        },
        ...prev.slice(0, 5),
      ]);
    }, 1800);
  };

  return (
    <div className="flex flex-col min-h-full py-6 px-4 sm:px-6 max-w-md mx-auto w-full gap-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-red-700/60 transition-all active:scale-95 cursor-pointer"
          title="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <ZikoLogo size="sm" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 border border-red-800/50 rounded-full shadow-[0_0_12px_rgba(153,27,27,0.3)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] font-black tracking-wider uppercase text-red-400 font-cyber">
              NEMAR VIP
            </span>
          </div>
        </div>
      </div>

      {/* Main Title & Radar Status */}
      <div className="flex items-center justify-between p-3.5 bg-zinc-950/80 border border-red-950/60 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-950/70 border border-red-800/50 flex items-center justify-center text-red-500">
            <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black font-cyber text-white">CRASH AVIATOR</span>
            <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              SYSTEM ACTIVE • {platform.name}
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-xl bg-red-950/70 border border-red-800/50 text-red-400 font-mono-cyber font-black text-xs">
          99% VIP
        </span>
      </div>

      {/* Interactive Flight Canvas / Flight Display */}
      <div className="relative bg-zinc-950/90 backdrop-blur-2xl border-2 border-red-900/60 rounded-[32px] p-5 sm:p-6 min-h-[260px] flex flex-col justify-between overflow-hidden shadow-[0_0_35px_rgba(153,27,27,0.3)]">
        {/* Background Radar Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#991b1b_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

        {/* Flight Curve SVG */}
        <div className="relative h-32 w-full mt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120">
            <line x1="0" y1="120" x2="300" y2="120" stroke="#222" strokeWidth="1" />
            <line x1="0" y1="80" x2="300" y2="80" stroke="#241418" strokeWidth="0.8" strokeDasharray="3,3" />
            <line x1="0" y1="40" x2="300" y2="40" stroke="#241418" strokeWidth="0.8" strokeDasharray="3,3" />

            <path
              d="M 10 115 Q 140 105 280 25"
              fill="none"
              stroke="url(#curveGradientCrimson)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="curveGradientCrimson" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#b91c1c" stopOpacity="1" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
              </linearGradient>
            </defs>

            <g transform={`translate(${10 + (270 * flightProgress) / 100}, ${115 - (90 * Math.pow(flightProgress / 100, 1.6))})`}>
              <circle r="4" fill="#dc2626" className="animate-ping" opacity="0.6" />
              <g transform="rotate(-25)">
                <path
                  d="M0 -6 L12 0 L0 6 L3 0 Z"
                  fill="#ffffff"
                  stroke="#dc2626"
                  strokeWidth="1.5"
                />
              </g>
            </g>
          </svg>
        </div>

        {/* Multiplier Big Display */}
        <div className="relative text-center my-3">
          {isCalculating ? (
            <div className="space-y-1.5 py-4">
              <span className="text-sm font-black font-mono-cyber text-red-400 tracking-widest animate-pulse">
                CALCULATING TRAJECTORY...
              </span>
              <div className="w-36 mx-auto bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-red-900 to-red-500 h-full w-full animate-pulse shadow-neon-crimson" />
              </div>
            </div>
          ) : currentMultiplier ? (
            <div className="space-y-1">
              <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                TARGET MULTIPLIER
              </span>
              <div className="text-5xl sm:text-6xl font-black font-mono-cyber text-white text-glow-crimson tracking-tight">
                {currentMultiplier.toFixed(2)}
                <span className="text-red-500 text-3xl sm:text-4xl">x</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-emerald-400 text-xs font-bold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  Safe Exit: {safeExit.toFixed(2)}x
                </span>
              </div>
            </div>
          ) : (
            <div className="py-4 text-zinc-500 text-xs font-mono">
              Waiting for Signal...
            </div>
          )}
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
          <div className="p-2 rounded-xl bg-zinc-900/80 border border-white/5">
            <span className="block text-[9px] text-zinc-400 font-bold uppercase">
              CONFIDENCE
            </span>
            <span className="text-xs font-black font-mono text-emerald-400">{confidence}%</span>
          </div>

          <div className="p-2 rounded-xl bg-zinc-900/80 border border-white/5">
            <span className="block text-[9px] text-zinc-400 font-bold uppercase">
              MARKET
            </span>
            <span className="text-xs font-black font-mono text-white">
              UPTREND ↗
            </span>
          </div>

          <div className="p-2 rounded-xl bg-zinc-900/80 border border-white/5">
            <span className="block text-[9px] text-zinc-400 font-bold uppercase">
              VOLATILITY
            </span>
            <span className="text-xs font-black font-mono text-red-400">
              MODERATE
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleGetPrediction}
        disabled={isCalculating}
        className="w-full h-13 rounded-2xl bg-gradient-to-r from-red-900 via-red-800 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-crimson border border-red-600/30 active:scale-[0.98] transition-all cursor-pointer"
      >
        <Sparkles className="w-4 h-4" />
        <span>
          {isCalculating ? 'PROCESSING DATA...' : 'GET LIVE PREDICTION'}
        </span>
      </button>

      {/* Previous Signals History Log */}
      <div className="rounded-2xl border border-red-950/60 bg-zinc-950/80 p-4 backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-400" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Previous Signals
            </h3>
          </div>
          <span className="text-[10px] font-mono text-red-400 bg-red-950/60 px-2 py-0.5 rounded-full border border-red-800/40">
            VERIFIED
          </span>
        </div>

        <div className="space-y-2">
          {prevSignals.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-white/5 text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-zinc-400 text-[11px]">{item.time}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500">{item.confidence}%</span>
                <span className="px-2 py-0.5 rounded-lg bg-red-950/70 border border-red-800/40 text-red-400 font-black text-xs font-mono-cyber">
                  {item.multiplier.toFixed(2)}x
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
