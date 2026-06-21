import { useState, useMemo } from 'react';
import { Word } from '../data/vocab';

interface Props {
  words: Word[];
  onBack: () => void;
}

type RevealStep = 0 | 1 | 2 | 3;

const STEP_LABELS = ['병음 확인 👆', '한국어 뜻 확인 👆', '한자풀이 확인 👆', '연상 스토리 확인 👆'];
const STEP_DONE = ['✓ 병음 확인', '✓ 한국어 뜻 확인', '✓ 한자풀이 확인', '✓ 전부 확인!'];

export default function HintCard({ words, onBack }: Props) {
  const shuffled = useMemo(() => [...words].sort(() => Math.random() - 0.5), [words]);
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState<RevealStep>(0);

  const word = shuffled[idx];
  const progress = ((idx) / shuffled.length) * 100;

  const handleReveal = () => {
    if (step < 3) {
      setStep((s) => (s + 1) as RevealStep);
    }
  };

  const handleNext = () => {
    if (idx < shuffled.length - 1) {
      setIdx(i => i + 1);
      setStep(0);
    } else {
      setIdx(0);
      setStep(0);
    }
  };

  const handlePrev = () => {
    if (idx > 0) {
      setIdx(i => i - 1);
      setStep(0);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-slate-800 rounded-full h-2">
          <div
            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-slate-400">{idx + 1}/{shuffled.length}</span>
      </div>

      {/* Main card */}
      <div className="flex-1 flex flex-col rounded-2xl border border-amber-900/30 bg-slate-900/80 overflow-hidden slide-up">
        {/* Chinese character - always visible */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6">
          <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs mb-2">
            {word.type}
          </div>
          <p
            className="text-8xl font-black text-amber-300 chinese-font leading-none"
            style={{ textShadow: '0 0 24px rgba(245, 158, 11, 0.5)' }}
          >
            {word.chinese}
          </p>
        </div>

        {/* Reveal steps */}
        <div className="border-t border-slate-800 divide-y divide-slate-800">
          {/* Step 1: Pinyin */}
          <div className={`px-4 py-3 transition-all duration-300 ${step >= 1 ? 'bg-purple-500/5' : ''}`}>
            {step >= 1 ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-400 font-bold shrink-0">병음</span>
                <span className="text-purple-300 font-medium glow-purple">{word.pinyin}</span>
              </div>
            ) : (
              <button
                onClick={handleReveal}
                className="w-full text-left text-sm text-slate-600 border-dashed border border-slate-700 rounded-lg px-3 py-1.5"
              >
                {STEP_LABELS[0]}
              </button>
            )}
          </div>

          {/* Step 2: Korean */}
          <div className={`px-4 py-3 transition-all duration-300 ${step >= 2 ? 'bg-cyan-500/5' : ''}`}>
            {step >= 2 ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-cyan-400 font-bold shrink-0">뜻</span>
                <span className="text-white font-bold text-lg">{word.korean}</span>
              </div>
            ) : (
              <button
                onClick={step >= 1 ? handleReveal : undefined}
                className={`w-full text-left text-sm rounded-lg px-3 py-1.5 border-dashed border transition-colors ${
                  step >= 1
                    ? 'text-slate-400 border-slate-600 hover:border-cyan-700'
                    : 'text-slate-700 border-slate-800 cursor-not-allowed'
                }`}
              >
                {step >= 1 ? STEP_LABELS[1] : '(병음 먼저 확인)'}
              </button>
            )}
          </div>

          {/* Step 3: Hint */}
          <div className={`px-4 py-3 transition-all duration-300 ${step >= 3 ? 'bg-green-500/5' : ''}`}>
            {step >= 3 ? (
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-green-400 font-bold shrink-0 mt-0.5">한자풀이</span>
                  <span className="text-green-300 text-sm">{word.hint}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-amber-400 font-bold shrink-0 mt-0.5">연상</span>
                  <span className="text-amber-200/90 text-sm italic">{word.memory}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={step >= 2 ? handleReveal : undefined}
                className={`w-full text-left text-sm rounded-lg px-3 py-1.5 border-dashed border transition-colors ${
                  step >= 2
                    ? 'text-slate-400 border-slate-600 hover:border-green-700'
                    : 'text-slate-700 border-slate-800 cursor-not-allowed'
                }`}
              >
                {step >= 2 ? STEP_LABELS[2] : '(뜻 먼저 확인)'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={handlePrev}
          disabled={idx === 0}
          className="px-4 py-3 rounded-xl border border-slate-700 text-slate-400 disabled:opacity-30"
        >
          ← 이전
        </button>
        {step < 3 ? (
          <button
            onClick={handleReveal}
            className="flex-1 py-3 rounded-xl border border-amber-500/50 bg-amber-500/10 text-amber-300 font-bold"
          >
            {STEP_LABELS[step]}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 font-bold bounce-in"
          >
            {idx < shuffled.length - 1 ? '다음 단어 →' : '처음으로 ↺'}
          </button>
        )}
      </div>
    </div>
  );
}
