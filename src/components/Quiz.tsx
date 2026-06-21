import { useState, useMemo, useCallback } from 'react';
import { Word } from '../data/vocab';
import HighlightedChinese from './HighlightedChinese';
import WordNoBadge from './WordNoBadge';

interface Props {
  words: Word[];
  onBack: () => void;
  playSound: (type: 'correct' | 'wrong' | 'flip') => void;
  onResult: (correct: number, total: number, weakIds: number[]) => void;
}

type QuizType = 'ch2ko' | 'ko2ch' | 'pinyin';

interface Question {
  word: Word;
  type: QuizType;
  choices: string[];
  answer: string;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateQuestions(words: Word[], count: number): Question[] {
  const types: QuizType[] = ['ch2ko', 'ko2ch', 'pinyin'];
  const shuffled = shuffle(words);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((word, i) => {
    const type = types[i % types.length];
    const others = words.filter(w => w.id !== word.id);
    const wrongPool = shuffle(others).slice(0, 3);

    let answer: string;
    let getLabel: (w: Word) => string;

    if (type === 'ch2ko') {
      answer = word.korean;
      getLabel = (w) => w.korean;
    } else if (type === 'ko2ch') {
      answer = word.chinese;
      getLabel = (w) => w.chinese;
    } else {
      answer = word.pinyin;
      getLabel = (w) => w.pinyin;
    }

    const choices = shuffle([answer, ...wrongPool.map(getLabel)]);
    return { word, type, choices, answer };
  });
}

const TYPE_LABELS: Record<QuizType, string> = {
  ch2ko: '🈶 중국어 → 한국어',
  ko2ch: '🇰🇷 한국어 → 중국어',
  pinyin: '🔤 중국어 → 병음',
};

export default function Quiz({ words, onBack, playSound, onResult }: Props) {
  const TOTAL = 20;
  const questions = useMemo(() => generateQuestions(words, TOTAL), [words]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongIds, setWrongIds] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[qIdx];
  const progress = (qIdx / questions.length) * 100;

  const handleSelect = useCallback((choice: string) => {
    if (answered) return;
    setSelected(choice);
    setAnswered(true);
    const isCorrect = choice === q.answer;
    if (isCorrect) {
      playSound('correct');
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      playSound('wrong');
      setStreak(0);
      setWrongIds(prev => [...prev, q.word.id]);
    }
  }, [answered, q, playSound]);

  const handleNext = () => {
    if (qIdx < questions.length - 1) {
      setQIdx(i => i + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setDone(true);
      onResult(score + (selected === q.answer ? 1 : 0), questions.length, wrongIds);
    }
  };

  if (done) {
    const finalScore = score;
    const pct = Math.round((finalScore / questions.length) * 100);
    const grade = pct >= 90 ? '🏆 만점!' : pct >= 70 ? '🎉 우수!' : pct >= 50 ? '📚 보통' : '💪 분발!';
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 tablet:gap-6 screen-pad text-center">
        <div className="text-5xl tablet:text-6xl">{pct >= 70 ? '🎉' : '💪'}</div>
        <h2 className="text-3xl tablet:text-4xl font-bold text-white">{grade}</h2>
        <div className="w-full max-w-sm tablet:max-w-md bg-slate-800 rounded-2xl p-5 tablet:p-6 space-y-3">
          <div className="flex justify-between text-sm tablet:text-base">
            <span className="text-slate-400">정답률</span>
            <span className="font-bold text-2xl tablet:text-3xl text-cyan-400 glow-cyan">{pct}%</span>
          </div>
          <div className="flex justify-between text-sm tablet:text-base">
            <span className="text-slate-400">맞힌 문제</span>
            <span className="text-green-400 font-bold">{finalScore} / {questions.length}</span>
          </div>
          {wrongIds.length > 0 && (
            <div className="flex justify-between text-sm tablet:text-base">
              <span className="text-slate-400">틀린 단어</span>
              <span className="text-red-400 font-bold">{wrongIds.length}개</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full max-w-sm tablet:max-w-md">
          <button
            onClick={() => {
              setQIdx(0); setSelected(null); setAnswered(false);
              setScore(0); setWrongIds([]); setStreak(0); setDone(false);
            }}
            className="touch-target-lg py-4 tablet:py-5 rounded-xl border border-cyan-500/50 bg-cyan-500/15 text-cyan-300 font-bold text-base tablet:text-lg"
          >
            ↺ 다시 풀기
          </button>
          <button onClick={onBack} className="touch-target-lg py-3 tablet:py-4 rounded-xl border border-slate-700 text-slate-300 text-base tablet:text-lg">
            홈으로
          </button>
        </div>
      </div>
    );
  }

  const getChoiceStyle = (choice: string) => {
    if (!answered) {
      return 'border-slate-700 bg-slate-800/50 text-slate-200 active:scale-95 transition-transform';
    }
    if (choice === q.answer) {
      return 'border-green-500/70 bg-green-500/15 text-green-300 glow-green';
    }
    if (choice === selected && choice !== q.answer) {
      return 'border-red-500/70 bg-red-500/15 text-red-300 shake';
    }
    return 'border-slate-800 bg-slate-900/50 text-slate-600';
  };

  const renderQuestion = () => {
    const { word, type } = q;
    if (type === 'ch2ko') {
      return (
        <div className="flex flex-col items-center gap-3 tablet:gap-4">
          <WordNoBadge word={word} />
          <p className="text-xs tablet:text-sm text-cyan-400 font-medium">아래 중국어의 뜻은?</p>
          <HighlightedChinese
            text={word.chinese}
            hint={word.hint}
            chapter={word.chapter}
            className="chinese-display-xl font-black glow-cyan"
            baseColorClass="text-cyan-400 glow-cyan"
          />
          <p className="text-base tablet:text-lg text-slate-400">{word.pinyin}</p>
        </div>
      );
    }
    if (type === 'ko2ch') {
      return (
        <div className="flex flex-col items-center gap-3 tablet:gap-4">
          <WordNoBadge word={word} />
          <p className="text-xs tablet:text-sm text-purple-400 font-medium">아래 뜻의 중국어는?</p>
          <p className="text-3xl tablet:text-4xl font-bold text-white leading-snug text-center">{word.korean}</p>
          <p className="text-sm tablet:text-base text-slate-500">[{word.type}]</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center gap-3 tablet:gap-4">
        <WordNoBadge word={word} />
        <p className="text-xs tablet:text-sm text-amber-400 font-medium">아래 중국어의 병음은?</p>
        <HighlightedChinese
          text={word.chinese}
          hint={word.hint}
          chapter={word.chapter}
          className="chinese-display-xl font-black"
          baseColorClass="text-amber-300"
          style={{ textShadow: '0 0 20px rgba(245,158,11,0.4)' }}
        />
        <p className="text-base tablet:text-lg text-white">{word.korean}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full screen-pad gap-3 tablet:gap-4">
      {/* Progress */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex-1 bg-slate-800 rounded-full progress-track">
          <div
            className="bg-green-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs tablet:text-sm text-slate-400 shrink-0">{qIdx + 1}/{questions.length}</span>
        <span className="text-xs tablet:text-sm text-green-400 font-bold shrink-0">✓{score}</span>
        {streak >= 3 && <span className="text-xs tablet:text-sm text-amber-400 pulse-glow shrink-0">🔥{streak}</span>}
      </div>

      {/* Type badge */}
      <div className="flex justify-center shrink-0">
        <span className="px-3 py-1 tablet:px-4 tablet:py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs tablet:text-sm text-slate-300">
          {TYPE_LABELS[q.type]}
        </span>
      </div>

      <div className="quiz-layout flex-1 min-h-0">
        {/* Question */}
        <div className="quiz-question-pane rounded-2xl border border-slate-700/50 bg-slate-900/60 p-4 tablet:p-6">
          {renderQuestion()}
        </div>

        {/* Choices + Next */}
        <div className="quiz-choice-pane">
          <div className="grid grid-cols-2 gap-2 tablet:gap-3">
            {q.choices.map((choice, ci) => (
              <button
                key={ci}
                onClick={() => handleSelect(choice)}
                className={`touch-target-lg py-4 tablet:py-5 px-3 rounded-xl border text-sm tablet:text-base font-medium text-center transition-all chinese-font ${getChoiceStyle(choice)}`}
              >
                {choice}
              </button>
            ))}
          </div>

          {answered && (
            <button
              onClick={handleNext}
              className="touch-target-lg py-4 tablet:py-5 rounded-xl border border-cyan-500/50 bg-cyan-500/15 text-cyan-300 font-bold text-base tablet:text-lg bounce-in"
            >
              {qIdx < questions.length - 1 ? '다음 문제 →' : '결과 보기 🏁'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
