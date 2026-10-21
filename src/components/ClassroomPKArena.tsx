import React, { useState, useEffect, useRef } from 'react';
import { VocabItem } from '../types/vocab';
import { VocabIllustration } from './VocabIllustration';
import { speakWord, sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, Swords, Bot, Users, RotateCcw, Volume2, Flame, Award } from 'lucide-react';

interface ClassroomPKArenaProps {
  vocabulary: VocabItem[];
}

interface Question {
  target: VocabItem;
  options: VocabItem[];
  promptText: string;
}

export const ClassroomPKArena: React.FC<ClassroomPKArenaProps> = ({ vocabulary }) => {
  const [pkMode, setPkMode] = useState<'pvp' | 'ai'>('pvp');
  const [roundsTotal, setRoundsTotal] = useState<number>(5);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [scoreP1, setScoreP1] = useState<number>(0); // Red
  const [scoreP2, setScoreP2] = useState<number>(0); // Blue / AI
  const [streakP1, setStreakP1] = useState<number>(0);
  const [streakP2, setStreakP2] = useState<number>(0);

  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'round_result' | 'match_end'>('lobby');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [roundWinner, setRoundWinner] = useState<'p1' | 'p2' | 'timeout' | null>(null);
  const [lockedP1, setLockedP1] = useState<boolean>(false);
  const [lockedP2, setLockedP2] = useState<boolean>(false);

  const aiTimerRef = useRef<number | null>(null);

  // Generate a random question with 1 target and 3 distractors
  const generateQuestion = (): Question => {
    const target = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    const distractors = vocabulary.filter((v) => v.id !== target.id);
    const shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [target, ...shuffledDistractors].sort(() => Math.random() - 0.5);

    const prompts = [
      `Find: ${target.displayTitle}`,
      `Who or what is: ${target.word}?`,
      `Tap the picture for: ${target.chinese}`,
    ];
    const promptText = prompts[Math.floor(Math.random() * prompts.length)];

    return { target, options, promptText };
  };

  const startMatch = () => {
    sound.playPop();
    setScoreP1(0);
    setScoreP2(0);
    setStreakP1(0);
    setStreakP2(0);
    setCurrentRound(1);
    loadRound();
  };

  const loadRound = () => {
    const q = generateQuestion();
    setCurrentQuestion(q);
    setRoundWinner(null);
    setLockedP1(false);
    setLockedP2(false);
    setGameState('playing');

    // Announce target via TTS
    setTimeout(() => {
      speakWord(`Tap: ${q.target.displayTitle}`);
    }, 200);

    // If AI mode, schedule AI answer
    if (pkMode === 'ai') {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
      // AI reacts between 2.2s to 4s with 75% accuracy
      const delay = 2200 + Math.random() * 1800;
      aiTimerRef.current = window.setTimeout(() => {
        handleAiAnswer(q);
      }, delay);
    }
  };

  const handleAiAnswer = (q: Question) => {
    if (gameState !== 'playing' || roundWinner !== null) return;
    const isCorrect = Math.random() < 0.75;
    if (isCorrect) {
      handlePlayerWin('p2', q.target);
    } else {
      setLockedP2(true);
    }
  };

  const handlePlayerAnswer = (player: 'p1' | 'p2', item: VocabItem) => {
    if (gameState !== 'playing' || roundWinner !== null) return;
    if (player === 'p1' && lockedP1) return;
    if (player === 'p2' && lockedP2) return;

    if (!currentQuestion) return;

    if (item.id === currentQuestion.target.id) {
      handlePlayerWin(player, item);
    } else {
      sound.playWrong();
      if (player === 'p1') {
        setLockedP1(true);
        setStreakP1(0);
      } else {
        setLockedP2(true);
        setStreakP2(0);
      }
    }
  };

  const handlePlayerWin = (player: 'p1' | 'p2', target: VocabItem) => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    sound.playCorrect();
    setRoundWinner(player);
    setGameState('round_result');

    if (player === 'p1') {
      const bonus = streakP1 >= 2 ? 15 : 10;
      setScoreP1((s) => s + bonus);
      setStreakP1((st) => st + 1);
      setStreakP2(0);
    } else {
      const bonus = streakP2 >= 2 ? 15 : 10;
      setScoreP2((s) => s + bonus);
      setStreakP2((st) => st + 1);
      setStreakP1(0);
    }

    setTimeout(() => {
      speakWord(`${player === 'p1' ? 'Red Team' : pkMode === 'ai' ? 'Bunny Bot' : 'Blue Team'} got it! ${target.word}`);
    }, 300);
  };

  const handleNextRound = () => {
    sound.playPop();
    if (currentRound >= roundsTotal) {
      // Match End
      sound.playFanfare();
      setGameState('match_end');
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {
        // confetti fallback
      }
    } else {
      setCurrentRound((r) => r + 1);
      loadRound();
    }
  };

  useEffect(() => {
    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Lobby State */}
      {gameState === 'lobby' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Swords className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 font-['Fredoka']">
              Classroom Vocabulary PK Arena
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              双人课堂对战比拼与人机挑战赛：听发音、看图片、比比谁拼读记忆反应更快！
            </p>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                sound.playPop();
                setPkMode('pvp');
              }}
              className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                pkMode === 'pvp'
                  ? 'border-amber-500 bg-amber-50/60 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Users className="w-6 h-6 text-amber-600 mb-2" />
              <div className="font-extrabold text-slate-900 font-['Fredoka']">2 Players (双人同屏)</div>
              <div className="text-xs text-slate-500 mt-1">
                Red Team 🔴 vs Blue Team 🔵 at the same desk or smartboard
              </div>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setPkMode('ai');
              }}
              className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                pkMode === 'ai'
                  ? 'border-amber-500 bg-amber-50/60 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Bot className="w-6 h-6 text-sky-600 mb-2" />
              <div className="font-extrabold text-slate-900 font-['Fredoka']">Solo vs Bunny Bot 🤖</div>
              <div className="text-xs text-slate-500 mt-1">
                Challenge our playful smart AI mascot rabbit in speed reaction
              </div>
            </button>
          </div>

          {/* Rounds selector */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs font-bold text-slate-500">Rounds 每局轮数:</span>
            {[3, 5, 10].map((num) => (
              <button
                key={num}
                onClick={() => {
                  sound.playPop();
                  setRoundsTotal(num);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  roundsTotal === num
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {num} Rounds
              </button>
            ))}
          </div>

          {/* Start button */}
          <button
            onClick={startMatch}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-lg rounded-2xl shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer font-['Fredoka']"
          >
            START MATCH 开启对战！
          </button>
        </div>
      )}

      {/* In-Game or Round Result State */}
      {(gameState === 'playing' || gameState === 'round_result') && currentQuestion && (
        <div className="space-y-6">
          {/* Top PK Scoreboard */}
          <div className="grid grid-cols-3 items-center bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
            {/* Player 1 (Red) */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-extrabold text-xl font-['Fredoka'] shadow-md">
                🔴
              </div>
              <div>
                <div className="text-xs font-bold text-rose-600">RED TEAM</div>
                <div className="text-2xl font-extrabold text-slate-900 font-['Fredoka'] tabular-nums">
                  {scoreP1} pts
                </div>
                {streakP1 > 1 && (
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                    <Flame className="w-3 h-3 text-orange-500 fill-orange-500" /> {streakP1}x Streak!
                  </span>
                )}
              </div>
            </div>

            {/* Round info */}
            <div className="text-center">
              <span className="text-xs font-bold text-slate-400 tracking-wider">
                ROUND {currentRound} / {roundsTotal}
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <button
                  onClick={() => {
                    sound.playPop();
                    speakWord(`Find: ${currentQuestion.target.displayTitle}`);
                  }}
                  className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl cursor-pointer transition-colors shadow-sm"
                  title="Replay pronunciation prompt"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Player 2 (Blue or AI) */}
            <div className="flex items-center justify-end gap-3 text-right">
              <div>
                <div className="text-xs font-bold text-sky-600">
                  {pkMode === 'ai' ? 'BUNNY BOT 🤖' : 'BLUE TEAM 🔵'}
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-['Fredoka'] tabular-nums">
                  {scoreP2} pts
                </div>
                {streakP2 > 1 && (
                  <span className="text-xs font-bold text-amber-600 flex items-center justify-end gap-0.5">
                    <Flame className="w-3 h-3 text-orange-500 fill-orange-500" /> {streakP2}x Streak!
                  </span>
                )}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-extrabold text-xl font-['Fredoka'] shadow-md">
                {pkMode === 'ai' ? '🤖' : '🔵'}
              </div>
            </div>
          </div>

          {/* Central Question Banner */}
          <div className="bg-amber-500 text-white rounded-3xl p-5 text-center shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Listen & Tap the matching picture 听词抢答
            </span>
            <h3 className="text-3xl font-extrabold font-['Fredoka'] mt-1 tracking-wide">
              {currentQuestion.target.displayTitle}
            </h3>
            <p className="text-sm font-medium text-amber-100 mt-0.5">
              Meaning: {currentQuestion.target.chinese}
            </p>
          </div>

          {/* PK Interactive Board Split into 2 Zones (P1 Red on left / P2 Blue on right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player 1 Side (Red) */}
            <div className="bg-rose-50/40 border-2 border-rose-200 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700">🔴 Red Team Controls</span>
                {lockedP1 && (
                  <span className="text-xs font-bold text-rose-600 animate-pulse bg-rose-100 px-2 py-0.5 rounded">
                    Wrong guess! 1s lock
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={`p1_${opt.id}`}
                    disabled={lockedP1 || gameState === 'round_result'}
                    onClick={() => handlePlayerAnswer('p1', opt)}
                    className={`p-3 bg-white border-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group ${
                      lockedP1
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:border-rose-400 hover:shadow-md active:scale-95 border-slate-200'
                    }`}
                  >
                    <VocabIllustration id={opt.id} className="w-28 h-28" />
                    <span className="mt-2 text-xs font-bold text-slate-800 text-center">
                      {opt.displayTitle}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Player 2 Side (Blue / AI) */}
            <div className="bg-sky-50/40 border-2 border-sky-200 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-700">
                  {pkMode === 'ai' ? '🤖 Bunny Bot Arena' : '🔵 Blue Team Controls'}
                </span>
                {lockedP2 && (
                  <span className="text-xs font-bold text-sky-600 animate-pulse bg-sky-100 px-2 py-0.5 rounded">
                    Wrong guess! 1s lock
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={`p2_${opt.id}`}
                    disabled={pkMode === 'ai' || lockedP2 || gameState === 'round_result'}
                    onClick={() => handlePlayerAnswer('p2', opt)}
                    className={`p-3 bg-white border-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      pkMode === 'ai'
                        ? 'cursor-default border-slate-200'
                        : lockedP2
                        ? 'opacity-50 cursor-not-allowed border-slate-200'
                        : 'hover:border-sky-400 hover:shadow-md active:scale-95 cursor-pointer border-slate-200'
                    }`}
                  >
                    <VocabIllustration id={opt.id} className="w-28 h-28" />
                    <span className="mt-2 text-xs font-bold text-slate-800 text-center">
                      {opt.displayTitle}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Round Result Banner */}
          {gameState === 'round_result' && (
            <div className="p-6 bg-white border-2 border-amber-300 rounded-3xl shadow-lg text-center space-y-4 animate-fadeIn">
              <div className="text-2xl font-extrabold text-slate-900 font-['Fredoka']">
                {roundWinner === 'p1' ? (
                  <span className="text-rose-600">🔴 Red Team was faster! (+10 pts)</span>
                ) : (
                  <span className="text-sky-600">
                    {pkMode === 'ai' ? '🤖 Bunny Bot' : '🔵 Blue Team'} was faster! (+10 pts)
                  </span>
                )}
              </div>

              <button
                onClick={handleNextRound}
                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold rounded-2xl shadow-md transition-all cursor-pointer font-['Fredoka']"
              >
                {currentRound >= roundsTotal ? 'View Final Results 查看战报' : 'Next Round 下一轮 ➔'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Match End Victory Podium */}
      {gameState === 'match_end' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center max-w-xl mx-auto space-y-6 animate-fadeIn">
          <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-3xl font-extrabold text-slate-900 font-['Fredoka']">
              Match Complete! 精彩对决！
            </h3>
            <p className="text-base text-slate-600 mt-2 font-medium">
              {scoreP1 > scoreP2
                ? '🏆 Red Team Wins! 恭喜红队获胜！'
                : scoreP2 > scoreP1
                ? `🏆 ${pkMode === 'ai' ? 'Bunny Bot' : 'Blue Team'} Wins! 恭喜蓝队获胜！`
                : '🤝 It is a Tie! 双方势均力敌！'}
            </p>
          </div>

          {/* Final scores */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl">
            <div className="text-center border-r border-slate-200">
              <span className="text-xs font-bold text-rose-600">RED TEAM 🔴</span>
              <div className="text-4xl font-extrabold text-slate-900 font-['Fredoka'] mt-1">
                {scoreP1}
              </div>
            </div>
            <div className="text-center">
              <span className="text-xs font-bold text-sky-600">
                {pkMode === 'ai' ? 'BUNNY BOT 🤖' : 'BLUE TEAM 🔵'}
              </span>
              <div className="text-4xl font-extrabold text-slate-900 font-['Fredoka'] mt-1">
                {scoreP2}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={startMatch}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl shadow-md transition-all cursor-pointer font-['Fredoka']"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again 再来一局</span>
            </button>

            <button
              onClick={() => setGameState('lobby')}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all cursor-pointer"
            >
              Change Mode 切换模式
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
