import React, { useState, useEffect } from 'react';
import { VocabItem } from '../types/vocab';
import { VocabIllustration } from './VocabIllustration';
import { speakWord, speakLetter, sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, HelpCircle, RotateCcw, ArrowRight, Volume2, Award, Check } from 'lucide-react';

interface PuzzleGameProps {
  vocabulary: VocabItem[];
  initialWordId?: string;
  onFinishRound?: () => void;
}

interface LetterTile {
  id: string;
  letter: string;
  used: boolean;
}

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ vocabulary, initialWordId }) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialWordId) {
      const idx = vocabulary.findIndex((v) => v.id === initialWordId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const currentItem = vocabulary[currentIndex];
  const targetLetters = currentItem.word.split('');

  // Scrambled tiles state
  const [tiles, setTiles] = useState<LetterTile[]>([]);
  const [placedIndices, setPlacedIndices] = useState<string[]>([]); // tile ids in order of slots
  const [isCompleted, setIsCompleted] = useState(false);
  const [hintUsedCount, setHintUsedCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalStars, setTotalStars] = useState(0);

  // Initialize or reset current puzzle level
  const initLevel = (index: number) => {
    const item = vocabulary[index];
    const letters = item.word.split('');
    // Scramble letters
    const rawTiles: LetterTile[] = letters.map((char, i) => ({
      id: `${char}_${i}_${Math.random()}`,
      letter: char,
      used: false,
    }));

    // Simple shuffle ensuring it doesn't match the original order if > 2 letters
    const shuffled = [...rawTiles].sort(() => Math.random() - 0.5);
    setTiles(shuffled);
    setPlacedIndices([]);
    setIsCompleted(false);
    setHintUsedCount(0);
  };

  useEffect(() => {
    initLevel(currentIndex);
    // Play word audio at start of level
    speakWord(vocabulary[currentIndex].word + ' ' + vocabulary[currentIndex].context);
  }, [currentIndex]);

  // Click on a tile from pool to place into next empty slot
  const handleSelectTile = (tile: LetterTile) => {
    if (tile.used || isCompleted) return;

    sound.playPop();
    speakLetter(tile.letter);

    const nextPlaced = [...placedIndices, tile.id];
    setPlacedIndices(nextPlaced);

    setTiles((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, used: true } : t))
    );

    // Check if fully placed
    if (nextPlaced.length === targetLetters.length) {
      const spelledWord = nextPlaced
        .map((id) => tiles.find((t) => t.id === id)?.letter)
        .join('');

      if (spelledWord.toLowerCase() === currentItem.word.toLowerCase()) {
        // Correct!
        sound.playCorrect();
        setIsCompleted(true);
        setStreak((s) => s + 1);
        const earnedStars = Math.max(1, 3 - hintUsedCount);
        setTotalStars((t) => t + earnedStars);

        // Confetti celebration
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {
          // confetti fallback
        }

        setTimeout(() => {
          speakWord(`Awesome! ${currentItem.word}! ${currentItem.exampleSentence}`);
        }, 500);
      } else {
        // Wrong spelling
        sound.playWrong();
      }
    }
  };

  // Click on placed slot to return tile to pool
  const handleRemovePlaced = (slotIndex: number) => {
    if (isCompleted) return;
    const tileId = placedIndices[slotIndex];
    if (!tileId) return;

    sound.playPop();
    setPlacedIndices((prev) => prev.filter((_, idx) => idx !== slotIndex));
    setTiles((prev) =>
      prev.map((t) => (t.id === tileId ? { ...t, used: false } : t))
    );
  };

  // Provide a hint
  const handleHint = () => {
    if (isCompleted) return;
    sound.playPop();
    setHintUsedCount((c) => c + 1);
    // Speak slow pronunciation
    speakWord(currentItem.word, 0.65);
  };

  // Clear & reset slots
  const handleReset = () => {
    sound.playPop();
    initLevel(currentIndex);
  };

  // Next level
  const handleNextLevel = () => {
    sound.playPop();
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex((c) => c + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Level Bar */}
      <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-base font-['Fredoka']">
            {currentIndex + 1}
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold tracking-wider block">
              SPELLING PUZZLE 拼词闯关
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-800">
                Word {currentIndex + 1} of {vocabulary.length}
              </span>
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-semibold">
                Streak: {streak} 🔥
              </span>
            </div>
          </div>
        </div>

        {/* Stars count */}
        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200">
          <Award className="w-5 h-5 text-amber-500" />
          <span className="text-base font-extrabold text-amber-900 font-['Fredoka']">
            {totalStars} Stars
          </span>
        </div>
      </div>

      {/* Main Puzzle Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-8 relative overflow-hidden">
        {/* Illustration & Prompt */}
        <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
          <div
            onClick={() => {
              sound.playPop();
              speakWord(currentItem.word + ' ' + currentItem.context);
            }}
            className="cursor-pointer group relative"
            title="Click to hear word clue"
          >
            <VocabIllustration id={currentItem.id} className="w-52 h-52 md:w-60 md:h-60" interactive />
            <div className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm text-slate-600 group-hover:text-amber-600 transition-colors">
              <Volume2 className="w-4 h-4" />
            </div>
          </div>

          <div className="text-center md:text-left space-y-2 max-w-sm">
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
              Target Clue 提示
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 font-['Fredoka']">
              Context: {currentItem.context}
            </h3>
            <p className="text-base text-slate-600 font-medium">{currentItem.chinese}</p>
            <p className="text-xs text-slate-400 italic">"{currentItem.exampleSentence}"</p>
          </div>
        </div>

        {/* Target Spelling Slots */}
        <div className="space-y-3">
          <div className="text-center">
            <span className="text-xs font-bold text-slate-400 tracking-wider">
              TAP LETTERS TO ASSEMBLE THE WORD 点击字母拼出单词
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {targetLetters.map((targetChar, slotIdx) => {
              const tileId = placedIndices[slotIdx];
              const placedTile = tiles.find((t) => t.id === tileId);

              return (
                <button
                  key={slotIdx}
                  onClick={() => handleRemovePlaced(slotIdx)}
                  className={`w-14 h-16 md:w-16 md:h-20 rounded-2xl flex flex-col items-center justify-center text-2xl md:text-3xl font-extrabold font-['Fredoka'] border-3 transition-all cursor-pointer ${
                    placedTile
                      ? isCompleted
                        ? 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-md'
                        : 'bg-amber-400 border-amber-500 text-slate-900 shadow-sm hover:scale-105'
                      : 'bg-slate-50 border-dashed border-slate-300 text-transparent'
                  }`}
                  title={placedTile ? 'Click to remove letter' : 'Empty slot'}
                >
                  {placedTile ? placedTile.letter.toUpperCase() : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrambled Letter Tiles Pool */}
        {!isCompleted ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs font-semibold text-slate-500">Letter Tiles:</span>
              <button
                onClick={handleHint}
                className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-xl transition-all cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Hear Voice Hint</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-xl transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {tiles.map((tile) => (
                <button
                  key={tile.id}
                  disabled={tile.used}
                  onClick={() => handleSelectTile(tile)}
                  className={`w-13 h-14 md:w-15 md:h-16 rounded-2xl text-2xl font-extrabold font-['Fredoka'] shadow-sm transition-all cursor-pointer border-2 ${
                    tile.used
                      ? 'opacity-20 bg-slate-200 border-slate-300 cursor-not-allowed scale-90'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-amber-500 hover:bg-amber-50 active:scale-95 hover:shadow-md'
                  }`}
                >
                  {tile.letter.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Victory Completion Banner */
          <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-emerald-900 font-['Fredoka']">
                Super Job! 太棒了！
              </h4>
              <p className="text-base text-emerald-800 font-semibold mt-1">
                You spelled: <span className="font-extrabold underline">{currentItem.word}</span> (
                {currentItem.chinese})
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playPop();
                  speakWord(currentItem.exampleSentence);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-100/50 transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen Sentence</span>
              </button>

              <button
                onClick={handleNextLevel}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-extrabold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer font-['Fredoka']"
              >
                <span>Next Word 下一关</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
