import React, { useState, useRef } from 'react';
import { VocabItem } from '../types/vocab';
import { VocabIllustration } from './VocabIllustration';
import { speakWord, sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Dices, Volume2, Printer, Check, Monitor, ChevronLeft, ChevronRight } from 'lucide-react';

interface TeacherToolWheelProps {
  vocabulary: VocabItem[];
}

export const TeacherToolWheel: React.FC<TeacherToolWheelProps> = ({ vocabulary }) => {
  const [activeTab, setActiveTab] = useState<'wheel' | 'projector' | 'worksheet'>('wheel');
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [selectedWord, setSelectedWord] = useState<VocabItem | null>(null);

  // Projector mode state
  const [projectorIndex, setProjectorIndex] = useState(0);

  // Colors for wheel slices
  const sliceColors = [
    '#F59E0B', '#38BDF8', '#10B981', '#EC4899', '#8B5CF6',
    '#F97316', '#06B6D4', '#84CC16', '#6366F1', '#14B8A6',
    '#EAB308', '#A855F7', '#EF4444', '#0284C7', '#D97706',
  ];

  const totalSlices = vocabulary.length;
  const sliceAngle = 360 / totalSlices;

  // Spin the wheel
  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedWord(null);

    // Play initial sound
    sound.playPop();

    // Random target index
    const randomIndex = Math.floor(Math.random() * totalSlices);
    // Extra rotations (5 to 8 full spins)
    const extraSpins = 5 + Math.floor(Math.random() * 4);
    // Target angle calculations: Pointer is at top (270 deg or 90 deg depending on orientation)
    // Pointer at top (0 deg): chosen slice center should be at 0 deg
    const targetSliceCenter = randomIndex * sliceAngle + sliceAngle / 2;
    const finalRotation = wheelRotation + extraSpins * 360 + (360 - (targetSliceCenter % 360));

    setWheelRotation(finalRotation);

    // Ticking audio interval simulation
    const tickInterval = setInterval(() => {
      sound.playTick();
    }, 120);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      const chosen = vocabulary[randomIndex];
      setSelectedWord(chosen);
      sound.playCorrect();

      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.5 },
        });
      } catch {
        // confetti fallback
      }

      speakWord(`Selected: ${chosen.displayTitle}!`);
    }, 3800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Teacher Module Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white border border-slate-200 rounded-3xl shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
            👩‍🏫
          </div>
          <span className="text-sm font-extrabold text-slate-800 font-['Fredoka']">
            Teacher Classroom Tools 教师课堂备课与互动
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('wheel')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'wheel' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            🎡 Lucky Wheel (抽词转盘)
          </button>
          <button
            onClick={() => setActiveTab('projector')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'projector' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            🖥️ Projector Presentation (大屏投影闪卡)
          </button>
          <button
            onClick={() => setActiveTab('worksheet')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'worksheet' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            🖨️ Printable Worksheet (随堂讲义与测验)
          </button>
        </div>
      </div>

      {/* 1. Lucky Wheel Tab */}
      {activeTab === 'wheel' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col items-center space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-extrabold text-slate-900 font-['Fredoka']">
              Classroom Random Word Picker 随堂抽问大转盘
            </h3>
            <p className="text-xs text-slate-500">
              点动转盘随机抽取单词，邀请小朋友站起来认读、拼读或造句！
            </p>
          </div>

          {/* Wheel Graphic Container */}
          <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
            {/* Pointer at Top */}
            <div className="absolute -top-3 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-rose-600 drop-shadow-md"></div>

            {/* Rotating SVG Wheel */}
            <div
              className="w-full h-full rounded-full shadow-lg border-4 border-white transition-transform duration-[3800ms] ease-out"
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                transitionTimingFunction: 'cubic-bezier(0.15, 0.9, 0.2, 1)',
              }}
            >
              <svg viewBox="0 0 400 400" className="w-full h-full rounded-full">
                {vocabulary.map((item, idx) => {
                  const startAngle = (idx * sliceAngle * Math.PI) / 180;
                  const endAngle = ((idx + 1) * sliceAngle * Math.PI) / 180;
                  const x1 = 200 + 195 * Math.cos(startAngle);
                  const y1 = 200 + 195 * Math.sin(startAngle);
                  const x2 = 200 + 195 * Math.cos(endAngle);
                  const y2 = 200 + 195 * Math.sin(endAngle);

                  const pathData = `M 200 200 L ${x1} ${y1} A 195 195 0 0 1 ${x2} ${y2} Z`;

                  // Text position & rotation along slice
                  const midAngleDeg = idx * sliceAngle + sliceAngle / 2;
                  const textRad = (midAngleDeg * Math.PI) / 180;
                  const tx = 200 + 125 * Math.cos(textRad);
                  const ty = 200 + 125 * Math.sin(textRad);

                  return (
                    <g key={item.id}>
                      <path
                        d={pathData}
                        fill={sliceColors[idx % sliceColors.length]}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      <text
                        x={tx}
                        y={ty}
                        fill="#FFFFFF"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${midAngleDeg + 90}, ${tx}, ${ty})`}
                      >
                        {item.word}
                      </text>
                    </g>
                  );
                })}
                {/* Center Hub */}
                <circle cx="200" cy="200" r="28" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="4" />
                <circle cx="200" cy="200" r="14" fill="#F59E0B" />
              </svg>
            </div>

            {/* Center Spin Button */}
            <button
              disabled={isSpinning}
              onClick={handleSpin}
              className={`absolute z-10 w-18 h-18 rounded-full flex flex-col items-center justify-center font-extrabold text-xs shadow-lg transition-all cursor-pointer font-['Fredoka'] ${
                isSpinning
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed scale-95'
                  : 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-105 active:scale-95'
              }`}
            >
              <Dices className="w-5 h-5 mb-0.5" />
              <span>SPIN!</span>
            </button>
          </div>

          {/* Result Highlight Card */}
          {selectedWord && (
            <div className="w-full max-w-md p-5 bg-amber-50 border-2 border-amber-300 rounded-3xl text-center space-y-3 animate-fadeIn shadow-sm">
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                🎉 Selected Word 抽中单词
              </span>
              <div className="flex items-center justify-center gap-3">
                <VocabIllustration id={selectedWord.id} className="w-20 h-20" />
                <div className="text-left">
                  <h4 className="text-2xl font-extrabold text-slate-900 font-['Fredoka']">
                    {selectedWord.displayTitle}
                  </h4>
                  <p className="text-sm font-semibold text-slate-600">{selectedWord.chinese}</p>
                  <p className="text-xs font-mono text-slate-400">{selectedWord.ipa}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => {
                    sound.playPop();
                    speakWord(selectedWord.word + ' ' + selectedWord.context);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Pronounce 发音</span>
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    speakWord(selectedWord.exampleSentence);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <span>Play Sentence 例句</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Big Projector Mode */}
      {activeTab === 'projector' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-slate-700">
                Whiteboard Presentation Mode 电子白板教学闪卡
              </span>
            </div>
            <div className="text-xs text-slate-400 font-bold">
              Card {projectorIndex + 1} of {vocabulary.length}
            </div>
          </div>

          {/* Huge Whiteboard Flashcard */}
          {(() => {
            const item = vocabulary[projectorIndex];
            return (
              <div className="p-8 bg-slate-50 border-2 border-slate-200 rounded-3xl flex flex-col md:flex-row items-center gap-8 justify-center">
                <div
                  onClick={() => {
                    sound.playPop();
                    speakWord(item.word + ' ' + item.context);
                  }}
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  <VocabIllustration id={item.id} className="w-72 h-72 md:w-80 md:h-80" interactive />
                </div>

                <div className="space-y-4 max-w-md text-center md:text-left">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                      Unit 1 Vocabulary
                    </span>
                    <h2 className="text-5xl font-extrabold text-slate-900 font-['Fredoka'] mt-1">
                      {item.word}
                    </h2>
                    <span className="text-2xl font-bold text-amber-600">({item.context})</span>
                    <p className="text-xl text-slate-700 font-semibold mt-2">{item.chinese}</p>
                    <p className="text-base text-slate-400 font-mono mt-1">{item.ipa}</p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                    <span className="text-xs font-bold text-slate-400">Classroom Sentence:</span>
                    <p className="text-lg font-bold text-slate-800">"{item.exampleSentence}"</p>
                    <p className="text-xs text-slate-500">{item.sentenceChinese}</p>
                  </div>

                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <button
                      onClick={() => {
                        sound.playPop();
                        speakWord(item.word + ' ' + item.context);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm shadow-sm cursor-pointer"
                    >
                      <Volume2 className="w-5 h-5" />
                      <span>Speak Word</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.playPop();
                        speakWord(item.exampleSentence);
                      }}
                      className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-xl font-bold text-sm cursor-pointer"
                    >
                      Speak Sentence
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                sound.playPop();
                setProjectorIndex((p) => (p > 0 ? p - 1 : vocabulary.length - 1));
              }}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-sm cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous 单词</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setProjectorIndex((p) => (p < vocabulary.length - 1 ? p + 1 : 0));
              }}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-sm cursor-pointer transition-all shadow-md"
            >
              <span>Next 单词</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Printable Worksheet & Guide */}
      {activeTab === 'worksheet' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 font-['Fredoka']">
                Printable Worksheet & Teaching Sheet 备课讲义与随堂测验表
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                格式规整，方便老师直接打印给学生作为课堂练习纸或课后单词卡。
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Page 打印此页</span>
            </button>
          </div>

          {/* Vocabulary Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold">
                  <th className="py-2.5 px-3">No.</th>
                  <th className="py-2.5 px-3">Word & Context</th>
                  <th className="py-2.5 px-3">Phonics</th>
                  <th className="py-2.5 px-3">Meaning (Chinese)</th>
                  <th className="py-2.5 px-3">Opposite Antonym</th>
                  <th className="py-2.5 px-3">Example Sentence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vocabulary.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.displayTitle}</td>
                    <td className="py-2.5 px-3 font-mono text-xs text-amber-700">
                      {item.phonics.map((p) => `/${p}/`).join(' + ')}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{item.chinese}</td>
                    <td className="py-2.5 px-3 text-xs font-semibold text-sky-700">
                      {item.oppositeWord || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-xs text-slate-600">{item.exampleSentence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
