import { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Home,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import type { BestRecord, EraFilter, QuestionResult } from '../types/game';
import { formatDuration } from '../utils/typingMetrics';

interface ResultScreenProps {
  results: QuestionResult[];
  totalElapsedMs: number;
  selectedEra: EraFilter;
  bestRecord: BestRecord | null;
  isNewBestCpm: boolean;
  onRetry: () => void;
  onBackToMenu: () => void;
}

type ResultFilter = 'all' | 'mistakes';

export function ResultScreen({
  results,
  totalElapsedMs,
  selectedEra,
  bestRecord,
  isNewBestCpm,
  onRetry,
  onBackToMenu,
}: ResultScreenProps) {
  const [filter, setFilter] = useState<ResultFilter>('all');

  const summary = useMemo(() => {
    if (results.length === 0) {
      return { avgCpm: 0, avgAccuracy: 0, perfectCount: 0, mistakeCount: 0 };
    }
    const totalCpm = results.reduce((sum, r) => sum + r.cpm, 0);
    const totalAcc = results.reduce((sum, r) => sum + r.accuracy, 0);
    const perfectCount = results.filter((r) => r.isCorrect).length;
    return {
      avgCpm: Math.round(totalCpm / results.length),
      avgAccuracy: Math.round(totalAcc / results.length),
      perfectCount,
      mistakeCount: results.length - perfectCount,
    };
  }, [results]);

  const displayedResults = useMemo(() => {
    if (filter === 'mistakes') {
      return results.filter((r) => !r.isCorrect);
    }
    return results;
  }, [filter, results]);

  return (
    <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14 space-y-10">
      {/* Result Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E1E5EA]">
        <div className="space-y-2.5">
          <p className="text-xs sm:text-sm font-medium text-[#525C68]">
            연습 완료 · {selectedEra} 모드 · 총 {results.length}문항
          </p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#14181D] tracking-tight text-balance">
            위인의 기록을 모두 마쳤습니다
          </h1>
          {isNewBestCpm && summary.avgCpm > 0 && (
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A8A] pt-1">
              <Trophy className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>최고 평균 타수 기록을 경신했습니다 ({summary.avgCpm} 타/분)</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172E6E] transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>다시 하기</span>
          </button>
          <button
            type="button"
            onClick={onBackToMenu}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-[#14181D] bg-white border border-[#D0D6DE] rounded-lg hover:bg-[#F0F2F5] transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
          >
            <Home className="w-4 h-4 text-[#525C68]" aria-hidden="true" />
            <span>모드 선택으로</span>
          </button>
        </div>
      </section>

      {/* 4-Column Summary KPI Strip */}
      <section
        aria-label="연습 결과 지표"
        className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 bg-white border border-[#E1E5EA] rounded-xl p-6 sm:p-7"
      >
        <div>
          <p className="text-xs text-[#525C68]">총 소요 시간</p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#14181D] font-metric">
            {formatDuration(totalElapsedMs)}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#525C68]">평균 타수</p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#1E3A8A] font-metric">
            {summary.avgCpm}
            <span className="text-sm font-normal text-[#525C68] ml-1">타/분</span>
          </p>
          {bestRecord && (
            <p className="mt-1 text-xs text-[#788492] font-metric">
              역대 최고 {bestRecord.bestCpm} 타/분
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-[#525C68]">평균 정확도</p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#0F766E] font-metric">
            {summary.avgAccuracy}
            <span className="text-sm font-normal text-[#525C68] ml-0.5">%</span>
          </p>
        </div>

        <div>
          <p className="text-xs text-[#525C68]">완벽 입력 문항</p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#14181D] font-metric">
            {summary.perfectCount}
            <span className="text-sm font-normal text-[#788492]">
              {' '}
              / {results.length}
            </span>
          </p>
        </div>
      </section>

      {/* Learned Figures Review List */}
      <section aria-label="학습한 위인 목록" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-editorial text-xl font-bold text-[#14181D]">
              학습한 위인 및 오답 복습
            </h2>
            <p className="text-sm text-[#525C68]">
              각 위인의 대표 업적과 내가 입력한 문장을 비교해 보세요.
            </p>
          </div>

          <div className="inline-flex items-center gap-1 p-1 bg-[#EAECEF] rounded-lg self-start">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-[#14181D] shadow-xs font-semibold'
                  : 'text-[#525C68] hover:text-[#14181D]'
              }`}
            >
              전체 ({results.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('mistakes')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                filter === 'mistakes'
                  ? 'bg-white text-[#C81E1E] shadow-xs font-semibold'
                  : 'text-[#525C68] hover:text-[#14181D]'
              }`}
            >
              오타 문항 ({summary.mistakeCount})
            </button>
          </div>
        </div>

        {displayedResults.length === 0 ? (
          <div className="bg-white border border-[#E1E5EA] rounded-xl p-10 text-center space-y-2">
            <CheckCircle2
              className="w-8 h-8 text-[#0F766E] mx-auto"
              aria-hidden="true"
            />
            <p className="font-semibold text-[#14181D]">
              오타 없이 모든 위인의 업적을 완벽하게 입력했습니다!
            </p>
            <p className="text-sm text-[#525C68]">
              전체 보기로 전환하면 학습한 모든 위인 카드를 다시 확인할 수 있습니다.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#E1E5EA] rounded-xl divide-y divide-[#ECEFF3]">
            {displayedResults.map((item, idx) => {
              const target = item.figure.achievement;
              const typed = item.typedText;

              return (
                <article
                  key={`${item.figure.id}-${idx}`}
                  className="p-5 sm:p-6 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <span className="font-metric text-xs text-[#788492]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-editorial text-lg font-bold text-[#14181D]">
                        {item.figure.name}
                      </h3>
                      <span className="text-xs sm:text-sm text-[#525C68]">
                        {item.figure.era} · {item.figure.hint}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs sm:text-sm font-metric shrink-0">
                      <span className="text-[#525C68]">{item.cpm} 타/분</span>
                      <span className="text-[#525C68]">정확도 {item.accuracy}%</span>
                      {item.isCorrect ? (
                        <span className="inline-flex items-center gap-1 font-sans font-semibold text-[#0F766E]">
                          <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                          완벽 입력
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-sans font-semibold text-[#C81E1E]">
                          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                          오타 있음
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Target Achievement */}
                  <div className="space-y-1.5 text-sm sm:text-[15px]">
                    <p className="text-[#14181D] leading-relaxed">
                      <span className="text-xs font-medium text-[#788492] mr-2.5">
                        원문
                      </span>
                      {target}
                    </p>

                    {!item.isCorrect && (
                      <p className="leading-relaxed">
                        <span className="text-xs font-medium text-[#C81E1E] mr-2.5">
                          입력
                        </span>
                        {Array.from(typed).map((ch, charIdx) => {
                          const matches =
                            charIdx < target.length && target[charIdx] === ch;
                          return (
                            <span
                              key={charIdx}
                              className={
                                matches
                                  ? 'text-[#525C68]'
                                  : 'text-[#C81E1E] bg-[#FEF2F2] underline decoration-wavy decoration-[#DC2626] underline-offset-2 font-medium'
                              }
                            >
                              {ch}
                            </span>
                          );
                        })}
                        {typed.length < target.length && (
                          <span className="text-xs text-[#C81E1E] ml-2">
                            ({target.length - typed.length}자 미입력)
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
