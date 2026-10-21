import React, { useState, useEffect } from 'react';
import { VOCABULARY_LIST } from './data/vocabulary';
import { GameMode, VocabItem } from './types/vocab';
import { HeaderBar } from './components/HeaderBar';
import { PhonicsExplorer } from './components/PhonicsExplorer';
import { PuzzleGame } from './components/PuzzleGame';
import { ClassroomPKArena } from './components/ClassroomPKArena';
import { MemoryMatchGame } from './components/MemoryMatchGame';
import { TeacherToolWheel } from './components/TeacherToolWheel';
import { sound, speakWord } from './utils/audio';
import { Sparkles, Gamepad2, Volume2, Trophy, BookOpen, Star, HelpCircle } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('explore');
  const [selectedWordId, setSelectedWordId] = useState<string>(VOCABULARY_LIST[0].id);
  const [puzzleTargetWord, setPuzzleTargetWord] = useState<string | undefined>(undefined);
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [showHeroBanner, setShowHeroBanner] = useState<boolean>(true);

  // Resume AudioContext on first user interaction
  useEffect(() => {
    const handleFirstClick = () => {
      // Warm up audio synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
      }
      window.removeEventListener('click', handleFirstClick);
    };
    window.addEventListener('click', handleFirstClick, { once: true });
    return () => window.removeEventListener('click', handleFirstClick);
  }, []);

  const handleToggleBgm = () => {
    const nowPlaying = sound.toggleBGM();
    setIsBgmPlaying(nowPlaying);
  };

  const handleSelectMode = (mode: GameMode) => {
    sound.playPop();
    setCurrentMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchPuzzle = (item: VocabItem) => {
    sound.playPop();
    setPuzzleTargetWord(item.id);
    setCurrentMode('puzzle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/60 via-amber-50/30 to-slate-50 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-amber-200">
      {/* 3-Zone Top Navigation Bar */}
      <HeaderBar
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        isBgmPlaying={isBgmPlaying}
        onToggleBgm={handleToggleBgm}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Playful Welcome Hero Banner (Collapsible) */}
        {showHeroBanner && (
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-white shadow-md p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-xl text-xs font-bold text-amber-50">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>小学英语备课与互动游戏乐园 · 15个重点单词闯关</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-['Fredoka'] tracking-wide text-white leading-tight">
                Play, Spell & PK: Master Your Words!
              </h1>
              <p className="text-amber-100 text-sm sm:text-base font-medium leading-relaxed">
                包含反义词对比（short/long, thick/thin, fat/thin, straight/curly）与特征词（ugly, moustache, beard）。点击听发音自然拼读，双人同屏对战超好玩！
              </p>

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={() => handleSelectMode('puzzle')}
                  className="px-4 py-2 bg-white text-amber-700 hover:bg-amber-50 rounded-xl text-xs font-extrabold shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer font-['Fredoka']"
                >
                  🧩 Play Puzzle 拼词闯关
                </button>
                <button
                  onClick={() => handleSelectMode('pk')}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-extrabold shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer font-['Fredoka']"
                >
                  ⚔️ Classroom PK 双人对战
                </button>
                <button
                  onClick={() => handleSelectMode('wheel')}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-extrabold backdrop-blur-sm transition-all cursor-pointer font-['Fredoka']"
                >
                  🎡 Lucky Wheel 抽词转盘
                </button>
              </div>
            </div>

            {/* Generated Hero Illustration with Zero-Broken-Image Fallback */}
            <div className="w-full md:w-80 h-48 md:h-52 rounded-2xl overflow-hidden shadow-inner shrink-0 relative bg-amber-600/30">
              <img
                src="/src/assets/images/vocab_island_hero_1792599217156.jpg"
                alt="Kids Vocab Island Mascot"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback container
                  e.currentTarget.style.display = 'none';
                }}
              />
              <button
                onClick={() => setShowHeroBanner(false)}
                className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer"
                title="Dismiss banner"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* View Switcher Controls (Tabs for Easy Classroom Access) */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Activity 互动模式:
            </span>
            <span className="text-sm font-extrabold text-amber-600 font-['Fredoka']">
              {currentMode === 'explore' && '📖 Phonics Flashcards 拼读闪卡馆'}
              {currentMode === 'puzzle' && '🧩 Letter Spelling Puzzle 拼词大闯关'}
              {currentMode === 'pk' && '⚔️ Classroom 1v1 PK Arena 双人擂台对战'}
              {currentMode === 'memory' && '🃏 Memory Flip Match 记忆翻牌比拼'}
              {currentMode === 'wheel' && '🎡 Teacher Presentation & Wheel 教师备课大转盘'}
            </span>
          </div>

          {!showHeroBanner && (
            <button
              onClick={() => setShowHeroBanner(true)}
              className="text-xs font-semibold text-amber-600 hover:underline cursor-pointer"
            >
              Show Banner 展开横幅
            </button>
          )}
        </div>

        {/* Mode 1: Phonics Cards & Explorer */}
        {currentMode === 'explore' && (
          <PhonicsExplorer
            vocabulary={VOCABULARY_LIST}
            selectedId={selectedWordId}
            onSelectWord={setSelectedWordId}
            onLaunchPuzzle={handleLaunchPuzzle}
          />
        )}

        {/* Mode 2: Spelling Puzzle Game */}
        {currentMode === 'puzzle' && (
          <PuzzleGame
            vocabulary={VOCABULARY_LIST}
            initialWordId={puzzleTargetWord}
          />
        )}

        {/* Mode 3: Classroom PK Arena */}
        {currentMode === 'pk' && (
          <ClassroomPKArena vocabulary={VOCABULARY_LIST} />
        )}

        {/* Mode 4: Memory Flip Match */}
        {currentMode === 'memory' && (
          <MemoryMatchGame vocabulary={VOCABULARY_LIST} />
        )}

        {/* Mode 5: Teacher Presentation & Wheel */}
        {currentMode === 'wheel' && (
          <TeacherToolWheel vocabulary={VOCABULARY_LIST} />
        )}
      </main>

      {/* Classroom Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span>Target Words (15):</span>
          {VOCABULARY_LIST.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedWordId(item.id);
                setCurrentMode('explore');
                speakWord(item.word + ' ' + item.context);
              }}
              className="hover:text-amber-600 hover:underline cursor-pointer"
            >
              {item.displayTitle}
              {idx < VOCABULARY_LIST.length - 1 ? ' · ' : ''}
            </button>
          ))}
        </div>
        <p className="text-slate-400">
          Designed for elementary English teachers · Interactive Phonics, Spelling Puzzles, Dual PK & Memory Match
        </p>
      </footer>
    </div>
  );
}
