import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Sparkles,
  RotateCcw,
  Play,
  ShieldCheck,
  Zap,
  Radio,
} from 'lucide-react';
import { sound } from '../../utils/sound';
import { Language, PlatformConfig } from '../../types';
import { ZikoLogo } from '../ZikoLogo';
import {
  saveApplePredictions,
  generateApplePredictionsData,
} from '../../services/firebase';

interface ApplePredictorProps {
  platform: PlatformConfig;
  userId: string;
  onBack: () => void;
  lang: Language;
}

const TARGET_ROWS = [
  { mult: 'x349.68', row: 9, label: 'Row 10 (Top)' },
  { mult: 'x69.93', row: 8, label: 'Row 9' },
  { mult: 'x27.92', row: 7, label: 'Row 8' },
  { mult: 'x11.18', row: 6, label: 'Row 7' },
  { mult: 'x6.71', row: 5, label: 'Row 6' },
  { mult: 'x4.02', row: 4, label: 'Row 5' },
  { mult: 'x2.41', row: 3, label: 'Row 4' },
  { mult: 'x1.93', row: 2, label: 'Row 3' },
  { mult: 'x1.54', row: 1, label: 'Row 2' },
  { mult: 'x1.23', row: 0, label: 'Row 1 (Start)' },
];

export const ApplePredictor: React.FC<ApplePredictorProps> = ({
  platform,
  userId,
  onBack,
  lang,
}) => {
  const [predictions, setPredictions] = useState<Record<string, Record<string, string>>>({});
  const [hasRevealed, setHasRevealed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeOnline, setActiveOnline] = useState(3840);
  const [scanStep, setScanStep] = useState(0);
  const [roundNumber, setRoundNumber] = useState(0);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveOnline((prev) => prev + (Math.floor(Math.random() * 7) - 3));
    }, 4000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const isSafeApple = (rowIdx: number, colIdx: number): boolean => {
    if (!predictions || Object.keys(predictions).length === 0) return false;

    let root: Record<string, unknown> = predictions as Record<string, unknown>;
    if (!('m1' in predictions) && predictions.m11 && typeof predictions.m11 === 'object') {
      const candidate = predictions.m11 as Record<string, unknown>;
      if ('m1' in candidate || 'm2' in candidate) {
        root = candidate;
      }
    }

    const mIndex = rowIdx * 5 + colIdx + 1;
    const mKey = `m${mIndex}`;

    const cell: unknown =
      root[mKey] ??
      root[String(mIndex)] ??
      (Array.isArray(root) ? root[mIndex] : undefined);

    if (cell === undefined || cell === null) return false;

    if (typeof cell === 'object') {
      const obj = cell as Record<string, unknown>;
      const val = obj[mKey] ?? obj[String(mIndex)] ?? obj.val ?? obj.value ?? Object.values(obj)[0];
      return String(val) === '1' || val === true || val === 1;
    }

    return String(cell) === '1' || cell === true || cell === 1;
  };

  const handleStartRound = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setHasRevealed(false);
    setScanStep(0);
    sound.playScan();

    const scanInterval = setInterval(() => {
      setScanStep((s) => (s + 1) % 10);
      sound.playRadarTick();
    }, 100);

    const newPreds = generateApplePredictionsData();

    try {
      await saveApplePredictions(newPreds);
    } catch (e) {
      console.warn('Firebase RTDB save error:', e);
    }

    setTimeout(() => {
      clearInterval(scanInterval);
      setPredictions(newPreds);
      setRoundNumber((prev) => prev + 1);
      const nowStr = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastUpdatedTime(nowStr);
      setIsAnalyzing(false);
      setHasRevealed(true);
      sound.playSuccess();
    }, 1100);
  };

  const handleReset = () => {
    sound.playClick();
    setHasRevealed(false);
  };

  return (
    <div className="flex flex-col min-h-full py-6 px-3.5 sm:px-6 max-w-lg mx-auto w-full gap-4">
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

      {/* Hero Title with 3D Apple Image */}
      <div className="p-3.5 bg-zinc-950/85 backdrop-blur-2xl border border-red-950/60 rounded-3xl shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-500/60 p-0.5 bg-black shadow-[0_0_20px_rgba(52,211,153,0.4)] shrink-0">
            <img
              src="/apple-official.png"
              alt="Apple of Fortune"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-white tracking-wide font-cyber">
              APPLE OF FORTUNE PREDICTOR
            </h1>
            <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              NEMAR Live Server ({platform.name}) • 99% Accuracy
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-xl bg-red-950/70 border border-red-800/50 text-red-400 font-mono-cyber font-black text-xs">
          VIP
        </span>
      </div>

      {/* Live Round Sync Banner */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-950/85 border border-red-950/60 rounded-2xl text-xs backdrop-blur-md">
        <div className="flex items-center gap-2">
          {roundNumber > 0 ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-zinc-300">Server Sync:</span>
              <span className="px-2 py-0.5 rounded-lg bg-red-950/70 border border-red-800/50 text-red-400 font-mono-cyber font-black text-xs">
                Round #{roundNumber}
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-bold text-zinc-300">Server Sync:</span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-xs">
                Waiting to Start
              </span>
            </>
          )}
        </div>

        {lastUpdatedTime ? (
          <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Updated: {lastUpdatedTime}
          </span>
        ) : (
          <span className="text-[10px] text-zinc-500 font-medium">
            Click "Start Round"
          </span>
        )}
      </div>

      {/* Matrix Container */}
      <div className="relative bg-zinc-950/90 backdrop-blur-2xl border-2 border-red-900/60 rounded-[28px] p-3 sm:p-5 shadow-[0_0_35px_rgba(153,27,27,0.3)]">
        {/* Background circuit grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#991b1b_1px,transparent_1px)] [background-size:18px_18px] opacity-15 pointer-events-none rounded-[28px]" />

        {/* Column Numbers Header: C1 | C2 | C3 | C4 | C5 */}
        <div className="flex items-center gap-2 sm:gap-3 px-1 pb-1 mb-1 border-b border-white/5" dir="ltr">
          <div className="w-14 sm:w-16 shrink-0 text-center">
            <span className="text-[9px] font-black font-mono text-zinc-500 uppercase tracking-widest">
              ODDS
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 flex-1">
            {[1, 2, 3, 4, 5].map((colNum) => (
              <div key={colNum} className="text-center">
                <span className="text-[10px] font-black font-mono-cyber text-zinc-400 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-white/5">
                  C{colNum}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 10 Rows Matrix Container */}
        <div className="relative z-10 flex flex-col gap-1.5" dir="ltr">
          {TARGET_ROWS.map((rowInfo) => {
            const isScanningThisRow = isAnalyzing && scanStep === (9 - rowInfo.row);

            return (
              <div
                key={rowInfo.row}
                className={`flex items-center gap-2 sm:gap-3 p-1 rounded-xl transition-all duration-300 ${
                  isScanningThisRow
                    ? 'bg-red-950/60 border border-red-700/70 shadow-[0_0_12px_rgba(185,28,28,0.4)] scale-[1.01]'
                    : 'bg-zinc-900/40 border border-white/5'
                }`}
              >
                {/* Multiplier Tag ON LEFT SIDE */}
                <div className="w-14 sm:w-16 shrink-0 flex flex-col items-start leading-tight pl-1">
                  <span className="text-[11px] sm:text-xs font-black font-mono-cyber text-red-400 tracking-tight">
                    {rowInfo.mult}
                  </span>
                  <span className="text-[8px] text-zinc-500 font-medium">
                    Row {rowInfo.row + 1}
                  </span>
                </div>

                {/* The 5 Apple Columns */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2 flex-1">
                  {Array.from({ length: 5 }).map((_, cIdx) => {
                    const isSafe = isSafeApple(rowInfo.row, cIdx);
                    const isPrimarySafe =
                      isSafe &&
                      !Array.from({ length: cIdx }).some((_, prevC) => isSafeApple(rowInfo.row, prevC));

                    return (
                      <div
                        key={cIdx}
                        className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative transition-all duration-300 overflow-hidden select-none ${
                          hasRevealed && isSafe
                            ? isPrimarySafe
                              ? 'border-2 border-amber-400 bg-gradient-to-b from-emerald-950/90 via-black to-zinc-950 shadow-[0_0_22px_rgba(245,158,11,0.6)] scale-105 z-10'
                              : 'border-2 border-emerald-400 bg-gradient-to-b from-emerald-950/90 via-black to-zinc-950 shadow-[0_0_18px_rgba(52,211,153,0.7)] scale-105 z-10'
                            : hasRevealed && !isSafe
                            ? 'border border-red-900/30 bg-zinc-950/60 opacity-30'
                            : isScanningThisRow
                            ? 'border-red-700/70 bg-red-950/40'
                            : 'border-white/10 bg-zinc-900/70 hover:border-red-900/40'
                        }`}
                      >
                        {hasRevealed && isSafe && isPrimarySafe && (
                          <div className="absolute top-0.5 right-0.5 z-20 bg-amber-500 text-black text-[7px] font-black px-1 rounded-full shadow-sm">
                            ⭐
                          </div>
                        )}
                        {hasRevealed ? (
                          isSafe ? (
                            <div className="w-full h-full p-1 flex items-center justify-center animate-in zoom-in-75 duration-300">
                              <img
                                src="/apple-official.png"
                                alt="Safe Apple"
                                className="w-[88%] h-[88%] object-contain rounded-lg drop-shadow-[0_0_10px_rgba(52,211,153,0.9)]"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full p-1 flex items-center justify-center opacity-30">
                              <img
                                src="/apple-bad.jpg"
                                alt="Bad Apple"
                                className="w-[80%] h-[80%] object-contain rounded-lg grayscale contrast-125"
                              />
                            </div>
                          )
                        ) : isAnalyzing ? (
                          <div
                            className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#dc2626] animate-ping"
                            style={{ animationDelay: `${cIdx * 100}ms` }}
                          />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-zinc-700/60 border border-white/10 shadow-sm" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Status notice */}
        <div className="mt-3 text-center">
          {isAnalyzing ? (
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-red-400">
              <Sparkles className="w-4 h-4 animate-spin text-red-500" />
              <span>Analyzing path & detecting safe apples...</span>
            </div>
          ) : hasRevealed ? (
            <div className="flex items-center justify-center gap-1.5 text-xs font-black text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Winning path from Row 1 to Row 10 revealed successfully!</span>
            </div>
          ) : (
            <p className="text-xs text-zinc-400">
              Click "Start Round" to reveal safe apple positions
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={handleStartRound}
          disabled={isAnalyzing}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-red-900 via-red-800 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-crimson border border-red-600/30 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>
            {isAnalyzing
              ? 'Scanning & Generating New Round...'
              : hasRevealed
              ? `Start New Round (Update Round #${roundNumber + 1})`
              : 'Start Round (Reveal Live Predictions)'}
          </span>
        </button>

        {hasRevealed && (
          <button
            onClick={handleReset}
            className="w-full h-10 rounded-xl bg-zinc-900 border border-white/10 hover:border-red-800/50 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Hide Current Predictions</span>
          </button>
        )}
      </div>

      {/* Live Server Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-zinc-950/80 border border-red-950/60 rounded-2xl flex items-center gap-2.5 backdrop-blur-md">
          <Zap className="w-4 h-4 text-red-500" />
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
              Active Online
            </span>
            <span className="text-xs font-black font-mono-cyber text-white">
              {activeOnline.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-3 bg-zinc-950/80 border border-red-950/60 rounded-2xl flex items-center gap-2.5 backdrop-blur-md">
          <Radio className="w-4 h-4 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
              Server Status
            </span>
            <span className="text-xs font-black font-mono text-emerald-400">
              LIVE SYNC 99%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
