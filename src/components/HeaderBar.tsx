import React from 'react';
import { GameMode } from '../types/vocab';
import { Music, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface HeaderBarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  isBgmPlaying: boolean;
  onToggleBgm: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentMode,
  onSelectMode,
  isBgmPlaying,
  onToggleBgm,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectMode('explore')}
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-['Fredoka'] cursor-pointer"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center text-sm shadow-sm">
            ✨
          </span>
          <span>Kids Vocab Island</span>
        </button>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
          <button
            onClick={() => onSelectMode('explore')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentMode === 'explore'
                ? 'text-amber-600 underline underline-offset-8 decoration-2'
                : 'hover:text-slate-900'
            }`}
          >
            Phonics Cards 拼读闪卡
          </button>

          <button
            onClick={() => onSelectMode('puzzle')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentMode === 'puzzle'
                ? 'text-amber-600 underline underline-offset-8 decoration-2'
                : 'hover:text-slate-900'
            }`}
          >
            Spelling Puzzle 拼词闯关
          </button>

          <button
            onClick={() => onSelectMode('pk')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentMode === 'pk'
                ? 'text-amber-600 underline underline-offset-8 decoration-2'
                : 'hover:text-slate-900'
            }`}
          >
            Classroom PK 双人对战
          </button>

          <button
            onClick={() => onSelectMode('memory')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentMode === 'memory'
                ? 'text-amber-600 underline underline-offset-8 decoration-2'
                : 'hover:text-slate-900'
            }`}
          >
            Memory Flip 记忆翻牌
          </button>

          <button
            onClick={() => onSelectMode('wheel')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentMode === 'wheel'
                ? 'text-amber-600 underline underline-offset-8 decoration-2'
                : 'hover:text-slate-900'
            }`}
          >
            Lucky Wheel 抽词转盘
          </button>
        </nav>

        {/* Zone 3: 1 primary action (BGM Sound toggle) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleBgm}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
              isBgmPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Toggle Relaxing Background Music (轻松愉快背景音乐)"
          >
            <Music className="w-3.5 h-3.5" />
            <span>{isBgmPlaying ? 'BGM: Playing 🎵' : 'BGM: Off 🔇'}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav pills bar */}
      <div className="flex md:hidden items-center justify-around px-3 py-2 border-t border-slate-100 overflow-x-auto gap-2 text-xs font-bold">
        <button
          onClick={() => onSelectMode('explore')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${
            currentMode === 'explore' ? 'bg-amber-500 text-white' : 'text-slate-600'
          }`}
        >
          拼读闪卡
        </button>
        <button
          onClick={() => onSelectMode('puzzle')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${
            currentMode === 'puzzle' ? 'bg-amber-500 text-white' : 'text-slate-600'
          }`}
        >
          拼词大闯关
        </button>
        <button
          onClick={() => onSelectMode('pk')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${
            currentMode === 'pk' ? 'bg-amber-500 text-white' : 'text-slate-600'
          }`}
        >
          双人PK擂台
        </button>
        <button
          onClick={() => onSelectMode('memory')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${
            currentMode === 'memory' ? 'bg-amber-500 text-white' : 'text-slate-600'
          }`}
        >
          记忆翻翻乐
        </button>
        <button
          onClick={() => onSelectMode('wheel')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${
            currentMode === 'wheel' ? 'bg-amber-500 text-white' : 'text-slate-600'
          }`}
        >
          备课大转盘
        </button>
      </div>
    </header>
  );
};
