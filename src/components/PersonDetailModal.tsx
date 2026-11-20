import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Keyboard,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { CATEGORY_STYLES, ERA_STYLES } from '../data/figuresData';
import type { Person } from '../types/game';

interface PersonDetailModalProps {
  person: Person | null;
  onClose: () => void;
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
  onPracticeSingle: (person: Person) => void;
  onSelectTag: (tag: string) => void;
}

export function PersonDetailModal({
  person,
  onClose,
  onEdit,
  onDelete,
  onPracticeSingle,
  onSelectTag,
}: PersonDetailModalProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    setConfirmingDelete(false);
  }, [person?.id]);

  useEffect(() => {
    if (!person) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [person, onClose]);

  if (!person) return null;

  const eraStyle = ERA_STYLES[person.era];
  const categoryStyle = CATEGORY_STYLES[person.category];
  const formattedDate = person.createdAt
    ? person.createdAt.slice(0, 10)
    : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#14181D]/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="person-detail-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-[#E1E5EA] rounded-xl shadow-xl">
        {/* Top Bar */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#ECEFF3]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
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
              <span className="text-[#788492]">
                · {person.isPreset ? '기본 위인' : '사용자 확장 인물'}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2.5">
              <h2
                id="person-detail-title"
                className="font-editorial text-2xl sm:text-3xl font-bold text-[#14181D]"
              >
                {person.name}
              </h2>
              {person.alias && (
                <span className="text-sm font-medium text-[#525C68]">
                  {person.alias}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-2 text-[#525C68] hover:text-[#14181D] hover:bg-[#F0F2F5] rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#525C68]">핵심 업적 (한 줄 요약)</p>
            <p className="text-base sm:text-lg font-medium leading-relaxed text-[#14181D] p-4 bg-[#F7F8F9] border border-[#E6EAEF] rounded-lg">
              {person.summary}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#525C68]">상세 공적 및 조사 메모</p>
            {person.details ? (
              <p className="text-sm sm:text-[15px] leading-[1.75] text-[#333B44] whitespace-pre-line">
                {person.details}
              </p>
            ) : (
              <p className="text-sm text-[#788492]">
                아직 상세 조사 메모가 작성되지 않았습니다. &lsquo;정보 수정&rsquo;에서 보강할 수 있습니다.
              </p>
            )}
          </div>

          {person.tags.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#525C68]">관련 키워드 태그</p>
              <div className="flex flex-wrap gap-2">
                {person.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      onSelectTag(tag);
                      onClose();
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-[#333B44] bg-[#F0F2F5] hover:bg-[#E2E6EC] rounded-md transition-colors cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {formattedDate && (
            <p className="text-xs text-[#788492] font-metric">
              등록일 {formattedDate}
            </p>
          )}

          {/* Delete Confirmation Step (In-Modal, No window.confirm) */}
          {confirmingDelete ? (
            <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-lg space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle
                  className="w-4 h-4 text-[#C81E1E] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-[#991B1B]">
                  &lsquo;{person.name}&rsquo; 인물을 인력풀에서 영구적으로 삭제하시겠습니까?
                </p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="px-3.5 py-2 text-xs sm:text-sm font-medium text-[#525C68] bg-white border border-[#D0D6DE] rounded-lg hover:bg-[#F0F2F5] cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(person)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#C81E1E] rounded-lg hover:bg-[#991B1B] cursor-pointer"
                >
                  삭제 확인
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-[#ECEFF3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onPracticeSingle(person)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172E6E] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Keyboard className="w-4 h-4" aria-hidden="true" />
                <span>이 인물로 타자 연습</span>
              </button>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => onEdit(person)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#14181D] bg-white border border-[#D0D6DE] rounded-lg hover:bg-[#F0F2F5] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Pencil className="w-4 h-4 text-[#525C68]" aria-hidden="true" />
                  <span>정보 수정</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#C81E1E] bg-white border border-[#FECACA] rounded-lg hover:bg-[#FEF2F2] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  <span>삭제</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
