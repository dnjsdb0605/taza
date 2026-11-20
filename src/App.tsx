import { useCallback, useState } from 'react';
import { ArchiveView } from './components/ArchiveView';
import { Header } from './components/Header';
import { ResultScreen } from './components/ResultScreen';
import { StartScreen } from './components/StartScreen';
import { TypingStage } from './components/TypingStage';
import { buildQuestionSet, figuresData } from './data/figuresData';
import type {
  AppSection,
  BestRecord,
  EraFilter,
  Figure,
  GameStatus,
  QuestionCountOption,
  QuestionResult,
} from './types/game';
import {
  clearBestRecord,
  loadBestRecord,
  saveBestRecord,
} from './utils/typingMetrics';

export default function App() {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [section, setSection] = useState<AppSection>('practice');
  const [selectedEra, setSelectedEra] = useState<EraFilter>('전체');
  const [questionCount, setQuestionCount] = useState<QuestionCountOption>(10);

  const [questions, setQuestions] = useState<Figure[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [totalElapsedMs, setTotalElapsedMs] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);

  const [bestRecord, setBestRecord] = useState<BestRecord | null>(() =>
    loadBestRecord()
  );
  const [isNewBestCpm, setIsNewBestCpm] = useState(false);

  const startSession = useCallback(
    (eraOverride?: EraFilter) => {
      const targetEra = eraOverride ?? selectedEra;
      if (eraOverride) {
        setSelectedEra(eraOverride);
      }

      const poolSize =
        targetEra === '전체'
          ? questionCount
          : figuresData.filter((f) => f.era === targetEra).length;

      const shuffledQuestions = buildQuestionSet(targetEra, poolSize);

      setQuestions(shuffledQuestions);
      setCurrentIndex(0);
      setResults([]);
      setTotalElapsedMs(0);
      setIsNewBestCpm(false);
      setSessionStartTime(Date.now());
      setSection('practice');
      setStatus('playing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [questionCount, selectedEra]
  );

  const handleSubmitQuestion = useCallback(
    (questionResult: QuestionResult) => {
      const nextResults = [...results, questionResult];
      setResults(nextResults);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        const finalElapsed = Math.max(1000, Date.now() - sessionStartTime);
        setTotalElapsedMs(finalElapsed);

        const avgCpm = Math.round(
          nextResults.reduce((acc, r) => acc + r.cpm, 0) / nextResults.length
        );
        const avgAccuracy = Math.round(
          nextResults.reduce((acc, r) => acc + r.accuracy, 0) / nextResults.length
        );

        const { record, isNewBestCpm: newRecord } = saveBestRecord(
          avgCpm,
          avgAccuracy
        );
        setBestRecord(record);
        setIsNewBestCpm(newRecord);
        setStatus('finished');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [currentIndex, questions.length, results, sessionStartTime]
  );

  const handleAbortGame = useCallback(() => {
    setStatus('idle');
    setQuestions([]);
    setCurrentIndex(0);
    setResults([]);
    setSection('practice');
  }, []);

  const handleNavigateSection = useCallback((nextSection: AppSection) => {
    setStatus('idle');
    setSection(nextSection);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleClearRecord = useCallback(() => {
    clearBestRecord();
    setBestRecord(null);
    setIsNewBestCpm(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F9] text-[#14181D]">
      <Header
        status={status}
        section={section}
        onNavigateSection={handleNavigateSection}
        onQuickStart={() => startSession()}
        onAbortGame={handleAbortGame}
      />

      <div className="flex-1">
        {status === 'playing' && questions.length > 0 ? (
          <TypingStage
            questions={questions}
            currentIndex={currentIndex}
            sessionStartTime={sessionStartTime}
            onSubmitQuestion={handleSubmitQuestion}
          />
        ) : status === 'finished' ? (
          <ResultScreen
            results={results}
            totalElapsedMs={totalElapsedMs}
            selectedEra={selectedEra}
            bestRecord={bestRecord}
            isNewBestCpm={isNewBestCpm}
            onRetry={() => startSession()}
            onBackToMenu={handleAbortGame}
          />
        ) : section === 'archive' ? (
          <ArchiveView onPracticeEra={(era) => startSession(era)} />
        ) : (
          <StartScreen
            selectedEra={selectedEra}
            questionCount={questionCount}
            bestRecord={bestRecord}
            onSelectEra={setSelectedEra}
            onSelectQuestionCount={setQuestionCount}
            onStartGame={() => startSession()}
            onClearRecord={handleClearRecord}
            onOpenArchive={() => handleNavigateSection('archive')}
          />
        )}
      </div>

      <footer className="border-t border-[#E1E5EA] mt-auto">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#788492]">
          <p>한국 위인 타자 연습 · 대한민국 대표 위인 20인 내장</p>
          <p>별도 로그인 없이 오프라인으로 작동하며 최고 기록은 이 브라우저에만 저장됩니다.</p>
        </div>
      </footer>
    </div>
  );
}
