import { useState, useMemo } from 'react';
import { Word } from '../data/vocab';
import HighlightedChinese from './HighlightedChinese';
import WordNoBadge from './WordNoBadge';

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
    <div className="flex flex-col h-full screen-pad gap-3 tablet:gap-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-slate-800 rounded-full progress-track">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs tablet:text-sm text-slate-400 shrink-0">{idx + 1}/{shuffled.length}</span>
      </div>

      {/* Main card */}
      <div className="flex-1 flex flex-col rounded-2xl border border-amber-900/30 bg-slate-900/80 overflow-hidden slide-up min-h-0">
        {/* Chinese character - always visible */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 tablet:p-8 min-h-[10rem] tablet:min-h-[14rem]">
          <div className="flex items-center gap-2 mb-1 flex-wrap justify-center">
            <WordNoBadge word={word} />
            <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs tablet:text-sm">
              {word.type}
            </div>
          </div>
          <HighlightedChinese
            text={word.chinese}
            hint={word.hint}
            chapter={word.chapter}
            className="chinese-display-xl font-black"
            baseColorClass="text-amber-300"
            style={{ textShadow: '0 0 24px rgba(245, 158, 11, 0.5)' }}
          />
        </div>

        {/* Reveal steps */}
        <div className="border-t border-slate-800 divide-y divide-slate-800 shrink-0">
          {/* Step 1: Pinyin */}
          <div className={`px-4 tablet:px-6 py-3 tablet:py-4 transition-all duration-300 ${step >= 1 ? 'bg-purple-500/5' : ''}`}>
            {step >= 1 ? (
              <div className="flex items-center gap-2">
                <span className="text-xs tablet:text-sm text-purple-400 font-bold shrink-0">병음</span>
                <span className="text-purple-300 font-medium text-base tablet:text-lg glow-purple">{word.pinyin}</span>
              </div>
            ) : (
              <button
                onClick={handleReveal}
                className="w-full text-left text-sm tablet:text-base text-slate-600 border-dashed border border-slate-700 rounded-lg px-3 py-2 tablet:py-3 touch-target"
              >
                {STEP_LABELS[0]}
              </button>
            )}
          </div>

          {/* Step 2: Korean */}
          <div className={`px-4 tablet:px-6 py-3 tablet:py-4 transition-all duration-300 ${step >= 2 ? 'bg-cyan-500/5' : ''}`}>
            {step >= 2 ? (
              <div className="flex items-center gap-2">
                <span className="text-xs tablet:text-sm text-cyan-400 font-bold shrink-0">뜻</span>
                <span className="text-white font-bold text-lg tablet:text-xl">{word.korean}</span>
              </div>
            ) : (
              <button
                onClick={step >= 1 ? handleReveal : undefined}
                className={`w-full text-left text-sm tablet:text-base rounded-lg px-3 py-2 tablet:py-3 border-dashed border transition-colors touch-target ${
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
          <div className={`px-4 tablet:px-6 py-3 tablet:py-4 transition-all duration-300 ${step >= 3 ? 'bg-green-500/5' : ''}`}>
            {step >= 3 ? (
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs tablet:text-sm text-green-400 font-bold shrink-0 mt-0.5">한자풀이</span>
                  <span className="text-green-300 text-sm tablet:text-base">{word.hint}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs tablet:text-sm text-amber-400 font-bold shrink-0 mt-0.5">연상</span>
                  <span className="text-amber-200/90 text-sm tablet:text-base italic">{word.memory}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={step >= 2 ? handleReveal : undefined}
                className={`w-full text-left text-sm tablet:text-base rounded-lg px-3 py-2 tablet:py-3 border-dashed border transition-colors touch-target ${
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
      <div className="flex gap-3 shrink-0">
        <button
          onClick={handlePrev}
          disabled={idx === 0}
          className="px-4 py-3 tablet:px-6 tablet:py-4 touch-target-lg rounded-xl border border-slate-700 text-slate-400 disabled:opacity-30 text-sm tablet:text-base"
        >
          ← 이전
        </button>
        {step < 3 ? (
          <button
            onClick={handleReveal}
            className="flex-1 touch-target-lg py-3 tablet:py-4 rounded-xl border border-amber-500/50 bg-amber-500/10 text-amber-300 font-bold text-base tablet:text-lg"
          >
            {STEP_LABELS[step]}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 touch-target-lg py-3 tablet:py-4 rounded-xl border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 font-bold text-base tablet:text-lg bounce-in"
          >
            {idx < shuffled.length - 1 ? '다음 단어 →' : '처음으로 ↺'}
          </button>
        )}
      </div>
    </div>
  );
}
