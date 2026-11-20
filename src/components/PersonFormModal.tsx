import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Plus, X } from 'lucide-react';
import { CATEGORIES, ERAS } from '../data/figuresData';
import type { Category, Era, Person, PersonFormInput } from '../types/game';

interface PersonFormModalProps {
  isOpen: boolean;
  editingPerson: Person | null;
  existingPeople: Person[];
  onClose: () => void;
  onSave: (input: PersonFormInput, editingId?: string) => void;
}

export function PersonFormModal({
  isOpen,
  editingPerson,
  existingPeople,
  onClose,
  onSave,
}: PersonFormModalProps) {
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [era, setEra] = useState<Era>('조선');
  const [category, setCategory] = useState<Category>('정치/외교');
  const [summary, setSummary] = useState('');
  const [details, setDetails] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState('');
  const [touched, setTouched] = useState<{ name: boolean; summary: boolean }>({
    name: false,
    summary: false,
  });
  const [duplicateConfirmed, setDuplicateConfirmed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (editingPerson) {
      setName(editingPerson.name);
      setAlias(editingPerson.alias);
      setEra(editingPerson.era);
      setCategory(editingPerson.category);
      setSummary(editingPerson.summary);
      setDetails(editingPerson.details);
      setTags(editingPerson.tags);
    } else {
      setName('');
      setAlias('');
      setEra('조선');
      setCategory('정치/외교');
      setSummary('');
      setDetails('');
      setTags([]);
    }
    setTagDraft('');
    setTouched({ name: false, summary: false });
    setDuplicateConfirmed(false);
  }, [editingPerson, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const trimmedName = name.trim();
  const trimmedSummary = summary.trim();

  const duplicateMatch = useMemo(() => {
    if (!trimmedName) return null;
    const normalized = trimmedName.toLowerCase();
    return (
      existingPeople.find(
        (p) =>
          p.id !== editingPerson?.id &&
          p.name.trim().toLowerCase() === normalized
      ) ?? null
    );
  }, [editingPerson?.id, existingPeople, trimmedName]);

  // Reset duplicate confirmation whenever the name changes
  useEffect(() => {
    setDuplicateConfirmed(false);
  }, [trimmedName]);

  if (!isOpen) return null;

  const nameError =
    touched.name && trimmedName.length === 0
      ? '인물 이름을 입력해 주세요.'
      : null;
  const summaryError =
    touched.summary && trimmedSummary.length === 0
      ? '핵심 업적 한 줄 요약을 입력해 주세요.'
      : null;

  const isFormValid = trimmedName.length > 0 && trimmedSummary.length > 0;
  const needsDuplicateAck = Boolean(duplicateMatch) && !duplicateConfirmed;

  const commitTagDraft = (raw: string) => {
    const pieces = raw
      .split(',')
      .map((s) => s.trim().replace(/^#/, ''))
      .filter(Boolean);
    if (pieces.length === 0) return;

    setTags((prev) => {
      const next = [...prev];
      for (const piece of pieces) {
        if (!next.includes(piece) && next.length < 8) {
          next.push(piece);
        }
      }
      return next;
    });
    setTagDraft('');
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return;
      e.preventDefault();
      commitTagDraft(tagDraft);
    } else if (e.key === 'Backspace' && tagDraft === '' && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, summary: true });

    if (!isFormValid) return;

    if (duplicateMatch && !duplicateConfirmed) {
      return;
    }

    // Include any unsubmitted tag text cleanly
    const finalTags = [...tags];
    if (tagDraft.trim()) {
      for (const piece of tagDraft
        .split(',')
        .map((s) => s.trim().replace(/^#/, ''))
        .filter(Boolean)) {
        if (!finalTags.includes(piece) && finalTags.length < 8) {
          finalTags.push(piece);
        }
      }
    }

    onSave(
      {
        name: trimmedName,
        alias: alias.trim(),
        era,
        category,
        summary: trimmedSummary,
        details: details.trim(),
        tags: finalTags,
      },
      editingPerson?.id
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#14181D]/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="person-form-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-[#E1E5EA] rounded-xl shadow-xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-5 bg-white border-b border-[#ECEFF3]">
          <div>
            <h2
              id="person-form-title"
              className="font-editorial text-xl font-bold text-[#14181D]"
            >
              {editingPerson ? '인물 정보 수정' : '새 인물 추가'}
            </h2>
            <p className="text-xs text-[#525C68] mt-0.5">
              등록한 인물은 인력풀에 저장되며 타자 연습 문항으로도 바로 출제됩니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-2 text-[#525C68] hover:text-[#14181D] hover:bg-[#F0F2F5] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
          {/* Name + Alias */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="person-name"
                className="block text-sm font-semibold text-[#14181D]"
              >
                인물명 <span className="text-[#C81E1E]">*</span>
              </label>
              <input
                id="person-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                placeholder="예: 손기정, 허준, 정주영"
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-[#14181D] placeholder:text-[#98A2AE] focus:outline-none ${
                  nameError
                    ? 'border-[#DC2626] focus:border-[#DC2626]'
                    : 'border-[#CBD2DA] focus:border-[#1E3A8A]'
                }`}
              />
              {nameError && (
                <p className="text-xs font-medium text-[#C81E1E]">{nameError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="person-alias"
                className="block text-sm font-semibold text-[#14181D]"
              >
                호 · 별칭 · 수식어{' '}
                <span className="text-xs font-normal text-[#788492]">(선택)</span>
              </label>
              <input
                id="person-alias"
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="예: 바다의 왕자, 동의보감의 의성"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#CBD2DA] rounded-lg text-[#14181D] placeholder:text-[#98A2AE] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          {/* Duplicate Name Warning Banner */}
          {duplicateMatch && (
            <div className="p-4 bg-[#FFFBEB] border border-[#F59E0B]/50 rounded-lg space-y-2.5">
              <div className="flex items-start gap-2.5">
                <AlertTriangle
                  className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="text-xs sm:text-sm text-[#92400E] space-y-1">
                  <p className="font-semibold">
                    이미 동일한 이름(&lsquo;{duplicateMatch.name}&rsquo;)의 인물이 등록되어 있습니다.
                  </p>
                  <p className="text-xs text-[#92400E]/90">
                    기존 항목: {duplicateMatch.era} · {duplicateMatch.category} —{' '}
                    {duplicateMatch.summary}
                  </p>
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#78350F] cursor-pointer select-none pl-6">
                <input
                  type="checkbox"
                  checked={duplicateConfirmed}
                  onChange={(e) => setDuplicateConfirmed(e.target.checked)}
                  className="w-4 h-4 accent-[#B45309] rounded cursor-pointer"
                />
                <span>중복 인물임을 확인했으며 별도 항목으로 저장합니다.</span>
              </label>
            </div>
          )}

          {/* Era + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="person-era"
                className="block text-sm font-semibold text-[#14181D]"
              >
                시대 분류
              </label>
              <select
                id="person-era"
                value={era}
                onChange={(e) => setEra(e.target.value as Era)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#CBD2DA] rounded-lg text-[#14181D] focus:outline-none focus:border-[#1E3A8A]"
              >
                {ERAS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="person-category"
                className="block text-sm font-semibold text-[#14181D]"
              >
                분야 분류
              </label>
              <select
                id="person-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#CBD2DA] rounded-lg text-[#14181D] focus:outline-none focus:border-[#1E3A8A]"
              >
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* One-line Achievement Summary */}
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <label
                htmlFor="person-summary"
                className="block text-sm font-semibold text-[#14181D]"
              >
                핵심 업적 한 줄 요약 <span className="text-[#C81E1E]">*</span>
              </label>
              <span className="text-xs text-[#788492] font-metric">
                {trimmedSummary.length}자 (타자 연습 문장으로 사용)
              </span>
            </div>
            <input
              id="person-summary"
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, summary: true }))}
              placeholder="예: 동의보감을 편찬해 조선의 자주적 의학 체계를 완성하였다."
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-[#14181D] placeholder:text-[#98A2AE] focus:outline-none ${
                summaryError
                  ? 'border-[#DC2626] focus:border-[#DC2626]'
                  : 'border-[#CBD2DA] focus:border-[#1E3A8A]'
              }`}
            />
            {summaryError && (
              <p className="text-xs font-medium text-[#C81E1E]">{summaryError}</p>
            )}
          </div>

          {/* Details / Research Notes */}
          <div className="space-y-1.5">
            <label
              htmlFor="person-details"
              className="block text-sm font-semibold text-[#14181D]"
            >
              상세 공적 및 조사 메모{' '}
              <span className="text-xs font-normal text-[#788492]">(선택)</span>
            </label>
            <textarea
              id="person-details"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="인물의 생애 배경, 주요 활동, 관련 사건이나 참고 자료를 자유롭게 기록해 두세요."
              className="w-full px-3.5 py-2.5 text-sm leading-relaxed bg-white border border-[#CBD2DA] rounded-lg text-[#14181D] placeholder:text-[#98A2AE] focus:outline-none focus:border-[#1E3A8A] resize-y"
            />
          </div>

          {/* Keyword Tags */}
          <div className="space-y-2">
            <label
              htmlFor="person-tags"
              className="block text-sm font-semibold text-[#14181D]"
            >
              키워드 태그{' '}
              <span className="text-xs font-normal text-[#788492]">
                (Enter 또는 쉼표로 추가, 최대 8개)
              </span>
            </label>
            <div className="flex gap-2">
              <input
                id="person-tags"
                type="text"
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="예: 동의보감, 한의학, 조선의학"
                className="flex-1 px-3.5 py-2 text-sm bg-white border border-[#CBD2DA] rounded-lg text-[#14181D] placeholder:text-[#98A2AE] focus:outline-none focus:border-[#1E3A8A]"
              />
              <button
                type="button"
                onClick={() => commitTagDraft(tagDraft)}
                disabled={tagDraft.trim().length === 0 || tags.length >= 8}
                className="inline-flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-[#14181D] bg-[#F0F2F5] rounded-lg hover:bg-[#E2E6EC] transition-colors disabled:opacity-40 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>추가</span>
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#14181D] bg-[#F0F2F5] rounded-md"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setTags((prev) => prev.filter((item) => item !== tag))
                      }
                      aria-label={`${tag} 태그 삭제`}
                      className="text-[#525C68] hover:text-[#C81E1E] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#ECEFF3] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-[#525C68] bg-white border border-[#D0D6DE] rounded-lg hover:bg-[#F0F2F5] transition-colors cursor-pointer whitespace-nowrap"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!isFormValid || needsDuplicateAck}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172E6E] transition-colors disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
            >
              {editingPerson ? '변경사항 저장' : '인력풀에 저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
