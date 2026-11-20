import { useState } from 'react';
import { ArrowRight, BookOpen, RotateCcw } from 'lucide-react';
import { ERA_DESCRIPTIONS, ERA_FILTERS, figuresData } from '../data/figuresData';
import type { BestRecord, EraFilter, QuestionCountOption } from '../types/game';

interface StartScreenProps {
  selectedEra: EraFilter;
  questionCount: QuestionCountOption;
  bestRecord: BestRecord | null;
  onSelectEra: (era: EraFilter) => void;
  onSelectQuestionCount: (count: QuestionCountOption) => void;
  onStartGame: () => void;
  onClearRecord: () => void;
  onOpenArchive: () => void;
}

const QUESTION_COUNTS: { value: QuestionCountOption; label: string }[] = [
  { value: 5, label: '5문제 · 가볍게' },
  { value: 10, label: '10문제 · 표준' },
  { value: 20, label: '20문제 · 전체 완주' },
];

const HERO_IMAGE_PATH = `${import.meta.env.BASE_URL}src/assets/images/hero_korean_archive_1795144261138.jpg`;

export function StartScreen({
  selectedEra,
  questionCount,
  bestRecord,
  onSelectEra,
  onSelectQuestionCount,
  onStartGame,
  onClearRecord,
  onOpenArchive,
}: StartScreenProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const eraPoolCount =
    selectedEra === '전체'
      ? figuresData.length
      : figuresData.filter((f) => f.era === selectedEra).length;

  const actualQuestionCount =
    selectedEra === '전체' ? questionCount : eraPoolCount;

  return (
    <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14 space-y-12">
      {/* 2-Column Editorial Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Column: Title, Copy, Mode Selector, CTA */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <p className="text-xs sm:text-sm font-medium text-[#525C68]">
              대한민국 역사 타자 학습 · 삼국시대부터 근현대까지 20인 수록
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[2.625rem] font-bold leading-[1.25] tracking-tight text-[#14181D] text-balance">
              위인의 발자취를
              <br />
              손끝으로 정확하게 기록하다
            </h1>
            <p className="text-[15px] sm:text-base leading-[1.7] text-[#525C68] max-w-xl">
              세종대왕의 훈민정음 창제부터 유관순의 독립 만세 운동까지, 대한민국을 빛낸
              위인들의 핵심 업적 문장을 따라 치며 한글 타자 속도와 역사를 함께 익혀 보세요.
            </p>
          </div>

          {/* Single-Elevation Practice Setup Panel */}
          <div className="bg-white border border-[#E1E5EA] rounded-xl p-6 sm:p-7 space-y-6">
            {/* Era Segmented Control */}
            <div className="space-y-2.5">
              <div className="flex items-baseline justify-between gap-4">
                <label className="text-sm font-semibold text-[#14181D]">
                  출제 시대 선택
                </label>
                <span className="text-xs text-[#525C68] font-metric">
                  출제 대상 {eraPoolCount}명
                </span>
              </div>
              <div
                role="radiogroup"
                aria-label="출제 시대 선택"
                className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 bg-[#F0F2F5] rounded-lg"
              >
                {ERA_FILTERS.map((era) => {
                  const isActive = selectedEra === era;
                  return (
                    <button
                      key={era}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => onSelectEra(era)}
                      className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
                        isActive
                          ? 'bg-white text-[#1E3A8A] shadow-xs font-semibold'
                          : 'text-[#525C68] hover:text-[#14181D]'
                      }`}
                    >
                      {era}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-[#525C68] leading-relaxed">
                {selectedEra === '전체'
                  ? '삼국시대·고려·조선·근현대 전 시대의 위인을 무작위로 섞어 출제합니다.'
                  : ERA_DESCRIPTIONS[selectedEra]}
              </p>
            </div>

            {/* Question Count Selection (for '전체' mode) or Era Count Notice */}
            {selectedEra === '전체' ? (
              <div className="space-y-2.5 pt-2 border-t border-[#ECEFF3]">
                <label className="block text-sm font-semibold text-[#14181D]">
                  연습 문항 수
                </label>
                <div
                  role="radiogroup"
                  aria-label="연습 문항 수"
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                >
                  {QUESTION_COUNTS.map((option) => {
                    const isActive = questionCount === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => onSelectQuestionCount(option.value)}
                        className={`px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
                          isActive
                            ? 'border-[#1E3A8A] bg-[#1E3A8A]/6 text-[#1E3A8A] font-semibold'
                            : 'border-[#E1E5EA] bg-white text-[#525C68] hover:border-[#C5CDD6] hover:text-[#14181D]'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-[#ECEFF3] flex items-center justify-between text-sm text-[#525C68]">
                <span>시대별 집중 학습 모드</span>
                <span className="font-semibold text-[#14181D] font-metric">
                  {actualQuestionCount}문제 무작위 출제
                </span>
              </div>
            )}

            {/* Primary CTA Row */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={onStartGame}
                className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172E6E] active:scale-[0.99] transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
              >
                <span>
                  게임 시작 ({selectedEra} · {actualQuestionCount}문제)
                </span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onOpenArchive}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-[#14181D] bg-white border border-[#D0D6DE] rounded-lg hover:bg-[#F0F2F5] transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
              >
                <BookOpen className="w-4 h-4 text-[#525C68] shrink-0" aria-hidden="true" />
                <span>위인 미리보기</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Museum Visual Anchor */}
        <div className="lg:col-span-5 relative rounded-xl overflow-hidden border border-[#E1E5EA] bg-[#E8ECEF] min-h-[280px] lg:min-h-0">
          {!imageFailed ? (
            <img
              src={HERO_IMAGE_PATH}
              alt="한지 두루마리와 벼루, 붓, 앙부일구가 놓인 한국 역사 아카이브 정물"
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#ECEFF3] to-[#DDE3EA]">
              <BookOpen className="w-10 h-10 text-[#1E3A8A]/70 mb-3" aria-hidden="true" />
              <p className="font-editorial text-lg font-bold text-[#14181D]">
                한국 위인 기록 아카이브
              </p>
              <p className="text-xs text-[#525C68] mt-1">
                삼국시대 · 고려 · 조선 · 근현대
              </p>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-6 pt-16 text-white">
            <p className="text-xs text-white/80">한글 2벌식 타수 측정 지원</p>
            <p className="font-editorial text-lg font-semibold mt-1 leading-snug">
              한 문장씩 정확하게 따라 치며 기억하는 대한민국 역사
            </p>
          </div>
        </div>
      </section>

      {/* Full-Width 4-Column Best Record & Dataset Strip */}
      <section aria-label="내 최고 기록" className="border-y border-[#E1E5EA] py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-editorial text-base font-bold text-[#14181D]">
            브라우저 저장 최고 기록
          </h2>
          {bestRecord && (
            <button
              type="button"
              onClick={onClearRecord}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#525C68] hover:text-[#C81E1E] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>기록 초기화</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <p className="text-xs text-[#525C68]">최고 평균 타수</p>
            <p className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#14181D] font-metric">
              {bestRecord ? (
                <>
                  {bestRecord.bestCpm}
                  <span className="text-sm font-normal text-[#525C68] ml-1">타/분</span>
                </>
              ) : (
                <span className="text-lg font-normal text-[#788492]">아직 기록 없음</span>
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#525C68]">최고 평균 정확도</p>
            <p className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#14181D] font-metric">
              {bestRecord ? (
                <>
                  {bestRecord.bestAccuracy}
                  <span className="text-sm font-normal text-[#525C68] ml-0.5">%</span>
                </>
              ) : (
                <span className="text-lg font-normal text-[#788492]">—</span>
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#525C68]">완료한 연습</p>
            <p className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#14181D] font-metric">
              {bestRecord ? bestRecord.totalSessions : 0}
              <span className="text-sm font-normal text-[#525C68] ml-1">회</span>
            </p>
          </div>

          <div>
            <p className="text-xs text-[#525C68]">수록 위인 데이터</p>
            <p className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#14181D] font-metric">
              {figuresData.length}
              <span className="text-sm font-normal text-[#525C68] ml-1">명 · 4개 시대</span>
            </p>
          </div>
        </div>
      </section>

      {/* Clean Editorial 3-Step Guide */}
      <section aria-label="진행 안내" className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[#14181D]">
            01. 한글 조합 인식 실시간 피드백
          </h3>
          <p className="text-sm leading-relaxed text-[#525C68]">
            입력 중인 자음·모음은 조합 상태로 표시해 오타 깜빡임을 막고, 확정된 글자마다
            일치 여부와 밑줄 표시를 즉시 안내합니다.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[#14181D]">
            02. 문장 완성 또는 Enter로 즉시 채점
          </h3>
          <p className="text-sm leading-relaxed text-[#525C68]">
            목표 업적 문장을 끝까지 입력하거나 Enter 키를 누르면 자동으로 앞뒤 공백을 정리해
            타수와 정확도를 산출합니다.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[#14181D]">
            03. 오답 복습 및 최고 기록 저장
          </h3>
          <p className="text-sm leading-relaxed text-[#525C68]">
            연습을 마치면 학습한 위인과 오타 문항을 한눈에 복습할 수 있으며, 최고 기록은
            로그인 없이 브라우저에 안전하게 보관됩니다.
          </p>
        </div>
      </section>
    </main>
  );
}
