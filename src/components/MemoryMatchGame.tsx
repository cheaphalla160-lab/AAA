import React, { useState, useEffect } from 'react';
import { VocabItem } from '../types/vocab';
import { VocabIllustration } from './VocabIllustration';
import { speakWord, sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Trophy, Timer, Eye } from 'lucide-react';

interface MemoryCard {
  cardId: string;
  vocabId: string;
  type: 'image' | 'word';
  displayTitle: string;
  chinese: string;
  matchKey: string; // Used to check if two cards match
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchGameProps {
  vocabulary: VocabItem[];
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ vocabulary }) => {
  const [matchMode, setMatchMode] = useState<'word_pic' | 'opposites'>('word_pic');
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<MemoryCard[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchesFound, setMatchesFound] = useState<number>(0);
  const [totalPairs, setTotalPairs] = useState<number>(6);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Initialize Game Cards
  const initGame = (mode = matchMode, pairCount = 6) => {
    sound.playPop();
    setMoves(0);
    setMatchesFound(0);
    setIsVictory(false);
    setSecondsElapsed(0);
    setIsTimerRunning(true);
    setFlippedCards([]);

    const newCards: MemoryCard[] = [];

    if (mode === 'word_pic') {
      // Pick 6 random items
      const selected = [...vocabulary].sort(() => Math.random() - 0.5).slice(0, pairCount);
      selected.forEach((item) => {
        // Card A: Image
        newCards.push({
          cardId: `img_${item.id}_${Math.random()}`,
          vocabId: item.id,
          type: 'image',
          displayTitle: item.displayTitle,
          chinese: item.chinese,
          matchKey: item.id,
          isFlipped: false,
          isMatched: false,
        });
        // Card B: Word text
        newCards.push({
          cardId: `word_${item.id}_${Math.random()}`,
          vocabId: item.id,
          type: 'word',
          displayTitle: item.displayTitle,
          chinese: item.chinese,
          matchKey: item.id,
          isFlipped: false,
          isMatched: false,
        });
      });
      setTotalPairs(selected.length);
    } else {
      // Opposites pairing mode:
      // Pairs: short_pencil <-> long_pencil, thick_book <-> thin_book, fat_people <-> thin_people,
      // straight_hair <-> curly_hair, moustache <-> beard, blonde_hair <-> dark_hair
      const oppositePairs: [string, string][] = [
        ['short_pencil', 'long_pencil'],
        ['thick_book', 'thin_book'],
        ['fat_people', 'thin_people'],
        ['straight_hair', 'curly_hair'],
        ['moustache', 'beard'],
        ['blonde_hair', 'dark_hair'],
      ];

      oppositePairs.forEach(([idA, idB], pairIdx) => {
        const itemA = vocabulary.find((v) => v.id === idA);
        const itemB = vocabulary.find((v) => v.id === idB);
        if (itemA && itemB) {
          const matchKey = `opposite_pair_${pairIdx}`;
          newCards.push({
            cardId: `oppA_${itemA.id}_${Math.random()}`,
            vocabId: itemA.id,
            type: 'image',
            displayTitle: itemA.displayTitle,
            chinese: itemA.chinese,
            matchKey,
            isFlipped: false,
            isMatched: false,
          });
          newCards.push({
            cardId: `oppB_${itemB.id}_${Math.random()}`,
            vocabId: itemB.id,
            type: 'image',
            displayTitle: itemB.displayTitle,
            chinese: itemB.chinese,
            matchKey,
            isFlipped: false,
            isMatched: false,
          });
        }
      });
      setTotalPairs(oppositePairs.length);
    }

    // Shuffle all cards
    setCards(newCards.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    initGame(matchMode);
  }, [matchMode]);

  // Timer
  useEffect(() => {
    let interval: number;
    if (isTimerRunning && !isVictory) {
      interval = window.setInterval(() => {
        setSecondsElapsed((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isVictory]);

  // Handle Card Click
  const handleCardClick = (card: MemoryCard) => {
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    sound.playPop();
    speakWord(card.displayTitle, 0.9);

    const updated = cards.map((c) =>
      c.cardId === card.cardId ? { ...c, isFlipped: true } : c
    );
    setCards(updated);

    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;

      if (first.matchKey === second.matchKey) {
        // MATCH!
        sound.playCorrect();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.cardId === first.cardId || c.cardId === second.cardId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatchesFound((mf) => {
            const nextMatchCount = mf + 1;
            if (nextMatchCount >= totalPairs) {
              // VICTORY!
              sound.playFanfare();
              setIsVictory(true);
              setIsTimerRunning(false);
              try {
                confetti({
                  particleCount: 90,
                  spread: 70,
                  origin: { y: 0.6 },
                });
              } catch {
                // confetti fallback
              }
              speakWord('Splendid memory! You matched all pairs!');
            }
            return nextMatchCount;
          });
          setFlippedCards([]);
        }, 500);
      } else {
        // NO MATCH
        sound.playWrong();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.cardId === first.cardId || c.cardId === second.cardId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1100);
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setMatchMode('word_pic')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              matchMode === 'word_pic'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🖼️ Picture & Word (图文配对)
          </button>
          <button
            onClick={() => setMatchMode('opposites')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              matchMode === 'opposites'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ Opposites Pairs (反义词连线)
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-900 font-bold">
            <Timer className="w-4 h-4 text-amber-500" />
            <span className="tabular-nums font-mono">{secondsElapsed}s</span>
          </div>

          <div className="bg-slate-100 px-3 py-1.5 rounded-xl">
            Moves 步数: <span className="font-bold text-slate-800 tabular-nums">{moves}</span>
          </div>

          <div className="bg-emerald-50 px-3 py-1.5 rounded-xl text-emerald-800 font-bold">
            Matched: {matchesFound} / {totalPairs}
          </div>

          <button
            onClick={() => initGame(matchMode)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <div
              key={card.cardId}
              onClick={() => handleCardClick(card)}
              className={`h-40 md:h-44 rounded-3xl cursor-pointer transition-all duration-300 relative select-none transform preserve-3d ${
                isRevealed ? 'rotate-y-180' : 'hover:scale-[1.03] active:scale-95'
              }`}
              style={{ perspective: '1000px' }}
            >
              {/* Card Face (Hidden / Back) */}
              {!isRevealed ? (
                <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-500 rounded-3xl border-3 border-amber-300 shadow-sm flex flex-col items-center justify-center p-3 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-2">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-extrabold tracking-wider font-['Fredoka']">
                    VOCAB FLIP
                  </span>
                </div>
              ) : (
                /* Card Front (Revealed) */
                <div
                  className={`w-full h-full bg-white rounded-3xl border-3 flex flex-col items-center justify-center p-3 shadow-md transition-all ${
                    card.isMatched
                      ? 'border-emerald-400 bg-emerald-50/40'
                      : 'border-amber-400 bg-amber-50/20'
                  }`}
                >
                  {card.type === 'image' ? (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <VocabIllustration id={card.vocabId} className="w-24 h-24" />
                      <span className="text-xs font-bold text-slate-800 mt-1 truncate max-w-full">
                        {card.displayTitle}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-2">
                      <span className="text-lg md:text-xl font-extrabold text-slate-900 font-['Fredoka']">
                        {card.displayTitle}
                      </span>
                      <span className="text-xs text-slate-500 mt-1 font-medium">{card.chinese}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Victory Modal Overlay */}
      {isVictory && (
        <div className="p-8 bg-white border-2 border-amber-300 rounded-3xl shadow-xl text-center max-w-lg mx-auto space-y-5 animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-3xl font-extrabold text-slate-900 font-['Fredoka']">
              Memory Master! 记忆力大赢家！
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              You matched all {totalPairs} pairs in <span className="font-bold">{moves} moves</span> ({secondsElapsed} seconds)!
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => initGame(matchMode)}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl shadow-md transition-all cursor-pointer font-['Fredoka']"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again 再玩一次</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
