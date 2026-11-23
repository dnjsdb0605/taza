import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Plus, RotateCcw } from 'lucide-react';
import heroArchiveImg from '../assets/images/hero_korean_archive_1795144261138.jpg';
import {
  CATEGORY_FILTERS,
  ERA_DESCRIPTIONS,
  ERA_FILTERS,
  filterPeopleForPractice,
} from '../data/figuresData';
import type {
  BestRecord,
  CategoryFilter,
  EraFilter,
  Person,
  QuestionCountOption,
  SourceFilter,
} from '../types/game';

interface StartScreenProps {
  people: Person[];
  selectedEra: EraFilter;
  selectedCategory: CategoryFilter;
  selectedSource: SourceFilter;
  questionCount: QuestionCountOption;
  bestRecord: BestRecord | null;
  onSelectEra: (era: EraFilter) => void;
  onSelectCategory: (category: CategoryFilter) => void;
  onSelectSource: (source: SourceFilter) => void;
  onSelectQuestionCount: (count: QuestionCountOption) => void;
  onStartGame: () => void;
  onClearRecord: () => void;
  onOpenArchive: () => void;
  onOpenAddPerson: () => void;
}

const QUESTION_COUNTS: { value: QuestionCountOption; label: string }[] = [
  { value: 5, label: '5문제' },
  { value: 10, label: '10문제' },
  { value: 20, label: '20문제' },
  { value: 30, label: '30문제' },
];

const HERO_IMAGE_PATH = heroArchiveImg;

export function StartScreen({
  people,
  selectedEra,
  selectedCategory,
  selectedSource,
  questionCount,
  bestRecord,
  onSelectEra,
  onSelectCategory,
  onSelectSource,
  onSelectQuestionCount,
  onStartGame,
  onClearRecord,
  onOpenArchive,
  onOpenAddPerson,
}: StartScreenProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const matchingPool = useMemo(
    () =>
      filterPeopleForPractice(
        people,
        selectedEra,
        selectedCategory,
        selectedSource
      ),
    [people, selectedCategory, selectedEra, selectedSource]
  );

  const customCount = useMemo(
    () => people.filter((p) => !p.isPreset).length,
    [people]
  );

  const actualQuestionCount = Math.min(questionCount, matchingPool.length);

  return (
    <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14 space-y-12">
      {/* 2-Column Editorial Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Column: Title, Copy, Mode Selector, CTA */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-7">
          <div className="space-y-4">
            <p className="text-xs sm:text-sm font-medium text-[#525C68]">
              대한민국 역사 타자 학습 &amp; 인물 아카이브 · 현재 {people.length}인 수록
              {customCount > 0 ? ` (직접 추가 ${customCount}명 포함)` : ''}
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[2.625rem] font-bold leading-[1.25] tracking-tight text-[#14181D] text-balance">
              위인의 발자취를 기록하고
              <br />
              나만의 인력풀로 확장하다
            </h1>
            <p className="text-[15px] sm:text-base leading-[1.7] text-[#525C68] max-w-xl">
              대표 위인들의 핵심 업적을 한글 타자로 정확하게 익히고, 인력풀 관리에서
              새로운 역사·현대 인물을 직접 추가해 나만의 맞춤형 타자 학습 세트를 만들어 보세요.
            </p>
          </div>

          {/* Single-Elevation Practice Setup Panel */}
          <div className="bg-white border border-[#E1E5EA] rounded-xl p-6 sm:p-7 space-y-5">
            {/* Era Segmented Control */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-4">
                <label className="text-sm font-semibold text-[#14181D]">
                  출제 시대 선택
                </label>
                <span className="text-xs text-[#525C68] font-metric">
                  조건 일치 {matchingPool.length}명
                </span>
              </div>
              <div
                role="radiogroup"
                aria-label="출제 시대 선택"
                className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 bg-[#F0F2F5] rounded-lg"
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
                      className={`px-2 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
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
                  ? '고조선~삼국부터 현대까지 등록된 모든 시대의 위인을 무작위로 출제합니다.'
                  : ERA_DESCRIPTIONS[selectedEra]}
              </p>
            </div>

            {/* Category & Source Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#ECEFF3]">
              <div className="space-y-1.5">
                <label
                  htmlFor="practice-category-select"
                  className="block text-xs font-semibold text-[#525C68]"
                >
                  분야 필터
                </label>
                <select
                  id="practice-category-select"
                  value={selectedCategory}
                  onChange={(e) =>
                    onSelectCategory(e.target.value as CategoryFilter)
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-[#CBD2DA] rounded-lg text-[#14181D] focus:outline-none focus:border-[#1E3A8A]"
                >
                  {CATEGORY_FILTERS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === '전체' ? '전체 분야' : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="practice-source-select"
                  className="block text-xs font-semibold text-[#525C68]"
                >
                  출제 대상
                </label>
                <select
                  id="practice-source-select"
                  value={selectedSource}
                  onChange={(e) =>
                    onSelectSource(e.target.value as SourceFilter)
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-[#CBD2DA] rounded-lg text-[#14181D] focus:outline-none focus:border-[#1E3A8A]"
                >
                  <option value="all">전체 인력풀 ({people.length}명)</option>
                  <option value="preset">
                    기본 위인만 ({people.length - customCount}명)
                  </option>
                  <option value="custom">
                    내가 추가한 인물만 ({customCount}명)
                  </option>
                </select>
              </div>
            </div>

            {/* Question Count Selection */}
            <div className="space-y-2 pt-2 border-t border-[#ECEFF3]">
              <div className="flex items-baseline justify-between gap-2">
                <label className="block text-xs font-semibold text-[#525C68]">
                  연습 문항 수
                </label>
                <span className="text-xs text-[#788492] font-metric">
                  실제 출제 {actualQuestionCount}문제
                </span>
              </div>
              <div
                role="radiogroup"
                aria-label="연습 문항 수"
                className="grid grid-cols-2 sm:grid-cols-4 gap-2"
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
                      className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
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

            {/* Empty Matching Pool Warning */}
            {matchingPool.length === 0 && (
              <div className="p-3.5 bg-[#FFFBEB] border border-[#F59E0B]/40 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs text-[#92400E]">
                <span>선택한 조건에 해당하는 인물이 없습니다.</span>
                <button
                  type="button"
                  onClick={onOpenAddPerson}
                  className="inline-flex items-center gap-1 font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>새 인물 추가하기</span>
                </button>
              </div>
            )}

            {/* Primary CTA Row */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                disabled={matchingPool.length === 0}
                onClick={onStartGame}
                className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172E6E] active:scale-[0.99] transition-all duration-150 whitespace-nowrap cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
              >
                <span>
                  {matchingPool.length > 0
                    ? `게임 시작 (${actualQuestionCount}문제)`
                    : '출제 가능한 인물 없음'}
                </span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onOpenArchive}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-[#14181D] bg-white border border-[#D0D6DE] rounded-lg hover:bg-[#F0F2F5] transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
              >
                <BookOpen
                  className="w-4 h-4 text-[#525C68] shrink-0"
                  aria-hidden="true"
                />
                <span>인력풀 관리</span>
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
              <BookOpen
                className="w-10 h-10 text-[#1E3A8A]/70 mb-3"
                aria-hidden="true"
              />
              <p className="font-editorial text-lg font-bold text-[#14181D]">
                한국 위인 기록 아카이브
              </p>
              <p className="text-xs text-[#525C68] mt-1">
                고조선~삼국 · 고려 · 조선 · 근현대 · 현대
              </p>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-6 pt-16 text-white">
            <p className="text-xs text-white/80">
              인물 조사 · 분류 · JSON 백업 · 한글 타자 통합 워크스페이스
            </p>
            <p className="font-editorial text-lg font-semibold mt-1 leading-snug">
              직접 발굴한 위인을 추가하고 한 문장씩 손끝으로 익히세요
            </p>
          </div>
        </div>
      </section>

      {/* Full-Width 4-Column Best Record & Pool Strip */}
      <section aria-label="내 최고 기록" className="border-y border-[#E1E5EA] py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-editorial text-base font-bold text-[#14181D]">
            브라우저 저장 기록 및 인력풀 현황
          </h2>
          {bestRecord && (
            <button
              type="button"
              onClick={onClearRecord}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#525C68] hover:text-[#C81E1E] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>타자 기록 초기화</span>
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
                  <span className="text-sm font-normal text-[#525C68] ml-1">
                    타/분
                  </span>
                </>
              ) : (
                <span className="text-lg font-normal text-[#788492]">
                  아직 기록 없음
                </span>
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#525C68]">최고 평균 정확도</p>
            <p className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#14181D] font-metric">
              {bestRecord ? (
                <>
                  {bestRecord.bestAccuracy}
                  <span className="text-sm font-normal text-[#525C68] ml-0.5">
                    %
                  </span>
                </>
              ) : (
                <span className="text-lg font-normal text-[#788492]">—</span>
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#525C68]">완료한 타자 연습</p>
            <p className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#14181D] font-metric">
              {bestRecord ? bestRecord.totalSessions : 0}
              <span className="text-sm font-normal text-[#525C68] ml-1">회</span>
            </p>
          </div>

          <div>
            <p className="text-xs text-[#525C68]">등록된 위인 인력풀</p>
            <p className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#1E3A8A] font-metric">
              {people.length}
              <span className="text-sm font-normal text-[#525C68] ml-1">
                명{customCount > 0 ? ` (+${customCount})` : ''}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Clean Editorial 3-Step Guide */}
      <section
        aria-label="활용 안내"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2"
      >
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[#14181D]">
            01. 시대·분야별 맞춤형 타자 연습
          </h3>
          <p className="text-sm leading-relaxed text-[#525C68]">
            한글 조합 상태를 인식해 오타 깜빡임을 막고, 2벌식 자소 기준으로 정확한 타수와
            실시간 글자 정오답 피드백을 제공합니다.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[#14181D]">
            02. 직접 확장하는 한국 인물 인력풀
          </h3>
          <p className="text-sm leading-relaxed text-[#525C68]">
            인력풀 탭에서 새로운 역사·현대 인물을 추가하고 상세 공적과 태그를 구조화하면
            즉시 타자 연습 문항에 반영됩니다.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[#14181D]">
            03. JSON 백업 및 일괄 병합
          </h3>
          <p className="text-sm leading-relaxed text-[#525C68]">
            구축한 인물 데이터를 JSON으로 내보내 보관하고, 외부 조사 목록을 중복 검사 후
            안전하게 병합하거나 복원할 수 있습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
