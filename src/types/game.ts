export type Era =
  | '고조선~삼국'
  | '고려'
  | '조선'
  | '근현대'
  | '현대/기타';

export type EraFilter = '전체' | Era;

export type Category =
  | '정치/외교'
  | '군사/국방'
  | '과학/기술'
  | '문화/예술'
  | '학문/사상'
  | '경제/산업';

export type CategoryFilter = '전체' | Category;

export type SourceFilter = 'all' | 'preset' | 'custom';

export type QuestionCountOption = 5 | 10 | 20 | 30;

export type GameStatus = 'idle' | 'playing' | 'finished';

export type AppSection = 'practice' | 'archive';

export interface Person {
  id: string;
  name: string;
  alias: string;
  era: Era;
  category: Category;
  summary: string;
  details: string;
  tags: string[];
  isPreset: boolean;
  createdAt: string;
}

export type PersonFormInput = Omit<Person, 'id' | 'isPreset' | 'createdAt'>;

export interface QuestionResult {
  person: Person;
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

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

export type ImportMergeStrategy = 'merge-skip' | 'merge-overwrite' | 'replace-all';
