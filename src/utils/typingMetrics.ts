import type { BestRecord, EvaluatedChar } from '../types/game';

const STORAGE_KEY = 'kr_great_figures_typing_best_v1';

const COMPOUND_VOWELS = new Set([9, 10, 11, 14, 15, 16, 19]);
const COMPOUND_FINALS = new Set([3, 5, 6, 9, 10, 11, 12, 13, 14, 15, 18]);

/**
 * Counts authentic 2-bulsik Korean keystrokes (타수) for any UTF-16 string.
 * Hangul syllables decompose into cho (1) + jung (1-2) + jong (0-2).
 */
export function countKoreanKeystrokes(text: string): number {
  let total = 0;
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const syllableIndex = code - 0xac00;
      const jung = Math.floor((syllableIndex % (21 * 28)) / 28);
      const jong = syllableIndex % 28;
      // Choseong (1) + Jungseong (1 or 2) + Jongseong (0, 1, or 2)
      total += 1;
      total += COMPOUND_VOWELS.has(jung) ? 2 : 1;
      if (jong > 0) {
        total += COMPOUND_FINALS.has(jong) ? 2 : 1;
      }
    } else if (code >= 0x3131 && code <= 0x3163) {
      total += 1;
    } else {
      total += 1;
    }
  }
  return total;
}

/**
 * Calculates typing speed in Korean keystrokes per minute (타/분),
 * counting strokes from correctly matched characters to reward precision.
 */
export function calculateKoreanCpm(
  target: string,
  typed: string,
  elapsedMs: number,
  isComposing = false
): number {
  const safeSeconds = Math.max(elapsedMs / 1000, 0.8);
  const limit = isComposing ? Math.max(0, typed.length - 1) : typed.length;
  let validChars = '';

  for (let i = 0; i < limit && i < target.length; i += 1) {
    if (typed[i] === target[i]) {
      validChars += typed[i];
    }
  }

  // Include active composing character's current jamo so live CPM feels responsive
  if (isComposing && typed.length > 0 && typed.length <= target.length) {
    validChars += typed[typed.length - 1];
  }

  const strokes = countKoreanKeystrokes(validChars);
  if (strokes === 0) return 0;

  return Math.min(1200, Math.round((strokes / safeSeconds) * 60));
}

/**
 * Evaluates target sentence character-by-character with Korean IME safety.
 * The actively composing last character stays neutral ('composing') unless
 * already matching, preventing distracting red flicker mid-syllable.
 */
export function evaluateTargetCharacters(
  target: string,
  userInput: string,
  isComposing: boolean
): EvaluatedChar[] {
  const result: EvaluatedChar[] = [];

  for (let i = 0; i < target.length; i += 1) {
    if (i < userInput.length) {
      const isLastComposing = isComposing && i === userInput.length - 1;
      if (userInput[i] === target[i]) {
        result.push({ char: target[i], status: 'correct' });
      } else if (isLastComposing) {
        result.push({ char: target[i], status: 'composing' });
      } else {
        result.push({ char: target[i], status: 'incorrect' });
      }
    } else if (i === userInput.length) {
      result.push({ char: target[i], status: 'current' });
    } else {
      result.push({ char: target[i], status: 'pending' });
    }
  }

  return result;
}

/**
 * Computes live accuracy percentage across confirmed (non-composing) characters.
 */
export function calculateLiveAccuracy(
  target: string,
  userInput: string,
  isComposing: boolean
): { accuracy: number; errorCount: number } {
  const confirmedLength = isComposing
    ? Math.max(0, userInput.length - 1)
    : userInput.length;

  if (confirmedLength === 0) {
    return { accuracy: 100, errorCount: 0 };
  }

  let matched = 0;
  let errors = 0;

  for (let i = 0; i < confirmedLength; i += 1) {
    if (i < target.length && userInput[i] === target[i]) {
      matched += 1;
    } else {
      errors += 1;
    }
  }

  return {
    accuracy: Math.round((matched / confirmedLength) * 100),
    errorCount: errors,
  };
}

/**
 * Computes final graded accuracy and exact match flag upon submission.
 */
export function gradeSubmission(
  target: string,
  rawTyped: string
): { typedText: string; accuracy: number; isCorrect: boolean } {
  const typedText = rawTyped.trim();
  const maxLen = Math.max(target.length, typedText.length);

  if (maxLen === 0) {
    return { typedText: '', accuracy: 0, isCorrect: false };
  }

  let matches = 0;
  for (let i = 0; i < maxLen; i += 1) {
    if (i < target.length && i < typedText.length && target[i] === typedText[i]) {
      matches += 1;
    }
  }

  return {
    typedText,
    accuracy: Math.round((matches / maxLen) * 100),
    isCorrect: typedText === target,
  };
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) {
    return `${seconds}초`;
  }
  return `${minutes}분 ${String(seconds).padStart(2, '0')}초`;
}

export function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function loadBestRecord(): BestRecord | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BestRecord>;
    if (
      typeof parsed.bestCpm === 'number' &&
      typeof parsed.bestAccuracy === 'number' &&
      typeof parsed.totalSessions === 'number'
    ) {
      return {
        bestCpm: parsed.bestCpm,
        bestAccuracy: parsed.bestAccuracy,
        totalSessions: parsed.totalSessions,
        lastUpdated: typeof parsed.lastUpdated === 'string' ? parsed.lastUpdated : '',
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveBestRecord(
  avgCpm: number,
  avgAccuracy: number
): { record: BestRecord; isNewBestCpm: boolean } {
  const existing = loadBestRecord();
  const isNewBestCpm = !existing || avgCpm > existing.bestCpm;

  const updated: BestRecord = {
    bestCpm: existing ? Math.max(existing.bestCpm, avgCpm) : avgCpm,
    bestAccuracy: existing ? Math.max(existing.bestAccuracy, avgAccuracy) : avgAccuracy,
    totalSessions: (existing?.totalSessions ?? 0) + 1,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota or private mode restrictions gracefully
  }

  return { record: updated, isNewBestCpm };
}

export function clearBestRecord(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage access errors
  }
}
