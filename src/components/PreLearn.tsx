import { useState, useRef } from 'react';
import { RADICALS, type Radical } from '../data/radicals';

// ── Props ────────────────────────────────────────────────────────────
interface Props {
  onBack: () => void;
  onStartFlashcard: () => void;
  selectedChapter?: 0 | 4 | 5 | 6;
}

// ── Component ────────────────────────────────────────────────────────
export default function PreLearn({ onBack, onStartFlashcard, selectedChapter = 0 }: Props) {
  // 장 필터 적용: 0=전체, 4=4장, 5=5장 부수(chapter 없으면 5장 기본), 6=6장 부수
  const baseRadicals = selectedChapter === 0
    ? RADICALS
    : RADICALS.filter(r => (r.chapter ?? 5) === selectedChapter);

  const [passCards, setPassCards] = useState<Radical[]>(baseRadicals);
  const [idx, setIdx] = useState(0);
  const [passNumber, setPassNumber] = useState(1);
  const [done, setDone] = useState(false);
  const [totalReview, setTotalReview] = useState(0);
  const reviewRef = useRef<Radical[]>([]);
  const [animKey, setAnimKey] = useState(0); // triggers re-animation

  const card = passCards[idx];
  const total = passCards.length;
  const progress = (idx / total) * 100;

  const advance = (addToReview: boolean) => {
    if (addToReview) {
      reviewRef.current = [...reviewRef.current, card];
      setTotalReview(c => c + 1);
    }

    const nextIdx = idx + 1;
    if (nextIdx < total) {
      setIdx(nextIdx);
      setAnimKey(k => k + 1);
    } else {
      // End of current pass
      if (passNumber === 1 && reviewRef.current.length > 0) {
        setPassCards(reviewRef.current);
        reviewRef.current = [];
        setPassNumber(2);
        setIdx(0);
        setAnimKey(k => k + 1);
      } else {
        setDone(true);
      }
    }
  };

  // ── Done screen ────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 text-center">
        <div className="text-6xl animate-bounce">🎉</div>
        <h2 className="text-2xl font-bold text-white">기초 부수 학습 완료!</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          {RADICALS.length}개 부수를 모두 익혔어요!<br />
          이제 단어 암기가 훨씬 쉬울 거예요 ✨
        </p>
        {totalReview > 0 && (
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <p className="text-amber-300 text-sm">다시 복습한 카드: {totalReview}개</p>
          </div>
        )}
        {/* Quick review of all learned */}
        <div className="w-full max-w-xs rounded-2xl bg-slate-900/80 border border-slate-700 p-4 max-h-48 overflow-y-auto scroll-area">
          <p className="text-xs text-slate-500 mb-2 text-left">오늘 배운 부수들</p>
          <div className="flex flex-wrap gap-2">
            {baseRadicals.map(r => (
              <div key={r.char} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700">
                <span className="text-lg font-bold text-cyan-400 chinese-font">{r.char.split('/')[0].trim()}</span>
                <span className="text-xs text-slate-400">{r.meaning}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <button
            onClick={onStartFlashcard}
            className="py-4 rounded-xl border border-cyan-500/60 bg-cyan-500/15 text-cyan-300 font-bold text-base"
          >
            📖 단어 학습 시작하기 →
          </button>
          <button
            onClick={() => {
              setPassCards(baseRadicals);
              setIdx(0);
              setPassNumber(1);
              setDone(false);
              setTotalReview(0);
              reviewRef.current = [];
            }}
            className="py-3 rounded-xl border border-slate-700 text-slate-400 text-sm"
          >
            ↺ 처음부터 다시 보기
          </button>
        </div>
      </div>
    );
  }

  // ── Card screen ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full p-4 gap-3">
      {/* Progress bar */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex-1 bg-slate-800 rounded-full h-2">
          <div
            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 shrink-0">{idx + 1}/{total}</span>
        {passNumber === 2 && (
          <span className="text-xs text-amber-400 shrink-0 pulse-glow">2회차</span>
        )}
      </div>

      {/* Category + pass badge */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400">
          {card.category}
        </span>
        <span className="text-xs text-slate-600">부수 {idx + 1}/{total}</span>
      </div>

      {/* Main card */}
      <div key={animKey} className="flex-1 flex flex-col overflow-y-auto scroll-area slide-up gap-3">

        {/* Character + pinyin + meaning */}
        <div className="flex flex-col items-center py-4 gap-2">
          <p
            className="font-black leading-none chinese-font text-amber-300 select-none"
            style={{
              fontSize: 'clamp(72px, 22vw, 110px)',
              textShadow: '0 0 40px rgba(245, 158, 11, 0.55), 0 0 80px rgba(245, 158, 11, 0.25)',
            }}
          >
            {card.char.split('/')[0].trim()}
          </p>
          {card.char.includes('/') && (
            <p className="text-sm text-amber-500/70">
              (글자 안에서 → <span className="chinese-font font-bold">{card.char.split('/')[1].trim()}</span>)
            </p>
          )}
          <div className="flex items-center gap-3">
            <span className="text-2xl">{card.emoji}</span>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{card.meaning}</p>
              <p className="text-sm text-purple-300 glow-purple">{card.pinyin}</p>
            </div>
          </div>
        </div>

        {/* Formula (영단어 분해식) */}
        <div className="rounded-2xl bg-slate-900/80 border border-cyan-900/40 p-3">
          <p className="text-xs text-cyan-400 font-bold mb-1">🔤 영단어처럼 분해하면</p>
          <p className="text-xs text-cyan-200/80 chinese-font leading-relaxed">{card.formula}</p>
        </div>

        {/* Story - speech bubble */}
        <div className="relative">
          <div className="absolute -top-2 left-5 w-4 h-4 rotate-45 bg-slate-900/90 border-l border-t border-amber-900/40" />
          <div className="rounded-2xl rounded-tl-none bg-slate-900/90 border border-amber-900/30 p-4">
            <p className="text-xs text-amber-400 font-bold mb-1">💡 기억법</p>
            <p className="text-sm text-amber-200/90 leading-relaxed italic">{card.story}</p>
          </div>
        </div>

        {/* Example words */}
        <div>
          <p className="text-xs text-slate-500 mb-2">이 글자가 들어간 단어들</p>
          <div className="flex flex-wrap gap-2">
            {card.examples.map((ex, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs chinese-font"
              >
                {ex}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 shrink-0 pt-1">
        <button
          onClick={() => advance(true)}
          className="flex-1 py-4 rounded-xl border border-amber-500/50 bg-amber-500/10 text-amber-300 font-bold active:scale-95 transition-transform"
        >
          🔄 다시볼게
        </button>
        <button
          onClick={() => advance(false)}
          className="flex-1 py-4 rounded-xl border border-green-500/50 bg-green-500/10 text-green-300 font-bold active:scale-95 transition-transform"
        >
          👍 이해했어!
        </button>
      </div>
    </div>
  );
}
