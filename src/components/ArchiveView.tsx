import { useMemo, useState } from 'react';
import {
  Download,
  Keyboard,
  Plus,
  RotateCcw,
  Search,
  Upload,
  X,
} from 'lucide-react';
import {
  CATEGORIES,
  CATEGORY_FILTERS,
  CATEGORY_STYLES,
  ERAS,
  ERA_FILTERS,
  ERA_STYLES,
} from '../data/figuresData';
import type {
  CategoryFilter,
  EraFilter,
  Person,
  SourceFilter,
} from '../types/game';

interface ArchiveViewProps {
  people: Person[];
  onOpenAddModal: () => void;
  onSelectPerson: (person: Person) => void;
  onExportJson: () => void;
  onOpenImportModal: () => void;
  onOpenRestoreModal: () => void;
  onPracticeList: (peopleList: Person[], label: string) => void;
  externalTagFilter: string | null;
  onClearExternalTag: () => void;
}

export function ArchiveView({
  people,
  onOpenAddModal,
  onSelectPerson,
  onExportJson,
  onOpenImportModal,
  onOpenRestoreModal,
  onPracticeList,
  externalTagFilter,
  onClearExternalTag,
}: ArchiveViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [eraFilter, setEraFilter] = useState<EraFilter>('전체');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('전체');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'newest'>('default');
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const activeTag = externalTagFilter ?? tagFilter;

  const stats = useMemo(() => {
    const presetCount = people.filter((p) => p.isPreset).length;
    const customCount = people.length - presetCount;
    const eraCounts = Object.fromEntries(
      ERAS.map((era) => [era, people.filter((p) => p.era === era).length])
    ) as Record<(typeof ERAS)[number], number>;
    const categoryCounts = Object.fromEntries(
      CATEGORIES.map((cat) => [
        cat,
        people.filter((p) => p.category === cat).length,
      ])
    ) as Record<(typeof CATEGORIES)[number], number>;
    return { presetCount, customCount, eraCounts, categoryCounts };
  }, [people]);

  const filteredPeople = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const matched = people.filter((person) => {
      if (eraFilter !== '전체' && person.era !== eraFilter) return false;
      if (categoryFilter !== '전체' && person.category !== categoryFilter) {
        return false;
      }
      if (sourceFilter === 'preset' && !person.isPreset) return false;
      if (sourceFilter === 'custom' && person.isPreset) return false;
      if (
        activeTag &&
        !person.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase())
      ) {
        return false;
      }
      if (q) {
        const haystack = [
          person.name,
          person.alias,
          person.summary,
          person.details,
          person.era,
          person.category,
          ...person.tags,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'name') {
      return [...matched].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    }
    if (sortBy === 'newest') {
      return [...matched].sort((a, b) => {
        if (a.isPreset !== b.isPreset) return a.isPreset ? 1 : -1;
        return b.createdAt.localeCompare(a.createdAt);
      });
    }
    return matched;
  }, [activeTag, categoryFilter, eraFilter, people, searchQuery, sortBy, sourceFilter]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    eraFilter !== '전체' ||
    categoryFilter !== '전체' ||
    sourceFilter !== 'all' ||
    Boolean(activeTag);

  const resetAllFilters = () => {
    setSearchQuery('');
    setEraFilter('전체');
    setCategoryFilter('전체');
    setSourceFilter('all');
    setTagFilter(null);
    onClearExternalTag();
  };

  const handleTagClick = (tag: string) => {
    if (activeTag === tag) {
      setTagFilter(null);
      onClearExternalTag();
    } else {
      onClearExternalTag();
      setTagFilter(tag);
    }
  };

  const practiceLabel = hasActiveFilters
    ? `필터 선택 (${filteredPeople.length}명)`
    : '전체 인력풀';

  return (
    <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12 space-y-8">
      {/* Pool Dashboard Header */}
      <section className="space-y-6 pb-8 border-b border-[#E1E5EA]">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs sm:text-sm font-medium text-[#525C68]">
              한국 인물 아카이브 · 인력풀 관리 및 타자 문항 확장
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#14181D] tracking-tight">
              위인 인력풀 대시보드
            </h1>
            <p className="text-sm sm:text-[15px] text-[#525C68] leading-relaxed">
              &lsquo;한국을 빛낸 100명의 위인들&rsquo; 기반 인물 데이터에 새로운 역사·현대 인물을
              자유롭게 조사·추가하고, 분류한 목록으로 바로 타자 연습을 진행할 수 있습니다.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172E6E] transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
            >
              <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>새 인물 추가</span>
            </button>

            <button
              type="button"
              onClick={onExportJson}
              disabled={people.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-[#14181D] bg-white border border-[#D0D6DE] rounded-lg hover:bg-[#F0F2F5] transition-colors whitespace-nowrap disabled:opacity-45 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#525C68] shrink-0" aria-hidden="true" />
              <span>JSON 내보내기</span>
            </button>

            <button
              type="button"
              onClick={onOpenImportModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-[#14181D] bg-white border border-[#D0D6DE] rounded-lg hover:bg-[#F0F2F5] transition-colors whitespace-nowrap cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#525C68] shrink-0" aria-hidden="true" />
              <span>JSON 가져오기</span>
            </button>

            <button
              type="button"
              onClick={onOpenRestoreModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-[#525C68] bg-white border border-[#E1E5EA] rounded-lg hover:text-[#14181D] hover:bg-[#F0F2F5] transition-colors whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>기본 위인 복원</span>
            </button>
          </div>
        </div>

        {/* Summary & Distribution Strip */}
        <div className="bg-white border border-[#E1E5EA] rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-baseline justify-between gap-4 pb-4 border-b border-[#ECEFF3]">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <div>
                <span className="text-xs text-[#525C68]">전체 등록 인물</span>
                <p className="font-metric text-2xl font-semibold text-[#14181D]">
                  {people.length}
                  <span className="text-sm font-normal text-[#525C68] ml-1">명</span>
                </p>
              </div>
              <div className="text-xs sm:text-sm text-[#525C68] font-metric">
                기본 위인 <strong className="text-[#14181D]">{stats.presetCount}</strong>명
                <span className="mx-2 text-[#CBD2DA]">·</span>
                사용자 확장{' '}
                <strong className="text-[#1E3A8A]">{stats.customCount}</strong>명
              </div>
            </div>

            {filteredPeople.length > 0 && (
              <button
                type="button"
                onClick={() => onPracticeList(filteredPeople, practiceLabel)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#1E3A8A] bg-[#EFF6FF] hover:bg-[#DBEAFE] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                <Keyboard className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  {hasActiveFilters
                    ? `검색 결과 ${filteredPeople.length}명으로 타자 연습`
                    : `전체 ${people.length}명으로 타자 연습`}
                </span>
              </button>
            )}
          </div>

          {/* Interactive Era & Category Distribution Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <span className="font-semibold text-[#525C68]">시대별 분포</span>
              <div className="flex flex-wrap gap-1.5">
                {ERAS.map((era) => {
                  const active = eraFilter === era;
                  const style = ERA_STYLES[era];
                  return (
                    <button
                      key={era}
                      type="button"
                      onClick={() => setEraFilter(active ? '전체' : era)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[#14181D] text-white'
                          : `${style.bg} ${style.text} hover:opacity-85`
                      }`}
                    >
                      <span>{era}</span>
                      <span className="font-metric opacity-80">
                        {stats.eraCounts[era]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-[#525C68]">분야별 분포</span>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => {
                  const active = categoryFilter === cat;
                  const style = CATEGORY_STYLES[cat];
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(active ? '전체' : cat)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                          : `bg-white ${style.border} ${style.text} hover:bg-[#F7F8F9]`
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="font-metric opacity-80">
                        {stats.categoryCounts[cat]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Filter & Real-Time Search Controls */}
      <section aria-label="인물 검색 및 필터" className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Unified Search Input */}
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-[#788492] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="인물명, 별칭, 핵심 업적, 키워드 태그로 실시간 검색..."
              aria-label="인물 통합 검색"
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-[#CBD2DA] rounded-lg text-[#14181D] placeholder:text-[#8C96A3] focus:outline-none focus:border-[#1E3A8A]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="검색어 지우기"
                className="p-1 text-[#788492] hover:text-[#14181D] absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Era Dropdown */}
          <select
            value={eraFilter}
            onChange={(e) => setEraFilter(e.target.value as EraFilter)}
            aria-label="시대 필터"
            className="px-3.5 py-2.5 text-sm bg-white border border-[#CBD2DA] rounded-lg text-[#14181D] focus:outline-none focus:border-[#1E3A8A] min-w-[132px]"
          >
            {ERA_FILTERS.map((era) => (
              <option key={era} value={era}>
                {era === '전체' ? '전체 시대' : era}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as 'default' | 'name' | 'newest')
            }
            aria-label="정렬 기준"
            className="px-3.5 py-2.5 text-sm bg-white border border-[#CBD2DA] rounded-lg text-[#14181D] focus:outline-none focus:border-[#1E3A8A] min-w-[128px]"
          >
            <option value="default">시대순 정렬</option>
            <option value="name">이름순 (가나다)</option>
            <option value="newest">직접 추가 우선</option>
          </select>

          {/* Source Segmented Filter */}
          <div
            role="radiogroup"
            aria-label="출처 필터"
            className="inline-flex items-center p-1 bg-[#EAECEF] rounded-lg self-start md:self-auto"
          >
            {[
              { value: 'all' as SourceFilter, label: '전체' },
              { value: 'preset' as SourceFilter, label: '기본 위인' },
              { value: 'custom' as SourceFilter, label: '직접 추가' },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                role="radio"
                aria-checked={sourceFilter === item.value}
                onClick={() => setSourceFilter(item.value)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  sourceFilter === item.value
                    ? 'bg-white text-[#14181D] shadow-xs font-semibold'
                    : 'text-[#525C68] hover:text-[#14181D]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs + Active Tag/Reset Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="분야 필터 탭"
            className="flex flex-wrap items-center gap-1 p-1 bg-[#EAECEF] rounded-lg"
          >
            {CATEGORY_FILTERS.map((category) => {
              const active = categoryFilter === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-white text-[#1E3A8A] shadow-xs font-semibold'
                      : 'text-[#525C68] hover:text-[#14181D]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            {activeTag && (
              <button
                type="button"
                onClick={() => {
                  setTagFilter(null);
                  onClearExternalTag();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1E3A8A]/10 text-[#1E3A8A] font-medium rounded-md cursor-pointer"
              >
                <span>태그 #{activeTag}</span>
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}

            <span className="text-[#525C68] font-metric">
              조회 결과 {filteredPeople.length}명
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs font-semibold text-[#1E3A8A] hover:underline cursor-pointer whitespace-nowrap"
              >
                필터 초기화
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Person Card Grid or Empty State */}
      {people.length === 0 ? (
        <section className="bg-white border border-[#E1E5EA] rounded-xl p-12 text-center space-y-4">
          <p className="font-editorial text-xl font-bold text-[#14181D]">
            등록된 인물이 없습니다
          </p>
          <p className="text-sm text-[#525C68] max-w-md mx-auto">
            기본 위인 데이터를 복원하거나 &lsquo;새 인물 추가&rsquo; 버튼으로 나만의 한국 인물
            아카이브를 구축해 보세요.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenRestoreModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172E6E] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>기본 위인 데이터 복원</span>
            </button>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#14181D] bg-white border border-[#D0D6DE] rounded-lg hover:bg-[#F0F2F5] cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>새 인물 추가</span>
            </button>
          </div>
        </section>
      ) : filteredPeople.length === 0 ? (
        <section className="bg-white border border-[#E1E5EA] rounded-xl p-12 text-center space-y-4">
          <p className="font-editorial text-xl font-bold text-[#14181D]">
            조건에 맞는 인물이 없습니다
          </p>
          <p className="text-sm text-[#525C68]">
            검색어나 시대·분야·태그 필터를 변경하거나 초기화해 전체 인력풀을 확인해 보세요.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172E6E] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>필터 초기화</span>
            </button>
          </div>
        </section>
      ) : (
        <section
          aria-label="인물 카드 목록"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredPeople.map((person) => {
            const eraStyle = ERA_STYLES[person.era];
            const categoryStyle = CATEGORY_STYLES[person.category];
            const visibleTags = person.tags.slice(0, 3);
            const extraTagCount = Math.max(0, person.tags.length - 3);

            return (
              <article
                key={person.id}
                onClick={() => onSelectPerson(person)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectPerson(person);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${person.name} 상세 정보 보기`}
                className="group bg-white border border-[#E1E5EA] hover:border-[#1E3A8A]/50 rounded-xl p-5 flex flex-col justify-between gap-4 transition-all duration-150 hover:shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
              >
                <div className="space-y-3">
                  {/* Era & Category Badges */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold ${eraStyle.bg} ${eraStyle.text}`}
                      >
                        {person.era}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded border font-medium bg-white ${categoryStyle.border} ${categoryStyle.text}`}
                      >
                        {person.category}
                      </span>
                    </div>
                    {!person.isPreset && (
                      <span className="text-[11px] font-semibold text-[#1E3A8A] whitespace-nowrap">
                        직접 추가
                      </span>
                    )}
                  </div>

                  {/* Name & Alias */}
                  <div>
                    <h2 className="font-editorial text-xl font-bold text-[#14181D] group-hover:text-[#1E3A8A] transition-colors">
                      {person.name}
                    </h2>
                    {person.alias && (
                      <p className="text-xs font-medium text-[#525C68] mt-0.5">
                        {person.alias}
                      </p>
                    )}
                  </div>

                  {/* One-Line Summary */}
                  <p className="text-sm leading-relaxed text-[#333B44]">
                    {person.summary}
                  </p>
                </div>

                {/* Tags (Max 3) */}
                {visibleTags.length > 0 && (
                  <div className="pt-3 border-t border-[#F0F2F5] flex flex-wrap items-center gap-1.5">
                    {visibleTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTagClick(tag);
                        }}
                        className={`px-2 py-0.5 text-xs rounded transition-colors cursor-pointer ${
                          activeTag === tag
                            ? 'bg-[#1E3A8A] text-white font-medium'
                            : 'bg-[#F0F2F5] text-[#525C68] hover:bg-[#E2E6EC] hover:text-[#14181D]'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                    {extraTagCount > 0 && (
                      <span className="text-xs text-[#788492] font-metric pl-0.5">
                        +{extraTagCount}
                      </span>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
