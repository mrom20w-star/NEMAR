import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AnimatedBackground } from './components/AnimatedBackground';
import { LiveWinsTicker } from './components/LiveWinsTicker';
import { PlatformSelectScreen } from './components/PlatformSelectScreen';
import { ActivationFlow } from './components/ActivationFlow';
import { GamesHub } from './components/GamesHub';
import { ApplePredictor } from './components/games/ApplePredictor';
import { CrashPredictor } from './components/games/CrashPredictor';
import { MinesPredictor } from './components/games/MinesPredictor';
import { PromoModal } from './components/modals/PromoModal';
import { InfoModal } from './components/modals/InfoModal';
import { TopUpModal } from './components/modals/TopUpModal';
import { PLATFORMS } from './data/platforms';
import { PlatformConfig, ScreenState, GameId, Language } from './types';

const REQUIRED_PASSWORD = 'NEMAR_AXC9';

export default function App() {
  const [lang] = useState<Language>('en');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformConfig>(PLATFORMS[0]);
  const [userId, setUserId] = useState<string>(() => {
    return localStorage.getItem('nemar_user_id') || '';
  });
  const [isPasswordVerified, setIsPasswordVerified] = useState<boolean>(() => {
    return localStorage.getItem('nemar_verified_code') === REQUIRED_PASSWORD;
  });
  const [onlineCount, setOnlineCount] = useState(4120);

  const [currentScreen, setCurrentScreen] = useState<ScreenState>('platform_select');

  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(3800, Math.min(4600, prev + delta));
      });
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleProceedFromPlatform = () => {
    if (userId && isPasswordVerified) {
      setCurrentScreen('games_hub');
    } else {
      setCurrentScreen('activation_flow');
    }
  };

  const handleCompleteActivation = (newUserId: string, verifiedCode: string) => {
    if (verifiedCode !== REQUIRED_PASSWORD) return;
    setUserId(newUserId);
    setIsPasswordVerified(true);
    localStorage.setItem('nemar_user_id', newUserId);
    localStorage.setItem('nemar_verified_code', verifiedCode);
    setCurrentScreen('games_hub');
  };

  const handleSelectGame = (gameId: GameId) => {
    if (!isPasswordVerified) {
      setCurrentScreen('activation_flow');
      return;
    }
    if (gameId === 'apple') setCurrentScreen('game_apple');
    else if (gameId === 'crash') setCurrentScreen('game_crash');
    else if (gameId === 'mines') setCurrentScreen('game_mines');
  };

  return (
    <div
      className="min-h-screen bg-[#06070a] text-white flex flex-col relative selection:bg-red-800/50 font-sans"
      dir="ltr"
    >
      <AnimatedBackground />

      <Header
        onlineCount={onlineCount}
        latency={selectedPlatform.latency}
      />

      <LiveWinsTicker lang={lang} />

      <main className="relative z-10 flex-1 flex flex-col justify-start pb-12">
        {currentScreen === 'platform_select' && (
          <PlatformSelectScreen
            selectedPlatform={selectedPlatform}
            onSelectPlatform={(p) => setSelectedPlatform(p)}
            onProceed={handleProceedFromPlatform}
            lang={lang}
          />
        )}

        {currentScreen === 'activation_flow' && (
          <ActivationFlow
            platform={selectedPlatform}
            onBack={() => setCurrentScreen('platform_select')}
            onComplete={handleCompleteActivation}
            lang={lang}
          />
        )}

        {currentScreen === 'games_hub' && isPasswordVerified && (
          <GamesHub
            platform={selectedPlatform}
            userId={userId}
            onSelectGame={handleSelectGame}
            onBack={() => setCurrentScreen('platform_select')}
            lang={lang}
          />
        )}

        {currentScreen === 'game_apple' && isPasswordVerified && (
          <ApplePredictor
            platform={selectedPlatform}
            userId={userId}
            onBack={() => setCurrentScreen('games_hub')}
            lang={lang}
          />
        )}

        {currentScreen === 'game_crash' && isPasswordVerified && (
          <CrashPredictor
            platform={selectedPlatform}
            userId={userId}
            onBack={() => setCurrentScreen('games_hub')}
            lang={lang}
          />
        )}

        {currentScreen === 'game_mines' && isPasswordVerified && (
          <MinesPredictor
            platform={selectedPlatform}
            userId={userId}
            onBack={() => setCurrentScreen('games_hub')}
            lang={lang}
          />
        )}
      </main>

      <PromoModal
        platform={selectedPlatform}
        isOpen={isPromoOpen}
        onClose={() => setIsPromoOpen(false)}
        lang={lang}
      />

      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        lang={lang}
      />

      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        lang={lang}
      />
    </div>
  );
}
