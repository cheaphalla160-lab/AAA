import React, { useState } from 'react';
import { VocabItem } from '../types/vocab';
import { VocabIllustration } from './VocabIllustration';
import { speakWord, speakPhonics, speakLetter, sound } from '../utils/audio';
import { Volume2, VolumeX, Sparkles, ArrowLeftRight, CheckCircle2, BookOpen } from 'lucide-react';

interface PhonicsExplorerProps {
  vocabulary: VocabItem[];
  selectedId: string;
  onSelectWord: (id: string) => void;
  onLaunchPuzzle: (item: VocabItem) => void;
}

export const PhonicsExplorer: React.FC<PhonicsExplorerProps> = ({
  vocabulary,
  selectedId,
  onSelectWord,
  onLaunchPuzzle,
}) => {
  const currentItem = vocabulary.find((v) => v.id === selectedId) || vocabulary[0];
  const oppositeItem = currentItem.oppositeId
    ? vocabulary.find((v) => v.id === currentItem.oppositeId)
    : null;

  const [slowAudio, setSlowAudio] = useState(false);
  const [showOppositeCompare, setShowOppositeCompare] = useState(false);
  const [clickedLetter, setClickedLetter] = useState<number | null>(null);

  const handlePlayWord = () => {
    sound.playPop();
    speakWord(currentItem.word + ' ' + currentItem.context, slowAudio ? 0.65 : 0.85);
  };

  const handlePlayPhonics = (chunk: string) => {
    sound.playPop();
    speakPhonics(chunk);
  };

  const handlePlayLetter = (letter: string, idx: number) => {
    setClickedLetter(idx);
    sound.playPop();
    speakLetter(letter);
    setTimeout(() => setClickedLetter(null), 400);
  };

  const handlePlaySentence = () => {
    sound.playPop();
    speakWord(currentItem.exampleSentence, slowAudio ? 0.75 : 0.9);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Category selector / Quick pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span>Select Word:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto max-w-full py-1">
          {vocabulary.map((item) => {
            const isSelected = item.id === currentItem.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playPop();
                  onSelectWord(item.id);
                  setShowOppositeCompare(false);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-sm scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.displayTitle}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Learning Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive Visual Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          {/* Top Word Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-extrabold text-slate-900 font-['Fredoka'] tracking-wide">
                  {currentItem.word}
                </h2>
                <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                  ({currentItem.context})
                </span>
                <span className="text-sm text-slate-500 font-mono">{currentItem.ipa}</span>
              </div>
              <p className="text-base text-slate-600 mt-1 font-medium">{currentItem.chinese}</p>
            </div>

            {/* Audio speed & speaker */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSlowAudio(!slowAudio)}
                title="Toggle slow pronunciation for kids"
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border cursor-pointer transition-colors ${
                  slowAudio
                    ? 'bg-amber-100 border-amber-400 text-amber-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {slowAudio ? '🐢 Slow Speed' : '🐰 Normal'}
              </button>
              <button
                onClick={handlePlayWord}
                className="w-12 h-12 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-2xl flex items-center justify-center shadow-md transition-all cursor-pointer"
                title="Listen to full word"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Interactive Illustration Area */}
          <div className="py-6 flex flex-col items-center justify-center my-auto">
            {showOppositeCompare && oppositeItem ? (
              <div className="w-full grid grid-cols-2 gap-4 items-center animate-fadeIn">
                <div
                  onClick={handlePlayWord}
                  className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border-2 border-amber-300 cursor-pointer hover:bg-amber-50/50 transition-all"
                >
                  <VocabIllustration id={currentItem.id} className="w-40 h-40" interactive />
                  <span className="mt-2 text-base font-bold text-slate-800">{currentItem.displayTitle}</span>
                  <span className="text-xs text-slate-500">{currentItem.chinese}</span>
                </div>
                <div
                  onClick={() => {
                    sound.playPop();
                    speakWord(oppositeItem.word + ' ' + oppositeItem.context);
                  }}
                  className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border-2 border-emerald-300 cursor-pointer hover:bg-emerald-50/50 transition-all"
                >
                  <VocabIllustration id={oppositeItem.id} className="w-40 h-40" interactive />
                  <span className="mt-2 text-base font-bold text-slate-800">{oppositeItem.displayTitle}</span>
                  <span className="text-xs text-slate-500">{oppositeItem.chinese}</span>
                </div>
              </div>
            ) : (
              <div
                onClick={handlePlayWord}
                className="group cursor-pointer flex flex-col items-center relative"
                title="Click image to listen!"
              >
                <VocabIllustration id={currentItem.id} className="w-64 h-64 md:w-72 md:h-72" interactive />
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-amber-600 transition-colors">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Click image to hear sound! 点击图片发音</span>
                </div>
              </div>
            )}
          </div>

          {/* Opposite Comparison Quick Trigger */}
          {oppositeItem && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setShowOppositeCompare(!showOppositeCompare)}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>
                  {showOppositeCompare
                    ? 'Hide Comparison 隐藏对比'
                    : `Compare with Opposite: ${oppositeItem.displayTitle} (反义词对比)`}
                </span>
              </button>

              <button
                onClick={() => onLaunchPuzzle(currentItem)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Play Spelling Puzzle 拼词闯关</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Phonics Breakdown & Interactive Spelling */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Phonics & Syllable Cards */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 tracking-wider">PHONICS SOUNDS 自然拼读分段</span>
              <span className="text-xs text-amber-600 font-medium">Click to hear phonemes</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {currentItem.phonics.map((chunk, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePlayPhonics(chunk)}
                  className="px-4 py-3 bg-amber-50 border-2 border-amber-300 hover:border-amber-500 hover:bg-amber-100 text-amber-900 rounded-2xl text-xl font-bold font-['Fredoka'] shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  /{chunk}/
                </button>
              ))}
            </div>

            {/* Letter by letter spelling */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 tracking-wider block mb-2">
                SPELL LETTER BY LETTER 逐字母拼读
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {currentItem.letters.map((letter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePlayLetter(letter, idx)}
                    className={`w-11 h-12 rounded-xl text-lg font-bold font-mono border-2 transition-all cursor-pointer ${
                      clickedLetter === idx
                        ? 'bg-amber-500 border-amber-600 text-white scale-110 shadow-md'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {letter.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Example Sentence & Meaning */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 tracking-wider">EXAMPLE SENTENCE 例句练习</span>
              <button
                onClick={handlePlaySentence}
                className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Play Sentence</span>
              </button>
            </div>

            <div
              onClick={handlePlaySentence}
              className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-2xl cursor-pointer hover:bg-sky-50 transition-colors"
            >
              <p className="text-base font-semibold text-slate-900 font-['Plus_Jakarta_Sans']">
                "{currentItem.exampleSentence}"
              </p>
              <p className="text-xs text-slate-600 mt-1">{currentItem.sentenceChinese}</p>
            </div>

            <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <span className="font-bold">Did you know? 趣味小知识：</span>
                <p className="text-slate-600 mt-0.5">{currentItem.funFact}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
