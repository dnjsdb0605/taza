import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { ArchiveView } from './components/ArchiveView';
import { Header } from './components/Header';
import { JsonImportModal } from './components/JsonImportModal';
import { PersonDetailModal } from './components/PersonDetailModal';
import { PersonFormModal } from './components/PersonFormModal';
import { RestoreConfirmModal } from './components/RestoreConfirmModal';
import { ResultScreen } from './components/ResultScreen';
import { StartScreen } from './components/StartScreen';
import { TypingStage } from './components/TypingStage';
import {
  PRESET_PEOPLE,
  buildQuestionSet,
  exportPeopleToJson,
  generatePersonId,
  loadPeoplePool,
  savePeoplePool,
  shufflePeople,
} from './data/figuresData';
import type {
  AppSection,
  BestRecord,
  CategoryFilter,
  EraFilter,
  GameStatus,
  ImportMergeStrategy,
  Person,
  PersonFormInput,
  QuestionCountOption,
  QuestionResult,
  SourceFilter,
  ToastMessage,
} from './types/game';
import {
  clearBestRecord,
  loadBestRecord,
  saveBestRecord,
} from './utils/typingMetrics';

export default function App() {
  // Unified Person Archive Pool (persisted in localStorage)
  const [people, setPeople] = useState<Person[]>(() => loadPeoplePool());

  // Navigation & Game State
  const [status, setStatus] = useState<GameStatus>('idle');
  const [section, setSection] = useState<AppSection>('practice');

  // Typing Practice Configuration
  const [selectedEra, setSelectedEra] = useState<EraFilter>('전체');
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>('전체');
  const [selectedSource, setSelectedSource] = useState<SourceFilter>('all');
  const [questionCount, setQuestionCount] = useState<QuestionCountOption>(10);

  // Active Typing Session
  const [questions, setQuestions] = useState<Person[]>([]);
  const [sessionLabel, setSessionLabel] = useState('전체 모드');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [totalElapsedMs, setTotalElapsedMs] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);

  // Typing Best Record
  const [bestRecord, setBestRecord] = useState<BestRecord | null>(() =>
    loadBestRecord()
  );
  const [isNewBestCpm, setIsNewBestCpm] = useState(false);

  // Archive Modals & Cross-Component State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [selectedDetailPerson, setSelectedDetailPerson] =
    useState<Person | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [externalTagFilter, setExternalTagFilter] = useState<string | null>(
    null
  );

  // Toast Notification
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((type: ToastMessage['type'], text: string) => {
    setToast({
      id: `${Date.now()}-${Math.random()}`,
      type,
      text,
    });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Persist people pool whenever it changes
  const updatePeoplePool = useCallback((nextPeople: Person[]) => {
    setPeople(nextPeople);
    savePeoplePool(nextPeople);
  }, []);

  // Typing Game Launchers
  const startConfiguredSession = useCallback(() => {
    const nextQuestions = buildQuestionSet(
      people,
      selectedEra,
      selectedCategory,
      selectedSource,
      questionCount
    );

    if (nextQuestions.length === 0) {
      showToast(
        'info',
        '선택한 조건에 출제할 인물이 없습니다. 필터를 변경하거나 새 인물을 추가해 주세요.'
      );
      return;
    }

    const labelParts: string[] = [selectedEra];
    if (selectedCategory !== '전체') labelParts.push(selectedCategory);
    if (selectedSource === 'custom') labelParts.push('사용자 추가');
    if (selectedSource === 'preset') labelParts.push('기본 위인');

    setQuestions(nextQuestions);
    setSessionLabel(labelParts.join(' · '));
    setCurrentIndex(0);
    setResults([]);
    setTotalElapsedMs(0);
    setIsNewBestCpm(false);
    setSessionStartTime(Date.now());
    setSection('practice');
    setStatus('playing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [
    people,
    questionCount,
    selectedCategory,
    selectedEra,
    selectedSource,
    showToast,
  ]);

  const startCustomListSession = useCallback(
    (list: Person[], label: string) => {
      if (list.length === 0) {
        showToast('info', '연습할 인물이 없습니다.');
        return;
      }
      const nextQuestions = list.length === 1 ? list : shufflePeople(list);
      setSelectedDetailPerson(null);
      setQuestions(nextQuestions);
      setSessionLabel(label);
      setCurrentIndex(0);
      setResults([]);
      setTotalElapsedMs(0);
      setIsNewBestCpm(false);
      setSessionStartTime(Date.now());
      setSection('practice');
      setStatus('playing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [showToast]
  );

  const handleRetrySession = useCallback(() => {
    if (questions.length > 0) {
      // Refresh person records from current pool in case user edited one on result screen
      const latestMap = new Map(people.map((p) => [p.id, p]));
      const refreshed = questions
        .map((q) => latestMap.get(q.id) ?? q)
        .filter((p) => p.summary.trim().length > 0);
      startCustomListSession(refreshed, sessionLabel);
    } else {
      startConfiguredSession();
    }
  }, [
    people,
    questions,
    sessionLabel,
    startConfiguredSession,
    startCustomListSession,
  ]);

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
          nextResults.reduce((acc, r) => acc + r.accuracy, 0) /
            nextResults.length
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
    showToast('info', '타자 최고 기록이 초기화되었습니다.');
  }, [showToast]);

  // CRUD Handlers for Person Pool
  const handleOpenAddModal = useCallback(() => {
    setEditingPerson(null);
    setIsFormModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((person: Person) => {
    setSelectedDetailPerson(null);
    setEditingPerson(person);
    setIsFormModalOpen(true);
  }, []);

  const handleSavePerson = useCallback(
    (input: PersonFormInput, editingId?: string) => {
      if (editingId) {
        const nextPeople = people.map((p) =>
          p.id === editingId ? { ...p, ...input } : p
        );
        updatePeoplePool(nextPeople);
        setIsFormModalOpen(false);
        setEditingPerson(null);
        showToast('success', `'${input.name}' 인물 정보가 수정되었습니다.`);
      } else {
        const created: Person = {
          id: generatePersonId(),
          ...input,
          isPreset: false,
          createdAt: new Date().toISOString(),
        };
        updatePeoplePool([created, ...people]);
        setIsFormModalOpen(false);
        showToast('success', `'${created.name}' 인물이 인력풀에 추가되었습니다.`);
      }
    },
    [people, showToast, updatePeoplePool]
  );

  const handleDeletePerson = useCallback(
    (person: Person) => {
      const nextPeople = people.filter((p) => p.id !== person.id);
      updatePeoplePool(nextPeople);
      setSelectedDetailPerson(null);
      showToast('info', `'${person.name}' 인물이 삭제되었습니다.`);
    },
    [people, showToast, updatePeoplePool]
  );

  // JSON Export / Import Handlers
  const handleExportJson = useCallback(() => {
    if (people.length === 0) {
      showToast('info', '내보낼 인물 데이터가 없습니다.');
      return;
    }
    exportPeopleToJson(people);
    showToast(
      'success',
      `총 ${people.length}명의 인력풀 데이터를 JSON 파일로 내보냈습니다.`
    );
  }, [people, showToast]);

  const handleConfirmImport = useCallback(
    (imported: Person[], strategy: ImportMergeStrategy) => {
      if (strategy === 'replace-all') {
        updatePeoplePool(imported);
        setIsImportModalOpen(false);
        showToast(
          'success',
          `인력풀을 가져온 ${imported.length}명으로 교체했습니다.`
        );
        return;
      }

      const merged = [...people];
      const addedList: Person[] = [];
      const seenNewNames = new Set<string>();
      let updatedCount = 0;
      let skippedCount = 0;

      for (const candidate of imported) {
        const key = candidate.name.trim().toLowerCase();
        const existingIdx = merged.findIndex(
          (p) => p.name.trim().toLowerCase() === key
        );

        if (existingIdx !== -1) {
          if (strategy === 'merge-overwrite') {
            merged[existingIdx] = {
              ...candidate,
              id: merged[existingIdx].id,
            };
            updatedCount += 1;
          } else {
            skippedCount += 1;
          }
        } else if (seenNewNames.has(key)) {
          skippedCount += 1;
        } else {
          const hasIdCollision =
            merged.some((m) => m.id === candidate.id) ||
            addedList.some((a) => a.id === candidate.id);
          addedList.push({
            ...candidate,
            id: hasIdCollision ? generatePersonId() : candidate.id,
          });
          seenNewNames.add(key);
        }
      }

      const addedCount = addedList.length;
      updatePeoplePool([...addedList, ...merged]);
      setIsImportModalOpen(false);

      if (strategy === 'merge-overwrite') {
        showToast(
          'success',
          `신규 ${addedCount}명 추가, 중복 ${updatedCount}명 갱신을 완료했습니다.`
        );
      } else {
        showToast(
          'success',
          `신규 ${addedCount}명을 병합했습니다.${skippedCount > 0 ? ` (중복 ${skippedCount}명 제외)` : ''}`
        );
      }
    },
    [people, showToast, updatePeoplePool]
  );

  // Restore Presets Handlers
  const handleRestoreMissingPresets = useCallback(() => {
    const customPeople = people.filter((p) => !p.isPreset);
    const customNameSet = new Set(
      customPeople.map((p) => p.name.trim().toLowerCase())
    );
    const restoredPresets = PRESET_PEOPLE.filter(
      (preset) => !customNameSet.has(preset.name.trim().toLowerCase())
    );
    updatePeoplePool([...customPeople, ...restoredPresets]);
    setIsRestoreModalOpen(false);
    showToast(
      'success',
      `기본 위인 데이터를 복원했습니다. (사용자 추가 ${customPeople.length}명 유지)`
    );
  }, [people, showToast, updatePeoplePool]);

  const handleResetAllToPresets = useCallback(() => {
    updatePeoplePool([...PRESET_PEOPLE]);
    setIsRestoreModalOpen(false);
    showToast(
      'info',
      `기본 위인 ${PRESET_PEOPLE.length}명으로 인력풀을 초기화했습니다.`
    );
  }, [showToast, updatePeoplePool]);

  const customCount = people.filter((p) => !p.isPreset).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F9] text-[#14181D]">
      <Header
        status={status}
        section={section}
        onNavigateSection={handleNavigateSection}
        onQuickStart={startConfiguredSession}
        onOpenAddPerson={handleOpenAddModal}
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
            sessionLabel={sessionLabel}
            bestRecord={bestRecord}
            isNewBestCpm={isNewBestCpm}
            onRetry={handleRetrySession}
            onBackToMenu={handleAbortGame}
            onInspectPerson={(person) => setSelectedDetailPerson(person)}
          />
        ) : section === 'archive' ? (
          <ArchiveView
            people={people}
            onOpenAddModal={handleOpenAddModal}
            onSelectPerson={(person) => setSelectedDetailPerson(person)}
            onExportJson={handleExportJson}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onOpenRestoreModal={() => setIsRestoreModalOpen(true)}
            onPracticeList={startCustomListSession}
            externalTagFilter={externalTagFilter}
            onClearExternalTag={() => setExternalTagFilter(null)}
          />
        ) : (
          <StartScreen
            people={people}
            selectedEra={selectedEra}
            selectedCategory={selectedCategory}
            selectedSource={selectedSource}
            questionCount={questionCount}
            bestRecord={bestRecord}
            onSelectEra={setSelectedEra}
            onSelectCategory={setSelectedCategory}
            onSelectSource={setSelectedSource}
            onSelectQuestionCount={setQuestionCount}
            onStartGame={startConfiguredSession}
            onClearRecord={handleClearRecord}
            onOpenArchive={() => handleNavigateSection('archive')}
            onOpenAddPerson={handleOpenAddModal}
          />
        )}
      </div>

      {/* Modals */}
      <PersonFormModal
        isOpen={isFormModalOpen}
        editingPerson={editingPerson}
        existingPeople={people}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingPerson(null);
        }}
        onSave={handleSavePerson}
      />

      <PersonDetailModal
        person={selectedDetailPerson}
        onClose={() => setSelectedDetailPerson(null)}
        onEdit={handleOpenEditModal}
        onDelete={handleDeletePerson}
        onPracticeSingle={(person) =>
          startCustomListSession([person], `${person.name} 집중 연습`)
        }
        onSelectTag={(tag) => {
          setExternalTagFilter(tag);
          setStatus('idle');
          setSection('archive');
        }}
      />

      <JsonImportModal
        isOpen={isImportModalOpen}
        existingPeople={people}
        onClose={() => setIsImportModalOpen(false)}
        onConfirmImport={handleConfirmImport}
      />

      <RestoreConfirmModal
        isOpen={isRestoreModalOpen}
        customCount={customCount}
        onClose={() => setIsRestoreModalOpen(false)}
        onRestoreMissingOnly={handleRestoreMissingPresets}
        onResetAllToPresets={handleResetAllToPresets}
      />

      {/* Non-intrusive Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#14181D] text-white px-4 py-3 rounded-lg shadow-lg border border-white/10 flex items-center gap-3 text-sm"
        >
          {toast.type === 'success' ? (
            <CheckCircle2
              className="w-4 h-4 text-[#34D399] shrink-0"
              aria-hidden="true"
            />
          ) : toast.type === 'error' ? (
            <AlertCircle
              className="w-4 h-4 text-[#F87171] shrink-0"
              aria-hidden="true"
            />
          ) : (
            <Info className="w-4 h-4 text-[#93C5FD] shrink-0" aria-hidden="true" />
          )}
          <span className="leading-snug">{toast.text}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="알림 닫기"
            className="text-white/60 hover:text-white ml-1 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <footer className="border-t border-[#E1E5EA] mt-auto">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#788492]">
          <p>한국 위인 타자 연습 · 인물 아카이브 ({people.length}인 저장됨)</p>
          <p>
            별도 로그인 없이 오프라인으로 작동하며 인력풀과 타자 기록은 이 브라우저에 저장됩니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
