import type { AppSection, GameStatus } from '../types/game';

interface HeaderProps {
  status: GameStatus;
  section: AppSection;
  onNavigateSection: (section: AppSection) => void;
  onQuickStart: () => void;
  onAbortGame: () => void;
}

export function Header({
  status,
  section,
  onNavigateSection,
  onQuickStart,
  onAbortGame,
}: HeaderProps) {
  const isPlaying = status === 'playing';

  return (
    <header className="sticky top-0 z-30 bg-[#F7F8F9]/95 backdrop-blur-sm border-b border-[#E1E5EA]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => {
            if (isPlaying) {
              onAbortGame();
            } else {
              onNavigateSection('practice');
            }
          }}
          className="font-editorial text-lg font-bold tracking-tight text-[#14181D] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A8A]"
        >
          한국 위인 타자 연습
        </button>

        {/* Zone 2: Clean single-line text nav links */}
        <nav
          aria-label="주요 메뉴"
          className="flex items-center gap-6 sm:gap-8 text-sm font-medium"
        >
          <button
            type="button"
            onClick={() => {
              if (isPlaying) {
                onAbortGame();
              } else {
                onNavigateSection('practice');
              }
            }}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A8A] ${
              section === 'practice' && !isPlaying
                ? 'border-[#1E3A8A] text-[#14181D]'
                : 'border-transparent text-[#525C68] hover:text-[#14181D]'
            }`}
          >
            타자 연습
          </button>
          <button
            type="button"
            onClick={() => {
              if (isPlaying) {
                onAbortGame();
              }
              onNavigateSection('archive');
            }}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A8A] ${
              section === 'archive' && !isPlaying
                ? 'border-[#1E3A8A] text-[#14181D]'
                : 'border-transparent text-[#525C68] hover:text-[#14181D]'
            }`}
          >
            위인 도감
          </button>
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="shrink-0">
          {isPlaying ? (
            <button
              type="button"
              onClick={onAbortGame}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-[#14181D] bg-white border border-[#D0D6DE] rounded-md hover:bg-[#F0F2F5] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
            >
              연습 종료
            </button>
          ) : (
            <button
              type="button"
              onClick={onQuickStart}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172E6E] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
            >
              {status === 'finished' ? '다시 하기' : '게임 시작'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
