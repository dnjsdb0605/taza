import { useEffect } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { PRESET_PEOPLE } from '../data/figuresData';

interface RestoreConfirmModalProps {
  isOpen: boolean;
  customCount: number;
  onClose: () => void;
  onRestoreMissingOnly: () => void;
  onResetAllToPresets: () => void;
}

export function RestoreConfirmModal({
  isOpen,
  customCount,
  onClose,
  onRestoreMissingOnly,
  onResetAllToPresets,
}: RestoreConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#14181D]/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restore-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white border border-[#E1E5EA] rounded-xl shadow-xl">
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-[#ECEFF3]">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#1E3A8A]" aria-hidden="true" />
            <h2
              id="restore-modal-title"
              className="font-editorial text-lg font-bold text-[#14181D]"
            >
              기본 위인 데이터 복원
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 text-[#525C68] hover:text-[#14181D] hover:bg-[#F0F2F5] rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm leading-relaxed text-[#525C68]">
            기본 제공되는 대한민국 대표 위인 {PRESET_PEOPLE.length}명의 데이터를 복원합니다.
            {customCount > 0 &&
              ` 현재 직접 추가하신 확장 인물 ${customCount}명이 저장되어 있습니다.`}
          </p>

          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={onRestoreMissingOnly}
              className="w-full text-left p-4 border border-[#1E3A8A]/40 bg-[#F5F8FF] hover:bg-[#EBF1FF] rounded-lg transition-colors cursor-pointer"
            >
              <p className="text-sm font-semibold text-[#1E3A8A]">
                기본 위인 복원 (내가 추가한 인물 유지)
              </p>
              <p className="text-xs text-[#525C68] mt-1">
                삭제되거나 수정된 기본 위인 {PRESET_PEOPLE.length}명만 복구하고, 직접 추가한 인물은 그대로 유지합니다.
              </p>
            </button>

            <button
              type="button"
              onClick={onResetAllToPresets}
              className="w-full text-left p-4 border border-[#FECACA] bg-white hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
            >
              <p className="text-sm font-semibold text-[#C81E1E]">
                완전 초기화 (기본 위인 {PRESET_PEOPLE.length}명으로 재설정)
              </p>
              <p className="text-xs text-[#525C68] mt-1">
                직접 추가한 인물을 포함해 모든 데이터를 초기 상태로 되돌립니다.
              </p>
            </button>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#525C68] hover:text-[#14181D] cursor-pointer"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
