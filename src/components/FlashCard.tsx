import { useState, useMemo, useCallback } from 'react';
import type { MouseEvent } from 'react';
import { Word } from '../data/vocab';
import { formatHintBreakdown, getWordRadicalTips } from '../data/radicals';
import { pinyinToHangul } from '../utils/pinyinHangul';
import HighlightedChinese from './HighlightedChinese';
import WordNoBadge from './WordNoBadge';

type FlashOrder = 'sequential' | 'random';

function loadFlashOrder(): FlashOrder {
  try {
    const v = localStorage.getItem('cn_flash_order');
    if (v === 'sequential' || v === 'random') return v;
  } catch { /* ignore */ }
  return 'sequential';
}

function orderWords(words: Word[], mode: FlashOrder): Word[] {
  if (mode === 'random') {
    return [...words].sort(() => Math.random() - 0.5);
  }
  return [...words].sort((a, b) => {
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    if (a.no != null && b.no != null) return a.no - b.no;
    return a.id - b.id;
  });
}

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
  const [orderMode, setOrderMode] = useState<FlashOrder>(loadFlashOrder);
  const deck = useMemo(() => orderWords(words, orderMode), [words, orderMode]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);

  const word = deck[idx];
  const progress = deck.length > 0 ? (idx / deck.length) * 100 : 0;

  const changeOrderMode = useCallback((mode: FlashOrder) => {
    setOrderMode(mode);
    try { localStorage.setItem('cn_flash_order', mode); } catch { /* ignore */ }
    setIdx(0);
    setFlipped(false);
    setDone(false);
    setStreak(0);
  }, []);
  const hangulPron = useMemo(() => (word ? pinyinToHangul(word.pinyin) : ''), [word?.pinyin]);
  const radicalTips = useMemo(() => (word ? getWordRadicalTips(word) : []), [word]);
  const hintBreakdown = useMemo(
    () => (word ? formatHintBreakdown(word.hint, word.chinese) : null),
    [word?.hint, word?.chinese],
  );

  if (deck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 screen-pad text-center">
        <p className="text-slate-400">학습할 단어가 없습니다.</p>
        <button onClick={onBack} className="touch-target-lg px-6 py-3 rounded-xl border border-slate-700 text-slate-300">
          홈으로
        </button>
      </div>
    );
  }

  const next = () => {
    if (idx < deck.length - 1) {
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
      <div className="flex flex-col items-center justify-center h-full gap-5 tablet:gap-6 screen-pad text-center">
        <div className="text-6xl tablet:text-7xl animate-bounce">🎉</div>
        <h2 className="text-2xl tablet:text-3xl font-bold text-white">학습 완료!</h2>
        <div className="flex gap-6 tablet:gap-10 text-sm tablet:text-base">
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
            className="px-6 py-3 tablet:px-8 tablet:py-4 touch-target-lg rounded-xl border border-amber-500/50 bg-amber-500/10 text-amber-400 font-bold text-base tablet:text-lg"
          >
            ↺ 취약 단어만 다시보기 ({weakIds.size}개)
          </button>
        )}
        <button onClick={onBack} className="px-6 py-3 tablet:px-8 tablet:py-4 touch-target-lg rounded-xl border border-slate-700 text-slate-300 text-base tablet:text-lg">
          홈으로
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full screen-pad gap-3 tablet:gap-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-slate-800 rounded-full progress-track">
          <div
            className="bg-cyan-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs tablet:text-sm text-slate-400 shrink-0">{idx + 1}/{deck.length}</span>
        {streak >= 3 && (
          <span className="text-xs tablet:text-sm text-amber-400 shrink-0 pulse-glow">🔥 {streak}연속!</span>
        )}
      </div>

      <div className="flex gap-1.5 p-1 bg-slate-800/60 rounded-xl border border-slate-700/40 shrink-0">
        <button
          type="button"
          onClick={() => changeOrderMode('sequential')}
          className={`flex-1 touch-target py-2 tablet:py-2.5 rounded-lg text-xs tablet:text-sm font-bold transition-all ${
            orderMode === 'sequential'
              ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
              : 'text-slate-500 hover:text-slate-300 border border-transparent'
          }`}
        >
          📋 순서 (1번~)
        </button>
        <button
          type="button"
          onClick={() => changeOrderMode('random')}
          className={`flex-1 touch-target py-2 tablet:py-2.5 rounded-lg text-xs tablet:text-sm font-bold transition-all ${
            orderMode === 'random'
              ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
              : 'text-slate-500 hover:text-slate-300 border border-transparent'
          }`}
        >
          🔀 랜덤
        </button>
      </div>

      <div className="flex gap-2 text-xs tablet:text-sm items-center flex-wrap">
        <WordNoBadge word={word} />
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

      <div className="study-layout flex-1 min-h-0">
        <div className="study-main">
          <div
            className="flex-1 card-perspective cursor-pointer select-none min-h-[16rem] tablet:min-h-[20rem]"
            onClick={handleFlip}
          >
            <div
              className="card-inner relative w-full h-full min-h-[16rem] tablet:min-h-[20rem]"
              style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              <div className="card-face flash-card-face absolute inset-0 rounded-2xl border border-cyan-900/40 bg-cn-surface2/80 glow-box-cyan p-3 tablet:p-4">
                <div className="shrink-0 flex justify-center pt-1">
                  <WordNoBadge word={word} className="text-sm tablet:text-base px-3 tablet:px-4 py-1 tablet:py-1.5" />
                </div>
                <div className="flash-card-hero flex-1">
                  <HighlightedChinese
                    text={word.chinese}
                    hint={word.hint}
                    chapter={word.chapter}
                    className="chinese-display-flash font-black"
                    baseColorClass="text-cyan-400 glow-cyan"
                  />
                </div>
                <div className="shrink-0 flex items-center justify-center gap-2 text-slate-500 pb-1">
                  <span className="text-lg tablet:text-xl">👆</span>
                  <span className="text-xs tablet:text-sm">탭하여 뜻 확인</span>
                </div>
              </div>

              <div className="card-face card-back flash-card-face absolute inset-0 rounded-2xl border border-purple-900/40 bg-cn-surface2/80 glow-box-purple p-4 tablet:p-5 gap-2 tablet:gap-3 overflow-y-auto scroll-area">
                <div className="shrink-0 flex justify-center">
                  <WordNoBadge word={word} className="text-sm tablet:text-base px-3 tablet:px-4 py-1 tablet:py-1.5" />
                </div>
                <div className="shrink-0 flex justify-center py-1">
                  <HighlightedChinese
                    text={word.chinese}
                    hint={word.hint}
                    chapter={word.chapter}
                    className="chinese-display-flash-back font-black"
                    baseColorClass="text-cyan-400 glow-cyan"
                  />
                </div>
                <p className="shrink-0 text-center text-base tablet:text-lg text-purple-300 glow-purple font-medium">
                  {word.pinyin}
                  {hangulPron && (
                    <span className="text-slate-300 font-normal ml-2">({hangulPron})</span>
                  )}
                </p>
                <p className="shrink-0 text-xl tablet:text-2xl font-bold text-white text-center">{word.korean}</p>

                <div className="w-full max-w-lg mx-auto rounded-xl bg-slate-900/70 border border-slate-700/50 p-3 tablet:p-4 space-y-3 shrink-0">
                  {(radicalTips.length > 0 || hintBreakdown) && (
                    <div className="space-y-2 pb-2 border-b border-slate-700/50">
                      <p className="text-xs tablet:text-sm text-rose-300 font-bold">🧩 외우기 포인트</p>
                      {radicalTips.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 tablet:gap-2">
                          {radicalTips.map((tip) => (
                            <span
                              key={tip.label}
                              className="inline-flex items-center gap-1 px-2 py-1 tablet:px-2.5 tablet:py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-xs tablet:text-sm chinese-font"
                            >
                              <span>{tip.emoji}</span>
                              <span className="font-bold text-red-300">{tip.label}</span>
                              <span className="text-red-200/80 font-sans">({tip.meaning})</span>
                            </span>
                          ))}
                        </div>
                      )}
                      {hintBreakdown && (
                        <p className="text-xs tablet:text-sm text-violet-300/90 chinese-font leading-relaxed">
                          <span className="text-violet-400 font-bold font-sans not-italic">📐 글자 모양 </span>
                          {hintBreakdown}
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-xs tablet:text-sm text-cyan-300/80 leading-relaxed">
                    <span className="text-cyan-500 font-bold">🔑 한자풀이</span> {word.hint}
                  </p>
                  <p className="text-xs tablet:text-sm text-amber-300/80 italic leading-relaxed">
                    <span className="text-amber-400 font-bold not-italic">💡 연상</span> {word.memory}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`study-actions transition-opacity duration-300 ${flipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button
            onClick={handleWeak}
            className="flex-1 landscape:flex-none touch-target-lg py-4 tablet:py-5 rounded-xl border border-red-500/50 bg-red-500/10 text-red-400 font-bold text-lg tablet:text-xl active:scale-[0.98] transition-transform"
          >
            ↺ 다시볼게
          </button>
          <button
            onClick={handleKnown}
            className="flex-1 landscape:flex-none touch-target-lg py-4 tablet:py-5 rounded-xl border border-green-500/50 bg-green-500/10 text-green-400 font-bold text-lg tablet:text-xl active:scale-[0.98] transition-transform"
          >
            ✓ 알았어
          </button>
        </div>
      </div>

      <div className={`flex gap-3 landscape:hidden transition-opacity duration-300 ${flipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button
          onClick={handleWeak}
          className="flex-1 touch-target-lg py-4 tablet:py-5 rounded-xl border border-red-500/50 bg-red-500/10 text-red-400 font-bold text-lg tablet:text-xl active:scale-[0.98] transition-transform"
        >
          ↺ 다시볼게
        </button>
        <button
          onClick={handleKnown}
          className="flex-1 touch-target-lg py-4 tablet:py-5 rounded-xl border border-green-500/50 bg-green-500/10 text-green-400 font-bold text-lg tablet:text-xl active:scale-[0.98] transition-transform"
        >
          ✓ 알았어
        </button>
      </div>
    </div>
  );
}
