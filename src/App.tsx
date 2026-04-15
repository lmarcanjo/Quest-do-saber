import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import GameLoop from './components/GameLoop';
import { UserProfile } from './types';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const handleOnboardingComplete = (data: UserProfile) => {
    setProfile(data);
  };

  return (
    <div className="min-h-screen font-sans relative overflow-hidden">
      <div className="mesh-sphere sphere-1"></div>
      <div className="mesh-sphere sphere-2"></div>
      {!profile ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <GameLoop profile={profile} />
      )}
    </div>
  );
}
