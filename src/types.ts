export type Mode = 'simple' | 'adventure';
export type AdventureType = 'epic' | 'light';
export type Objective = 'alfabetização' | 'escola' | 'enem' | 'concurso';
export type Subject = 'Português' | 'Matemática' | 'Ciências' | 'História' | 'Geografia' | 'Inglês' | 'Geral';

export interface UserProfile {
  age: number;
  objective: Objective;
  level: string;
  mode: Mode;
  adventureType?: AdventureType;
  selectedSubject?: Subject;
}

export interface GameState {
  xp: number;
  level: number;
  lives: number;
  currentMission?: string;
  history: string[]; // Store last 5-10 questions to avoid repeats
}

export interface Challenge {
  subject: Subject;
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
