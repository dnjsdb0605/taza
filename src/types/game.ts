export type Era = '삼국시대' | '고려' | '조선' | '근현대';

export type EraFilter = '전체' | Era;

export type QuestionCountOption = 5 | 10 | 20;

export type GameStatus = 'idle' | 'playing' | 'finished';

export type AppSection = 'practice' | 'archive';

export interface Figure {
  id: number;
  name: string;
  era: Era;
  years: string;
  hint: string;
  achievement: string;
}

export interface QuestionResult {
  figure: Figure;
  typedText: string;
  cpm: number;
  accuracy: number;
  elapsedMs: number;
  isCorrect: boolean;
}

export interface BestRecord {
  bestCpm: number;
  bestAccuracy: number;
  totalSessions: number;
  lastUpdated: string;
}

export type CharEvalStatus =
  | 'correct'
  | 'incorrect'
  | 'composing'
  | 'current'
  | 'pending';

export interface EvaluatedChar {
  char: string;
  status: CharEvalStatus;
}
