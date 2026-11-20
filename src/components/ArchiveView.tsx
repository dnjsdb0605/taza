import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ERA_DESCRIPTIONS, ERA_FILTERS, figuresData } from '../data/figuresData';
import type { EraFilter } from '../types/game';

interface ArchiveViewProps {
  onPracticeEra: (era: EraFilter) => void;
}

export function ArchiveView({ onPracticeEra }: ArchiveViewProps) {
  const [eraFilter, setEraFilter] = useState<EraFilter>('전체');

  const filteredFigures = useMemo(() => {
    if (eraFilter === '전체') return figuresData;
    return figuresData.filter((f) => f.era === eraFilter);
  }, [eraFilter]);

  return (
    <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14 space-y-8">
      {/* Header & Era Filter */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E1E5EA]">
        <div className="space-y-2.5 max-w-2xl">
          <p className="text-xs sm:text-sm font-medium text-[#525C68]">
            수록 위인 도감 · 총 {figuresData.length}인
          </p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#14181D] tracking-tight">
            대한민국 위인 아카이브
          </h1>
          <p className="text-sm sm:text-base text-[#525C68] leading-relaxed">
            {eraFilter === '전체'
              ? '연습에 출제되는 삼국시대부터 근현대까지 20인의 위인과 핵심 업적 문장을 미리 살펴볼 수 있습니다.'
              : ERA_DESCRIPTIONS[eraFilter]}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onPracticeEra(eraFilter)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172E6E] transition-colors duration-150 whitespace-nowrap self-start lg:self-auto cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
        >
          <span>{eraFilter} 시대로 바로 연습하기</span>
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        </button>
      </section>

      {/* Era Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="시대별 위인 필터"
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#EAECEF] rounded-lg"
        >
          {ERA_FILTERS.map((era) => {
            const active = eraFilter === era;
            return (
              <button
                key={era}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setEraFilter(era)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
                  active
                    ? 'bg-white text-[#1E3A8A] shadow-xs font-semibold'
                    : 'text-[#525C68] hover:text-[#14181D]'
                }`}
              >
                {era}
              </button>
            );
          })}
        </div>

        <p className="text-xs sm:text-sm text-[#525C68] font-metric">
          표시 중 {filteredFigures.length}명
        </p>
      </div>

      {/* Editorial Grid of Figures (Single-Elevation, Zero Pills) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredFigures.map((figure, idx) => (
          <article
            key={figure.id}
            className="bg-white border border-[#E1E5EA] rounded-xl p-6 flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#525C68]">
                <span>
                  <span className="font-semibold text-[#1E3A8A]">{figure.era}</span>
                  <span aria-hidden="true" className="mx-1.5">
                    ·
                  </span>
                  <span>{figure.hint}</span>
                </span>
                <span className="font-metric text-[#788492]">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-baseline gap-2.5">
                <h2 className="font-editorial text-xl font-bold text-[#14181D]">
                  {figure.name}
                </h2>
                <span className="text-xs text-[#788492] font-metric">
                  {figure.years}
                </span>
              </div>
            </div>

            <p className="text-[15px] leading-relaxed text-[#333B44] pt-3 border-t border-[#ECEFF3]">
              {figure.achievement}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
