import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  CornerDownLeft,
  ShieldAlert,
} from 'lucide-react';
import { CATEGORY_STYLES, ERA_STYLES } from '../data/figuresData';
import type { Person, QuestionResult } from '../types/game';
import {
  calculateKoreanCpm,
  calculateLiveAccuracy,
  evaluateTargetCharacters,
  formatClock,
  gradeSubmission,
} from '../utils/typingMetrics';

interface TypingStageProps {
  questions: Person[];
  currentIndex: number;
  sessionStartTime: number;
  onSubmitQuestion: (result: QuestionResult) => void;
}

type FeedbackNotice =
  | { type: 'paste'; message: string }
  | { type: 'empty'; message: string }
  | null;

export function TypingStage({
  questions,
  currentIndex,
  sessionStartTime,
  onSubmitQuestion,
}: TypingStageProps) {
  const currentPerson = questions[currentIndex];
  const target = currentPerson.summary;
  const eraStyle = ERA_STYLES[currentPerson.era];
  const categoryStyle = CATEGORY_STYLES[currentPerson.category];

  const [userInput, setUserInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [notice, setNotice] = useState<FeedbackNotice>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const isComposingRef = useRef(false);
  const questionStartTimeRef = useRef<number | null>(null);
  const submittedForIndexRef = useRef<number | null>(null);
  const noticeTimerRef = useRef<number | null>(null);

  // Reset per-question state and maintain focus seamlessly
  useEffect(() => {
    setUserInput('');
    setIsComposing(false);
    setNotice(null);
    isComposingRef.current = false;
    questionStartTimeRef.current = null;
    submittedForIndexRef.current = null;

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [currentIndex]);

  // Smooth live timer tick for HUD clock and live CPM
  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 200);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) {
        window.clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  const showTemporaryNotice = useCallback((nextNotice: FeedbackNotice) => {
    setNotice(nextNotice);
    if (noticeTimerRef.current) {
      window.clearTimeout(noticeTimerRef.current);
    }
    if (nextNotice) {
      noticeTimerRef.current = window.setTimeout(() => {
        setNotice(null);
      }, 3200);
    }
  }, []);

  const finalizeAndSubmit = useCallback(
    (rawValue: string) => {
      if (submittedForIndexRef.current === currentIndex) return;

      const trimmed = rawValue.trim();
      if (trimmed.length === 0) {
        showTemporaryNotice({
          type: 'empty',
          message: '목표 문장을 입력한 뒤 Enter를 눌러 주세요.',
        });
        inputRef.current?.focus();
        return;
      }

      submittedForIndexRef.current = currentIndex;

      const endTime = Date.now();
      const elapsedMs = questionStartTimeRef.current
        ? Math.max(400, endTime - questionStartTimeRef.current)
        : 1000;

      const graded = gradeSubmission(target, rawValue);
      const cpm = calculateKoreanCpm(target, graded.typedText, elapsedMs, false);

      onSubmitQuestion({
        person: currentPerson,
        typedText: graded.typedText,
        cpm,
        accuracy: graded.accuracy,
        elapsedMs,
        isCorrect: graded.isCorrect,
      });
    },
    [currentIndex, currentPerson, onSubmitQuestion, showTemporaryNotice, target]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;

    if (
      userInput.length === 0 &&
      nextValue.trim().length === 0 &&
      nextValue.length > 0
    ) {
      setUserInput('');
      return;
    }

    if (questionStartTimeRef.current === null && nextValue.length > 0) {
      questionStartTimeRef.current = Date.now();
    }

    if (notice) {
      setNotice(null);
    }

    setUserInput(nextValue);

    const nativeComposing =
      typeof (e.nativeEvent as InputEvent).isComposing === 'boolean'
        ? (e.nativeEvent as InputEvent).isComposing
        : isComposingRef.current;

    if (
      !isComposingRef.current &&
      !nativeComposing &&
      nextValue.trim().length >= target.length
    ) {
      finalizeAndSubmit(nextValue);
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
    setIsComposing(true);
    if (questionStartTimeRef.current === null) {
      questionStartTimeRef.current = Date.now();
    }
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    setIsComposing(false);

    const finalizedValue = e.currentTarget.value;
    setUserInput(finalizedValue);

    if (finalizedValue.trim().length >= target.length) {
      finalizeAndSubmit(finalizedValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (isComposingRef.current || e.nativeEvent.isComposing || e.keyCode === 229) {
        return;
      }
      e.preventDefault();
      finalizeAndSubmit(userInput);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    showTemporaryNotice({
      type: 'paste',
      message: '복사·붙여넣기는 사용할 수 없습니다. 직접 타이핑해 주세요.',
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    showTemporaryNotice({
      type: 'paste',
      message: '드래그 붙여넣기는 사용할 수 없습니다. 직접 타이핑해 주세요.',
    });
  };

  const evaluatedChars = useMemo(
    () => evaluateTargetCharacters(target, userInput, isComposing),
    [target, userInput, isComposing]
  );

  const { accuracy: liveAccuracy, errorCount } = useMemo(
    () => calculateLiveAccuracy(target, userInput, isComposing),
    [target, userInput, isComposing]
  );

  const liveCpm = useMemo(() => {
    if (!questionStartTimeRef.current || userInput.length === 0) return 0;
    const elapsed = Math.max(500, now - questionStartTimeRef.current);
    return calculateKoreanCpm(target, userInput, elapsed, isComposing);
  }, [isComposing, now, target, userInput]);

  const sessionElapsedMs = Math.max(0, now - sessionStartTime);
  const progressRatio = (currentIndex + 1) / questions.length;
  const typedLength = userInput.length;

  return (
    <main className="max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-12 space-y-6">
      {/* Unobtrusive Top HUD Bar */}
      <section aria-label="실시간 진행 현황" className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 py-4 px-5 bg-white border border-[#E1E5EA] rounded-xl">
          <div>
            <p className="text-xs text-[#525C68]">진행 문항</p>
            <p className="mt-1 text-lg sm:text-xl font-semibold text-[#14181D] font-metric">
              {currentIndex + 1}
              <span className="text-sm font-normal text-[#788492]">
                {' '}
                / {questions.length}
              </span>
            </p>
          </div>

          <div>
            <p className="text-xs text-[#525C68]">경과 시간</p>
            <p className="mt-1 text-lg sm:text-xl font-semibold text-[#14181D] font-metric">
              {formatClock(sessionElapsedMs)}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#525C68]">현재 타수</p>
            <p className="mt-1 text-lg sm:text-xl font-semibold text-[#1E3A8A] font-metric">
              {liveCpm}
              <span className="text-xs font-normal text-[#525C68] ml-1">타/분</span>
            </p>
          </div>

          <div>
            <p className="text-xs text-[#525C68]">현재 정확도</p>
            <p
              className={`mt-1 text-lg sm:text-xl font-semibold font-metric ${
                errorCount > 0 ? 'text-[#C81E1E]' : 'text-[#0F766E]'
              }`}
            >
              {liveAccuracy}
              <span className="text-xs font-normal text-[#525C68] ml-0.5">%</span>
            </p>
          </div>
        </div>

        {/* Compositor-Only Progress Rail */}
        <div
          className="h-1.5 w-full bg-[#E6EAEF] rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-label="전체 문제 진행률"
        >
          <div
            className="h-full w-full bg-[#1E3A8A] origin-left transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${progressRatio})` }}
          />
        </div>
      </section>

      {/* Primary Typing Stage Card */}
      <section
        aria-label="위인 업적 타자 입력"
        className="bg-white border border-[#E1E5EA] rounded-xl p-6 sm:p-10 space-y-8"
      >
        {/* Figure Metadata & Name */}
        <div className="space-y-2.5 pb-6 border-b border-[#ECEFF3]">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`px-2 py-0.5 rounded font-semibold ${eraStyle.bg} ${eraStyle.text}`}
            >
              {currentPerson.era}
            </span>
            <span
              className={`px-2 py-0.5 rounded border font-medium bg-white ${categoryStyle.border} ${categoryStyle.text}`}
            >
              {currentPerson.category}
            </span>
            {currentPerson.alias && (
              <span className="text-[#525C68] text-xs sm:text-sm">
                · {currentPerson.alias}
              </span>
            )}
            {!currentPerson.isPreset && (
              <span className="text-[#1E3A8A] font-semibold">· 사용자 확장</span>
            )}
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14181D] tracking-tight">
            {currentPerson.name}
          </h1>
        </div>

        {/* Target Sentence with Character-by-Character Real-Time Feedback */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#525C68]">
            <span>따라 칠 핵심 업적 문장</span>
            <span className="font-metric">
              {Math.min(typedLength, target.length)} / {target.length}자
            </span>
          </div>

          <div
            onClick={() => inputRef.current?.focus()}
            className="p-5 sm:p-6 bg-[#F7F8F9] border border-[#E6EAEF] rounded-lg select-none cursor-text"
            aria-label={`목표 문장: ${target}`}
          >
            <p className="text-xl sm:text-2xl lg:text-[1.625rem] leading-[1.85] tracking-[0.01em] font-medium break-keep">
              {evaluatedChars.map((item, idx) => {
                let charClass = 'text-[#8C96A3]';

                if (item.status === 'correct') {
                  charClass = 'text-[#0F766E] border-b-2 border-[#0F766E]/35';
                } else if (item.status === 'incorrect') {
                  charClass =
                    'text-[#C81E1E] bg-[#FEF2F2] underline decoration-wavy decoration-[#DC2626] underline-offset-4 rounded-xs';
                } else if (item.status === 'composing') {
                  charClass =
                    'text-[#1E3A8A] bg-[#EFF6FF] border-b-2 border-[#1E3A8A] rounded-xs';
                } else if (item.status === 'current') {
                  charClass = 'text-[#14181D] border-b-2 border-[#14181D]';
                }

                return (
                  <span
                    key={`${currentPerson.id}-char-${idx}`}
                    className={`transition-colors duration-75 ${charClass}`}
                  >
                    {item.char === ' ' && item.status === 'incorrect'
                      ? '␣'
                      : item.char}
                  </span>
                );
              })}
            </p>
          </div>
        </div>

        {/* Live Korean IME-Safe Typing Input */}
        <div className="space-y-3">
          <label htmlFor="typing-input" className="sr-only">
            위인 업적 문장 입력창
          </label>
          <div className="relative">
            <input
              key={`${currentPerson.id}-${currentIndex}`}
              ref={inputRef}
              id="typing-input"
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onDrop={handleDrop}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="위 문장을 그대로 입력해 주세요..."
              className={`w-full px-5 py-4 text-lg sm:text-xl font-medium bg-white border-2 rounded-lg text-[#14181D] placeholder:text-[#98A2AE] transition-colors duration-150 focus:outline-none ${
                notice
                  ? 'border-[#D97706] focus:border-[#D97706]'
                  : errorCount > 0
                    ? 'border-[#DC2626] focus:border-[#DC2626]'
                    : 'border-[#CBD2DA] focus:border-[#1E3A8A]'
              }`}
            />
          </div>

          {/* Dual-Coded Inline Feedback Bar + Submit Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div
              className="min-h-6 flex items-center gap-2 text-xs sm:text-sm"
              aria-live="polite"
            >
              {notice?.type === 'paste' ? (
                <>
                  <ShieldAlert
                    className="w-4 h-4 text-[#B45309] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-medium text-[#B45309]">
                    {notice.message}
                  </span>
                </>
              ) : notice?.type === 'empty' ? (
                <>
                  <AlertCircle
                    className="w-4 h-4 text-[#B45309] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-medium text-[#B45309]">
                    {notice.message}
                  </span>
                </>
              ) : errorCount > 0 ? (
                <>
                  <AlertCircle
                    className="w-4 h-4 text-[#C81E1E] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-medium text-[#C81E1E]">
                    오타 {errorCount}자 발견 · 수정하거나 Enter로 제출할 수 있습니다
                  </span>
                </>
              ) : userInput.length > 0 ? (
                <>
                  <CheckCircle2
                    className="w-4 h-4 text-[#0F766E] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-[#0F766E] font-medium">
                    {isComposing
                      ? '한글 조합 입력 중 · 끝까지 입력하면 자동으로 넘어갑니다'
                      : '정확하게 입력 중 · 끝까지 입력하거나 Enter로 제출'}
                  </span>
                </>
              ) : (
                <span className="text-[#525C68]">
                  첫 글자를 입력하면 타수 측정이 시작됩니다. (붙여넣기 불가)
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => finalizeAndSubmit(userInput)}
              disabled={userInput.trim().length === 0}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
            >
              <span>다음 문제</span>
              <CornerDownLeft className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Subtle Character State Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#525C68]">
        <span>
          <span className="text-[#0F766E] font-semibold border-b border-[#0F766E]/40 pb-0.5">
            가나다
          </span>{' '}
          일치
        </span>
        <span>
          <span className="text-[#C81E1E] font-semibold underline decoration-wavy decoration-[#DC2626] underline-offset-2">
            가나다
          </span>{' '}
          오타
        </span>
        <span>
          <span className="text-[#1E3A8A] font-semibold bg-[#EFF6FF] px-1 rounded-xs border-b border-[#1E3A8A]">
            가
          </span>{' '}
          한글 조합 중
        </span>
      </div>
    </main>
  );
}
