import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, FileJson, Upload, X } from 'lucide-react';
import { parseImportedPeopleJson } from '../data/figuresData';
import type { ImportMergeStrategy, Person } from '../types/game';

interface JsonImportModalProps {
  isOpen: boolean;
  existingPeople: Person[];
  onClose: () => void;
  onConfirmImport: (people: Person[], strategy: ImportMergeStrategy) => void;
}

export function JsonImportModal({
  isOpen,
  existingPeople,
  onClose,
  onConfirmImport,
}: JsonImportModalProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [rawText, setRawText] = useState('');
  const [strategy, setStrategy] = useState<ImportMergeStrategy>('merge-skip');
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedPeople, setParsedPeople] = useState<Person[]>([]);
  const [skippedInvalid, setSkippedInvalid] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setFileName(null);
    setRawText('');
    setStrategy('merge-skip');
    setParseError(null);
    setParsedPeople([]);
    setSkippedInvalid(0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const existingNameSet = useMemo(
    () => new Set(existingPeople.map((p) => p.name.trim().toLowerCase())),
    [existingPeople]
  );

  const duplicateStats = useMemo(() => {
    let duplicates = 0;
    let uniqueNew = 0;
    for (const p of parsedPeople) {
      if (existingNameSet.has(p.name.trim().toLowerCase())) {
        duplicates += 1;
      } else {
        uniqueNew += 1;
      }
    }
    return { duplicates, uniqueNew };
  }, [existingNameSet, parsedPeople]);

  if (!isOpen) return null;

  const validateAndLoad = (text: string) => {
    setRawText(text);
    if (!text.trim()) {
      setParseError(null);
      setParsedPeople([]);
      setSkippedInvalid(0);
      return;
    }

    const result = parseImportedPeopleJson(text);
    if (result.error) {
      setParseError(result.error);
      setParsedPeople([]);
      setSkippedInvalid(result.skippedCount);
    } else {
      setParseError(null);
      setParsedPeople(result.validPeople);
      setSkippedInvalid(result.skippedCount);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : '';
      validateAndLoad(content);
    };
    reader.onerror = () => {
      setParseError('파일을 읽는 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setParsedPeople([]);
    };
    reader.readAsText(file, 'utf-8');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#14181D]/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="json-import-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-[#E1E5EA] rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-[#ECEFF3]">
          <div>
            <h2
              id="json-import-title"
              className="font-editorial text-xl font-bold text-[#14181D]"
            >
              JSON 인력풀 가져오기
            </h2>
            <p className="text-xs text-[#525C68] mt-0.5">
              백업 파일이나 외부에서 정리한 인물 JSON 데이터를 불러와 병합하거나 복원합니다.
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

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* File Drop / Pick Area */}
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-[#CBD2DA] hover:border-[#1E3A8A] bg-[#F7F8F9] hover:bg-[#F0F4FA] rounded-xl transition-colors cursor-pointer"
            >
              <Upload className="w-6 h-6 text-[#1E3A8A]" aria-hidden="true" />
              <span className="text-sm font-semibold text-[#14181D]">
                {fileName ? `선택된 파일: ${fileName}` : 'JSON 파일 선택하기 (.json)'}
              </span>
              <span className="text-xs text-[#525C68]">
                &lsquo;JSON 내보내기&rsquo;로 저장한 백업 파일을 그대로 불러올 수 있습니다.
              </span>
            </button>
          </div>

          {/* Direct JSON Paste Option */}
          <div className="space-y-1.5">
            <label
              htmlFor="json-raw-paste"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#525C68]"
            >
              <FileJson className="w-3.5 h-3.5" aria-hidden="true" />
              <span>또는 JSON 배열 직접 붙여넣기</span>
            </label>
            <textarea
              id="json-raw-paste"
              rows={4}
              value={rawText}
              onChange={(e) => {
                setFileName(null);
                validateAndLoad(e.target.value);
              }}
              placeholder='[{"name": "허준", "alias": "조선의 의성", "era": "조선", "category": "과학/기술", "summary": "동의보감을 편찬해 조선 의학의 기틀을 세웠다."}]'
              className="w-full px-3.5 py-2.5 text-xs font-metric bg-white border border-[#CBD2DA] rounded-lg text-[#14181D] placeholder:text-[#98A2AE] focus:outline-none focus:border-[#1E3A8A]"
            />
          </div>

          {/* Validation Error Alert */}
          {parseError && (
            <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-lg flex items-start gap-2.5">
              <AlertCircle
                className="w-4 h-4 text-[#C81E1E] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs sm:text-sm font-medium text-[#991B1B]">
                {parseError}
              </p>
            </div>
          )}

          {/* Valid Preview + Strategy Selector */}
          {parsedPeople.length > 0 && !parseError && (
            <div className="space-y-4">
              <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#166534]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>총 {parsedPeople.length}명의 유효한 인물 데이터를 확인했습니다.</span>
                </div>
                <p className="text-xs text-[#15803D] font-metric pl-6">
                  신규 인물 {duplicateStats.uniqueNew}명 · 기존 이름 중복{' '}
                  {duplicateStats.duplicates}명
                  {skippedInvalid > 0 ? ` · 형식 누락 제외 ${skippedInvalid}건` : ''}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#14181D]">
                  가져오기 방식 선택 (이름 기준 중복 확인)
                </p>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3.5 border border-[#E1E5EA] rounded-lg cursor-pointer hover:bg-[#F7F8F9]">
                    <input
                      type="radio"
                      name="import-strategy"
                      value="merge-skip"
                      checked={strategy === 'merge-skip'}
                      onChange={() => setStrategy('merge-skip')}
                      className="mt-0.5 accent-[#1E3A8A]"
                    />
                    <div className="text-xs sm:text-sm">
                      <p className="font-semibold text-[#14181D]">
                        기존 데이터에 병합 — 중복 이름 건너뛰기 (권장)
                      </p>
                      <p className="text-xs text-[#525C68] mt-0.5">
                        기존 인물은 유지하고 새로운 이름({duplicateStats.uniqueNew}명)만 추가합니다.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 border border-[#E1E5EA] rounded-lg cursor-pointer hover:bg-[#F7F8F9]">
                    <input
                      type="radio"
                      name="import-strategy"
                      value="merge-overwrite"
                      checked={strategy === 'merge-overwrite'}
                      onChange={() => setStrategy('merge-overwrite')}
                      className="mt-0.5 accent-[#1E3A8A]"
                    />
                    <div className="text-xs sm:text-sm">
                      <p className="font-semibold text-[#14181D]">
                        기존 데이터에 병합 — 중복 이름 최신 내용으로 갱신
                      </p>
                      <p className="text-xs text-[#525C68] mt-0.5">
                        같은 이름의 인물({duplicateStats.duplicates}명)은 가져온 데이터로 업데이트하고 신규 인물을 추가합니다.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 border border-[#E1E5EA] rounded-lg cursor-pointer hover:bg-[#F7F8F9]">
                    <input
                      type="radio"
                      name="import-strategy"
                      value="replace-all"
                      checked={strategy === 'replace-all'}
                      onChange={() => setStrategy('replace-all')}
                      className="mt-0.5 accent-[#1E3A8A]"
                    />
                    <div className="text-xs sm:text-sm">
                      <p className="font-semibold text-[#C81E1E]">
                        전체 덮어쓰기 (현재 목록 교체)
                      </p>
                      <p className="text-xs text-[#525C68] mt-0.5">
                        현재 저장된 목록을 모두 비우고 가져온 {parsedPeople.length}명으로 대체합니다.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-[#ECEFF3] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-[#525C68] bg-white border border-[#D0D6DE] rounded-lg hover:bg-[#F0F2F5] transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              disabled={parsedPeople.length === 0 || Boolean(parseError)}
              onClick={() => onConfirmImport(parsedPeople, strategy)}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172E6E] transition-colors disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
            >
              데이터 적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
