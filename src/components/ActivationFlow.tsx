import React, { useState, useRef } from 'react';
import {
  Copy,
  Check,
  DollarSign,
  Coins,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  Fingerprint,
  Loader2,
  AlertCircle,
  Smartphone,
  KeyRound,
  Lock,
  Unlock,
} from 'lucide-react';
import { PlatformConfig, Language } from '../types';
import { sound } from '../utils/sound';
import { ZikoLogo } from './ZikoLogo';

interface ActivationFlowProps {
  platform: PlatformConfig;
  onBack: () => void;
  onComplete: (userId: string, verifiedPassword: string) => void;
  lang: Language;
}

const REQUIRED_PASSWORD = 'NEMAR_AXC9';

export const ActivationFlow: React.FC<ActivationFlowProps> = ({
  platform,
  onBack,
  onComplete,
  lang,
}) => {
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const codeInputRef = useRef<HTMLInputElement>(null);

  const promoCode = platform.promoCode || 'AXC9';

  const isPasswordValid = activationCode.trim() === REQUIRED_PASSWORD;

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(promoCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLockedIdAttempt = () => {
    if (!isPasswordValid) {
      sound.playClick();
      setErrorMsg('Please enter the valid activation code in "Enter Activation Code" below first before entering your ID.');
      codeInputRef.current?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      sound.playClick();
      setErrorMsg('Invalid activation code! Please enter the certified activation code first.');
      codeInputRef.current?.focus();
      return;
    }

    if (!userId.trim()) {
      setErrorMsg('Please enter your Account ID first.');
      return;
    }

    if (userId.trim().length < 5) {
      setErrorMsg('Account ID must be at least 5 digits.');
      return;
    }

    setErrorMsg(null);
    setIsVerifying(true);
    setVerifyStep(1);
    sound.playScan();

    setTimeout(() => {
      setVerifyStep(2);
      sound.playRadarTick();
    }, 450);

    setTimeout(() => {
      setVerifyStep(3);
      sound.playRadarTick();
    }, 850);

    setTimeout(() => {
      setIsVerifying(false);
      sound.playSuccess();
      onComplete(userId.trim(), activationCode.trim());
    }, 1250);
  };

  return (
    <div className="flex flex-col min-h-full py-6 px-4 sm:px-6 max-w-md mx-auto w-full gap-5">
      {/* Header with back button */}
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
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-950/60 border border-red-800/50 rounded-full shadow-[0_0_12px_rgba(153,27,27,0.3)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-black font-cyber text-red-400 uppercase tracking-wider">
              NEMAR VIP
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-1.5">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Activation & Direct Sync Steps
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Complete the steps below to enable live synchronization with {platform.name} server
        </p>
      </div>

      {/* STEPS CONTAINER */}
      <div className="space-y-4">
        {/* Step 1: Download App & Create Account */}
        <div className="rounded-2xl border border-red-950/60 bg-zinc-950/75 p-4.5 backdrop-blur-md shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-red-800 to-red-950 border border-red-600/40 text-white flex items-center justify-center font-black text-xs shadow-neon-crimson">
                1
              </div>
              <h2 className="text-sm font-black text-white">
                Download {platform.name} & Register
              </h2>
            </div>
            <span className="text-[10px] font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded-full border border-red-800/50">
              Required
            </span>
          </div>

          <div className="flex items-center gap-3 bg-zinc-900/80 border border-white/5 p-3 rounded-xl">
            <div className="w-11 h-11 rounded-xl bg-black border border-red-950/60 p-1 flex items-center justify-center shrink-0 overflow-hidden">
              <img src={platform.img} alt={platform.name} className="w-full h-full object-contain" />
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Use the official {platform.name} platform to register your account and activate live server synchronization.
            </p>
          </div>
        </div>

        {/* Step 2: Promo Code */}
        <div className="rounded-2xl border border-red-950/60 bg-zinc-950/75 p-4.5 backdrop-blur-md shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-red-800 to-red-950 border border-red-600/40 text-white flex items-center justify-center font-black text-xs shadow-neon-crimson">
                2
              </div>
              <h2 className="text-sm font-black text-white">
                Enter Promo Code ({promoCode})
              </h2>
            </div>
            <span className="text-[10px] font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded-full border border-red-800/50">
              Registration Code
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Use the certified promo code during registration to link your {platform.name} account to NEMAR server with 99% accuracy:
          </p>

          <div
            onClick={handleCopyCode}
            className="relative bg-zinc-900/90 rounded-xl border-2 border-dashed border-red-800/70 hover:border-red-600 p-3.5 transition-all cursor-pointer group shadow-neon-crimson flex items-center justify-between"
          >
            <div>
              <span className="block text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">
                Official Promo Code
              </span>
              <span className="text-3xl font-black font-mono-cyber tracking-widest text-red-500 text-glow-crimson">
                {promoCode}
              </span>
            </div>

            <button
              type="button"
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                copied
                  ? 'bg-red-800 text-white shadow-neon-crimson'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step 3: Minimum Deposit */}
        <div className="rounded-2xl border border-red-950/60 bg-zinc-950/75 p-4.5 backdrop-blur-md shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-red-800 to-red-950 border border-red-600/40 text-white flex items-center justify-center font-black text-xs shadow-neon-crimson">
                3
              </div>
              <h2 className="text-sm font-black text-white">
                Minimum Deposit
              </h2>
            </div>
            <span className="text-[10px] font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded-full border border-red-800/50">
              Algorithm Sync
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Make your first minimum deposit to activate live synchronization with the prediction server:
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-zinc-900/90 border border-red-950/60 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-inner">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-red-500" /> USD ($)
              </span>
              <span className="text-xl font-black text-white font-mono-cyber">$4.00</span>
            </div>

            <div className="bg-zinc-900/90 border border-red-950/60 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-inner">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Coins className="w-3 h-3 text-red-500" /> EGP
              </span>
              <span className="text-xl font-black text-red-500 font-mono-cyber">180 EGP</span>
            </div>
          </div>
        </div>

        {/* Step 4: ID Verification + "Enter Activation Code" directly underneath */}
        <div className="rounded-2xl border-2 border-red-800/60 bg-zinc-950/90 p-4.5 backdrop-blur-md shadow-[0_0_28px_rgba(153,27,27,0.3)] space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-red-800 to-red-950 border border-red-600/40 text-white flex items-center justify-center font-black text-xs shadow-neon-crimson">
                4
              </div>
              <h2 className="text-sm font-black text-white">
                Verify Account ID & Activation Code
              </h2>
            </div>
            <span className="text-[10px] font-bold text-red-400 bg-red-950/70 px-2 py-0.5 rounded-full border border-red-800/50">
              Access Required
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            First enter the password in <strong className="text-red-400">"Enter Activation Code"</strong> below, then enter your Account ID to access the script:
          </p>

          <form onSubmit={handleVerify} className="space-y-3">
            {/* Field 1: Account ID (Locked until valid password is entered below) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-zinc-300">
                  Account ID
                </label>
                {isPasswordValid ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <Unlock className="w-3 h-3" />
                    Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Locked until code is entered
                  </span>
                )}
              </div>

              <div
                onClick={handleLockedIdAttempt}
                className="relative"
              >
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-zinc-500">
                  <Fingerprint className={`w-4 h-4 ${isPasswordValid ? 'text-emerald-400' : 'text-red-700'}`} />
                </div>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => {
                    if (!isPasswordValid) return;
                    setUserId(e.target.value.replace(/[^0-9]/g, ''));
                    if (errorMsg) setErrorMsg(null);
                  }}
                  readOnly={!isPasswordValid}
                  disabled={isVerifying}
                  placeholder={
                    isPasswordValid
                      ? 'Enter your Account ID (e.g. 74829105)'
                      : 'Enter activation code below first to unlock ID...'
                  }
                  className={`w-full h-12 rounded-xl ps-10 pe-4 font-mono-cyber tracking-wider text-sm transition-all outline-none ${
                    isPasswordValid
                      ? 'bg-zinc-900 border border-emerald-600/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white'
                      : 'bg-zinc-950/90 border border-red-900/50 text-zinc-500 cursor-not-allowed placeholder:text-zinc-600 placeholder:text-xs'
                  }`}
                />
              </div>
            </div>

            {/* Field 2: Activation Code directly under ID */}
            <div>
              <label className="block text-[11px] font-bold text-red-300 mb-1">
                Enter Activation Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-zinc-500">
                  <KeyRound className={`w-4 h-4 ${isPasswordValid ? 'text-emerald-400' : 'text-red-500'}`} />
                </div>
                <input
                  ref={codeInputRef}
                  type="text"
                  value={activationCode}
                  onChange={(e) => {
                    setActivationCode(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  disabled={isVerifying}
                  placeholder="Enter Activation Code"
                  className={`w-full h-12 bg-zinc-900 rounded-xl ps-10 pe-4 text-white font-mono-cyber tracking-widest text-sm transition-all outline-none placeholder:text-zinc-500 ${
                    isPasswordValid
                      ? 'border-2 border-emerald-500/70 focus:border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                      : 'border border-red-800/60 focus:border-red-500 focus:ring-1 focus:ring-red-600'
                  }`}
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-600/60 flex items-start gap-2 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Server Status Indicator */}
            <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-red-950/50 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="flex items-center gap-1 font-bold">
                <Smartphone className="w-3 h-3 text-red-500" />
                <span>{platform.name} Server Status:</span>
              </span>
              <span className="text-red-400 font-mono font-bold">
                ONLINE (READY TO SYNC)
              </span>
            </div>

            {/* Submit Button */}
            {isVerifying ? (
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-red-900/50 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-zinc-200">
                  <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                  <span className="font-bold">
                    {verifyStep === 1 && 'Verifying activation code...'}
                    {verifyStep === 2 && `Syncing with NEMAR & ${platform.name} server...`}
                    {verifyStep === 3 && 'Unlocking predictions hub...'}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-900 via-red-700 to-red-500 h-full transition-all duration-500 shadow-neon-crimson"
                    style={{ width: `${(verifyStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-red-900 via-red-800 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-crimson border border-red-600/30 active:scale-[0.98] transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Activate Script & Enter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
