import { useState, useMemo } from 'react';
import type { MouseEvent } from 'react';
import { Word } from '../data/vocab';
import HighlightedChinese from './HighlightedChinese';

interface Props {
  words: Word[];
  knownIds: Set<number>;
  weakIds: Set<number>;
  onKnown: (id: number) => void;
  onWeak: (id: number) => void;
  onBack: () => void;
  playSound: (type: 'correct' | 'wrong' | 'flip') => void;
}

export default function FlashCard({ words, knownIds, weakIds, onKnown, onWeak, onBack, playSound }: Props) {
  const shuffled = useMemo(() => [...words].sort(() => Math.random() - 0.5), [words]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);

  const word = shuffled[idx];
  const progress = ((idx) / shuffled.length) * 100;

  const next = () => {
    if (idx < shuffled.length - 1) {
      setIdx(i => i + 1);
      setFlipped(false);
    } else {
      setDone(true);
    }
  };

  const handleFlip = () => {
    if (!flipped) playSound('flip');
    setFlipped(f => !f);
  };

  const handleKnown = (e: MouseEvent) => {
    e.stopPropagation();
    onKnown(word.id);
    playSound('correct');
    setStreak(s => s + 1);
    next();
  };

  const handleWeak = (e: MouseEvent) => {
    e.stopPropagation();
    onWeak(word.id);
    playSound('wrong');
    setStreak(0);
    next();
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 text-center">
        <div className="text-6xl animate-bounce">🎉</div>
        <h2 className="text-2xl font-bold text-white">학습 완료!</h2>
        <div className="flex gap-6 text-sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400 glow-green">{knownIds.size}</p>
            <p className="text-slate-400">알았어 ✓</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-400">{weakIds.size}</p>
            <p className="text-slate-400">다시볼게 ↺</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-cyan-400 glow-cyan">{words.length}</p>
            <p className="text-slate-400">전체</p>
          </div>
        </div>
        {weakIds.size > 0 && (
          <button
            onClick={() => { setIdx(0); setFlipped(false); setDone(false); }}
            className="px-6 py-3 rounded-xl border border-amber-500/50 bg-amber-500/10 text-amber-400 font-bold"
          >
            ↺ 취약 단어만 다시보기 ({weakIds.size}개)
          </button>
        )}
        <button onClick={onBack} className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300">
          홈으로
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-slate-800 rounded-full h-2">
          <div
            className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 shrink-0">{idx + 1}/{shuffled.length}</span>
        {streak >= 3 && (
          <span className="text-xs text-amber-400 shrink-0 pulse-glow">🔥 {streak}연속!</span>
        )}
      </div>

      {/* Status pills */}
      <div className="flex gap-2 text-xs">
        <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400">
          ✓ {knownIds.size}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
          ↺ {weakIds.size}
        </span>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
          {word.type}
        </span>
      </div>

      {/* Card */}
      <div
        className="flex-1 card-perspective cursor-pointer select-none"
        onClick={handleFlip}
      >
        <div
          className="card-inner relative w-full h-full"
          style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Front */}
          <div className="card-face absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-cyan-900/40 bg-cn-surface2/80 glow-box-cyan">
            <div className="flex flex-col items-center gap-4">
              <HighlightedChinese
                text={word.chinese}
                hint={word.hint}
                className="text-8xl font-black leading-none"
                baseColorClass="text-cyan-400 glow-cyan"
              />
              <div className="flex items-center gap-2 text-slate-500">
                <span className="text-lg">👆</span>
                <span className="text-sm">탭하여 뜻 확인</span>
              </div>
            </div>
          </div>

          {/* Back */}
          <div className="card-face card-back absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-purple-900/40 bg-cn-surface2/80 glow-box-purple p-5 gap-3">
            <HighlightedChinese
              text={word.chinese}
              hint={word.hint}
              className="text-5xl font-black leading-none"
              baseColorClass="text-cyan-400 glow-cyan"
            />
            <p className="text-lg text-purple-300 glow-purple font-medium">{word.pinyin}</p>
            <p className="text-2xl font-bold text-white text-center">{word.korean}</p>
            <div className="w-full rounded-xl bg-slate-900/70 border border-slate-700/50 p-3 space-y-2">
              <p className="text-xs text-cyan-300/80">
                <span className="text-cyan-500 font-bold">🔑 한자풀이</span> {word.hint}
              </p>
              <p className="text-xs text-amber-300/80 italic">
                <span className="text-amber-400 font-bold not-italic">💡 연상</span> {word.memory}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className={`flex gap-3 transition-opacity duration-300 ${flipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button
          onClick={handleWeak}
          className="flex-1 py-4 rounded-xl border border-red-500/50 bg-red-500/10 text-red-400 font-bold text-lg active:scale-95 transition-transform"
        >
          ↺ 다시볼게
        </button>
        <button
          onClick={handleKnown}
          className="flex-1 py-4 rounded-xl border border-green-500/50 bg-green-500/10 text-green-400 font-bold text-lg active:scale-95 transition-transform"
        >
          ✓ 알았어
        </button>
      </div>
    </div>
  );
}
