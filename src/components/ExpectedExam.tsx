import { useState, useMemo, useCallback, Fragment, type ReactNode } from 'react';
import { VOCABULARY, type Word } from '../data/vocab';
import { selectExpectedExam, EXPECTED_EXAM_TOTAL } from '../data/selectExpectedExam';
import type { ExpectedExamQuestion, ExamQType } from '../data/expectedExamQuestions';
import HighlightedChinese from './HighlightedChinese';

interface Props {
  words: Word[];
  onBack: () => void;
  playSound: (type: 'correct' | 'wrong' | 'flip') => void;
  onResult?: (correct: number, total: number, weakIds: number[]) => void;
}

const CIRCLE = ['①', '②', '③', '④', '⑤'] as const;

const TYPE_LABELS: Record<ExamQType, string> = {
  pinyinPair: '병음 짝짓기',
  meaning: '어휘 뜻',
  categorySet: '범주·관련 없음',
  contextAwkward: '문맥·어색한 표현',
  passageBlank: '지문 괄호 빈칸',
  passageMeaning: '지문 밑줄 뜻',
  loanword: '외래어 발음',
  grammarBlank: '문법 빈칸',
  culture: '문화·상식',
};

function findWord(id: number): Word | undefined {
  return VOCABULARY.find((w) => w.id === id);
}

function renderPassageContent(passage: string, underlined?: string): ReactNode {
  if (underlined) {
    const marker = `㉢${underlined}`;
    if (passage.includes(marker)) {
      const [before, after] = passage.split(marker);
      return (
        <>
          {before}
          <span className="exam-underline">{underlined}</span>
          {after}
        </>
      );
    }
    const idx = passage.indexOf(underlined);
    if (idx >= 0) {
      return (
        <>
          {passage.slice(0, idx)}
          <span className="exam-underline">{underlined}</span>
          {passage.slice(idx + underlined.length)}
        </>
      );
    }
  }

  if (passage.includes('[   ]')) {
    const parts = passage.split('[   ]');
    return parts.map((part, i) => (
      <Fragment key={i}>
        {part}
        {i < parts.length - 1 && <span className="exam-blank">[   ]</span>}
      </Fragment>
    ));
  }

  if (passage.includes('___')) {
    const parts = passage.split('___');
    return parts.map((part, i) => (
      <Fragment key={i}>
        {part}
        {i < parts.length - 1 && <span className="exam-blank-inline">___</span>}
      </Fragment>
    ));
  }

  return passage;
}

function PassageBlock({ passage, underlined }: { passage: string; underlined?: string }) {
  return (
    <div className="exam-passage-ref">
      <p className="exam-passage-label">(지문 참고)</p>
      <p className="exam-passage-text chinese-font leading-relaxed">
        {renderPassageContent(passage, underlined)}
      </p>
    </div>
  );
}

export default function ExpectedExam({ words, onBack, playSound, onResult }: Props) {
  const [sessionKey, setSessionKey] = useState(0);
  const questions = useMemo(
    () => selectExpectedExam(words),
    [words, sessionKey],
  );

  const [qIdx, setQIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongIds, setWrongIds] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[qIdx];
  const progress = questions.length > 0 ? (qIdx / questions.length) * 100 : 0;

  const handleSelect = useCallback(
    (idx: number) => {
      if (answered || !q) return;
      setSelectedIdx(idx);
      setAnswered(true);
      const isCorrect = idx === q.answerIndex;
      if (isCorrect) {
        playSound('correct');
        setScore((s) => s + 1);
        setStreak((s) => s + 1);
      } else {
        playSound('wrong');
        setStreak(0);
        setWrongIds((prev) => [...new Set([...prev, ...q.relatedWordIds])]);
      }
    },
    [answered, q, playSound],
  );

  const handleNext = () => {
    if (!q) return;
    if (qIdx < questions.length - 1) {
      setQIdx((i) => i + 1);
      setSelectedIdx(null);
      setAnswered(false);
    } else {
      setDone(true);
      onResult?.(score, questions.length, wrongIds);
    }
  };

  const restart = () => {
    setSessionKey((k) => k + 1);
    setQIdx(0);
    setSelectedIdx(null);
    setAnswered(false);
    setScore(0);
    setWrongIds([]);
    setStreak(0);
    setDone(false);
  };

  if (questions.length < 8) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 screen-pad text-center">
        <p className="text-slate-400 text-sm tablet:text-base">
          선택한 장에 풀 수 있는 시험예상문제가 부족합니다.
          <br />
          다른 장을 선택하거나 전체를 선택해 주세요.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="touch-target-lg px-6 py-3 rounded-xl border border-slate-700 text-slate-300"
        >
          홈으로
        </button>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const grade =
      pct >= 90 ? '만점에 가까워요!' : pct >= 70 ? '우수!' : pct >= 50 ? '보통' : '다시 도전!';
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 tablet:gap-6 screen-pad text-center">
        <div className="text-5xl tablet:text-6xl">{pct >= 70 ? '🎉' : '💪'}</div>
        <h2 className="text-2xl tablet:text-3xl font-bold text-white">{grade}</h2>
        <div className="w-full max-w-sm tablet:max-w-md bg-slate-800 rounded-2xl p-5 tablet:p-6 space-y-3">
          <div className="flex justify-between text-sm tablet:text-base">
            <span className="text-slate-400">정답률</span>
            <span className="font-bold text-2xl tablet:text-3xl text-amber-400">{pct}%</span>
          </div>
          <div className="flex justify-between text-sm tablet:text-base">
            <span className="text-slate-400">맞힌 문제</span>
            <span className="text-green-400 font-bold">
              {score} / {questions.length}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-sm tablet:max-w-md">
          <button
            type="button"
            onClick={restart}
            className="touch-target-lg py-4 rounded-xl border border-amber-500/50 bg-amber-500/15 text-amber-300 font-bold"
          >
            ↺ 다시 풀기
          </button>
          <button
            type="button"
            onClick={onBack}
            className="touch-target-lg py-3 rounded-xl border border-slate-700 text-slate-300"
          >
            홈으로
          </button>
        </div>
      </div>
    );
  }

  const getChoiceStyle = (idx: number) => {
    if (!answered) {
      return 'border-slate-700 bg-slate-800/50 text-slate-200 active:scale-[0.98] transition-transform';
    }
    if (idx === q.answerIndex) {
      return 'border-green-500/70 bg-green-500/15 text-green-300 glow-green';
    }
    if (idx === selectedIdx && idx !== q.answerIndex) {
      return 'border-red-500/70 bg-red-500/15 text-red-300 shake';
    }
    return 'border-slate-800 bg-slate-900/50 text-slate-600';
  };

  const renderQuestion = () => {
    const primaryWord = findWord(q.relatedWordIds[0]);
    const needsPassage =
      q.passage &&
      (q.type === 'contextAwkward' ||
        q.type === 'passageBlank' ||
        q.type === 'passageMeaning' ||
        q.type === 'grammarBlank');

    return (
      <div className="flex flex-col gap-3 tablet:gap-4 w-full text-left">
        {q.examNo != null && (
          <p className="text-lg tablet:text-xl font-bold text-white">{q.examNo}.</p>
        )}

        <p className="text-sm tablet:text-base text-slate-200 whitespace-pre-line leading-relaxed">
          {q.prompt}
        </p>

        {needsPassage && q.passage && (
          <PassageBlock passage={q.passage} underlined={q.underlined} />
        )}

        {q.type === 'meaning' && primaryWord && (
          <div className="flex flex-col items-center gap-2 pt-2">
            <HighlightedChinese
              text={primaryWord.chinese}
              hint={primaryWord.hint}
              chapter={primaryWord.chapter}
              className="chinese-display-lg font-black glow-cyan"
              baseColorClass="text-cyan-400 glow-cyan"
            />
            <p className="text-base tablet:text-lg text-slate-400">{primaryWord.pinyin}</p>
          </div>
        )}

        {q.type === 'pinyinPair' && primaryWord && (
          <div className="flex flex-col items-center gap-1 pt-1">
            <HighlightedChinese
              text={primaryWord.chinese}
              hint={primaryWord.hint}
              chapter={primaryWord.chapter}
              className="text-2xl tablet:text-3xl font-bold"
              baseColorClass="text-amber-300"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full screen-pad gap-3 tablet:gap-4">
      <p className="text-xs tablet:text-sm text-slate-500 text-center shrink-0">
        고2 1학기 기말고사 예상 · 중간고사 유형 반영
      </p>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex-1 bg-slate-800 rounded-full progress-track">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs tablet:text-sm text-slate-400 shrink-0">
          {qIdx + 1}/{questions.length}
        </span>
        <span className="text-xs tablet:text-sm text-green-400 font-bold shrink-0">✓{score}</span>
        {streak >= 3 && (
          <span className="text-xs tablet:text-sm text-amber-400 pulse-glow shrink-0">🔥{streak}</span>
        )}
      </div>

      <div className="flex justify-center gap-2 shrink-0 flex-wrap">
        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs tablet:text-sm text-slate-300">
          {TYPE_LABELS[q.type]}
        </span>
        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs tablet:text-sm text-amber-300 font-bold">
          {q.chapter}장
        </span>
      </div>

      <div className="exam-layout flex-1 min-h-0">
        <div className="exam-question-pane rounded-2xl border border-slate-700/50 bg-slate-900/60 p-4 tablet:p-6 flex items-start justify-center overflow-y-auto scroll-area">
          {renderQuestion()}
        </div>

        <div className="exam-choice-pane flex flex-col gap-2 tablet:gap-3 min-h-0">
          <p className="text-xs tablet:text-sm text-slate-500 text-center shrink-0 -mt-1">보기에서 고르세요</p>
          <div className="exam-choice-list flex-1 min-h-0 overflow-y-auto scroll-area space-y-2 tablet:space-y-2.5">
            {q.choices.map((choice, ci) => (
              <button
                key={ci}
                type="button"
                onClick={() => handleSelect(ci)}
                disabled={answered}
                className={`exam-choice-btn touch-target-lg w-full py-3 tablet:py-4 px-4 rounded-xl border text-sm tablet:text-base font-medium text-left transition-all chinese-font ${getChoiceStyle(ci)}`}
              >
                <span className="text-slate-500 mr-2 font-sans">{CIRCLE[ci]}</span>
                {choice}
              </button>
            ))}
          </div>

          {answered && (
            <div className="exam-explanation shrink-0 bounce-in">
              <p className="text-sm tablet:text-base font-bold text-green-400 mb-1">
                정답: {CIRCLE[q.answerIndex]}
              </p>
              <p className="text-xs tablet:text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
            </div>
          )}

          {answered && (
            <button
              type="button"
              onClick={handleNext}
              className="touch-target-lg py-4 rounded-xl border border-amber-500/50 bg-amber-500/15 text-amber-300 font-bold text-base tablet:text-lg shrink-0"
            >
              {qIdx < questions.length - 1 ? '다음 문제 →' : '결과 보기'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export { EXPECTED_EXAM_TOTAL };
