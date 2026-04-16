import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import GameLoop from './components/GameLoop';
import { UserProfile, GameState } from './types';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initialGameState, setInitialGameState] = useState<GameState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('eduquest_profile');
      const savedGameState = localStorage.getItem('eduquest_gamestate');

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      if (savedGameState) {
        setInitialGameState(JSON.parse(savedGameState));
      }
    } catch (error) {
      console.error("Failed to load saved state:", error);
      localStorage.removeItem('eduquest_profile');
      localStorage.removeItem('eduquest_gamestate');
    }
    setIsLoaded(true);
  }, []);

  const handleOnboardingComplete = (data: UserProfile) => {
    setProfile(data);
    localStorage.setItem('eduquest_profile', JSON.stringify(data));
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen font-sans relative overflow-hidden">
      <div className="mesh-sphere sphere-1"></div>
      <div className="mesh-sphere sphere-2"></div>
      {!profile ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <GameLoop profile={profile} initialGameState={initialGameState || undefined} />
      )}
    </div>
  );
}
