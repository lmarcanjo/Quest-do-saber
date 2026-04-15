export type Mode = 'simple' | 'adventure';
export type AdventureType = 'epic' | 'light';
export type Objective = 'alfabetização' | 'escola' | 'enem' | 'concurso';

export interface UserProfile {
  age: number;
  objective: Objective;
  level: string;
  mode: Mode;
  adventureType?: AdventureType;
}

export interface GameState {
  xp: number;
  level: number;
  lives: number;
  currentMission?: string;
  history: string[];
}

export interface Challenge {
  context: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  reward: {
    xp: number;
    item?: string;
  };
}
