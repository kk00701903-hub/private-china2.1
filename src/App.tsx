import { useState, useEffect, useCallback, useMemo } from 'react';
import { VOCABULARY, type Word } from './data/vocab';
import FlashCard from './components/FlashCard';
import Drawing from './components/Drawing';
import HintCard from './components/HintCard';
import Quiz from './components/Quiz';
import Report from './components/Report';
import PreLearn from './components/PreLearn';

type Mode = 'home' | 'prelearn' | 'flashcard' | 'drawing' | 'hint' | 'quiz' | 'report';

function playSound(type: 'correct' | 'wrong' | 'flip') {
  if (typeof window === 'undefined') return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx: AudioContext = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch {
    // Audio not available
  }
}

const MODE_INFO = {
  flashcard: { icon: '📖', label: '단어 학습', desc: '카드 뒤집기로 빠르게 암기', color: 'cyan' },
  drawing:   { icon: '✍️',  label: '손암기',   desc: '직접 써보며 근육 기억 형성', color: 'purple' },
  hint:      { icon: '💡', label: '연상암기',  desc: '한자풀이+스토리로 기억',    color: 'amber' },
  quiz:      { icon: '🧠', label: '퀴즈',      desc: '4지선다 3종 실전 테스트',   color: 'green' },
} as const;

type ModeKey = keyof typeof MODE_INFO;

const COLOR_STYLES: Record<string, { border: string; bg: string; text: string }> = {
  cyan:   { border: 'border-cyan-500/40',   bg: 'bg-cyan-500/10',   text: 'text-cyan-300' },
  purple: { border: 'border-purple-500/40', bg: 'bg-purple-500/10', text: 'text-purple-300' },
  amber:  { border: 'border-amber-500/40',  bg: 'bg-amber-500/10',  text: 'text-amber-300' },
  green:  { border: 'border-green-500/40',  bg: 'bg-green-500/10',  text: 'text-green-300' },
};

export default function App() {
  const [mode, setMode] = useState<Mode>('home');
  const [knownIds, setKnownIds] = useState<Set<number>>(new Set());
  const [weakIds, setWeakIds] = useState<Set<number>>(new Set());
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizWeakIds, setQuizWeakIds] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [timerStarted, setTimerStarted] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<0 | 4 | 5 | 6>(0);

  // 장별 필터 - 0=전체, 4=4장, 5=5장, 6=6장
  const filteredWords = useMemo<Word[]>(() => {
    if (selectedChapter === 0) return VOCABULARY;
    return VOCABULARY.filter(w => w.chapter === selectedChapter);
  }, [selectedChapter]);

  // Load from localStorage (SSR-safe)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cn_vocab_v1');
      if (saved) {
        const parsed = JSON.parse(saved) as { k: number[]; w: number[]; tl: number };
        setKnownIds(new Set(parsed.k));
        setWeakIds(new Set(parsed.w));
        if (typeof parsed.tl === 'number' && parsed.tl > 0 && parsed.tl < 3600) {
          setTimeLeft(parsed.tl);
          setTimerStarted(true);
        }
      }
    } catch { /* ignore */ }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cn_vocab_v1', JSON.stringify({
        k: [...knownIds],
        w: [...weakIds],
        tl: timeLeft,
      }));
    } catch { /* ignore */ }
  }, [knownIds, weakIds, timeLeft]);

  // Timer countdown
  useEffect(() => {
    if (!timerStarted || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [timerStarted, timeLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const goMode = useCallback((m: Mode) => {
    setMode(m);
    if (!timerStarted) setTimerStarted(true);
  }, [timerStarted]);

  const markKnown = (id: number) => {
    setKnownIds(prev => new Set([...prev, id]));
    setWeakIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const markWeak = (id: number) => {
    setWeakIds(prev => new Set([...prev, id]));
    setKnownIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleQuizResult = (correct: number, total: number, wIds: number[]) => {
    setQuizCorrect(correct);
    setQuizTotal(total);
    setQuizWeakIds(wIds);
    wIds.forEach(id => markWeak(id));
  };

  const handleReset = () => {
    setKnownIds(new Set());
    setWeakIds(new Set());
    setQuizCorrect(0);
    setQuizTotal(0);
    setQuizWeakIds([]);
    setTimeLeft(3600);
    setTimerStarted(false);
    try { localStorage.removeItem('cn_vocab_v1'); } catch { /* ignore */ }
  };

  const isTimeLow = timeLeft > 0 && timeLeft <= 300;
  const isTimeUp = timeLeft === 0;

  const topBarTitle: Record<Mode, string> = {
    home: '중국어 단어 암기',
    prelearn: '🌟 사전학습 - 한자 기초 부수',
    flashcard: '📖 단어 학습',
    drawing: '✍️ 손암기',
    hint: '💡 연상암기',
    quiz: '🧠 퀴즈',
    report: '📊 학습 리포트',
  };

  return (
    <div className="app-shell flex flex-col bg-cn-bg grid-bg">
      {/* @section: top-bar */}
      <div className="top-bar flex items-center justify-between border-b border-slate-800 bg-[#0D1120] shrink-0">
        {mode !== 'home' ? (
          <button
            onClick={() => setMode('home')}
            className="touch-target-lg text-slate-300 text-base tablet:text-lg font-semibold flex items-center gap-1.5 px-3 py-1.5 tablet:px-4 tablet:py-2 -ml-1 rounded-lg border border-slate-700/60 bg-slate-800/40 active:scale-[0.98] transition-transform"
            aria-label="홈으로"
          >
            <span className="text-lg tablet:text-xl leading-none" aria-hidden>←</span>
            홈
          </button>
        ) : (
          <div className="w-14" />
        )}
        <h1 className="text-sm tablet:text-base font-bold text-slate-200 truncate px-2">{topBarTitle[mode]}</h1>
        <div
          className={`text-sm tablet:text-base font-mono font-bold tabular-nums shrink-0 min-w-[5.5rem] text-right ${
            isTimeUp ? 'text-slate-600' : isTimeLow ? 'text-red-400 flash-warn' : 'text-cyan-400 glow-cyan'
          }`}
        >
          {isTimeUp ? '⏰ 종료' : `⏱ ${formatTime(timeLeft)}`}
        </div>
      </div>

      {/* @section: content */}
      <div className="flex-1 overflow-hidden">
        {mode === 'home' && (
          <HomeScreen
            knownIds={knownIds}
            weakIds={weakIds}
            quizTotal={quizTotal}
            quizCorrect={quizCorrect}
            timerStarted={timerStarted}
            onGoMode={goMode}
            onReport={() => setMode('report')}
            selectedChapter={selectedChapter}
            onChapterChange={setSelectedChapter}
            filteredWords={filteredWords}
          />
        )}
        {mode === 'prelearn' && (
          <PreLearn
            onBack={() => setMode('home')}
            onStartFlashcard={() => goMode('flashcard')}
            selectedChapter={selectedChapter}
          />
        )}
        {mode === 'flashcard' && (
          <FlashCard
            words={filteredWords}
            knownIds={knownIds}
            weakIds={weakIds}
            onKnown={markKnown}
            onWeak={markWeak}
            onBack={() => setMode('home')}
            playSound={playSound}
          />
        )}
        {mode === 'drawing' && (
          <Drawing words={filteredWords} onBack={() => setMode('home')} />
        )}
        {mode === 'hint' && (
          <HintCard words={filteredWords} onBack={() => setMode('home')} />
        )}
        {mode === 'quiz' && (
          <Quiz
            words={filteredWords}
            onBack={() => setMode('home')}
            playSound={playSound}
            onResult={handleQuizResult}
          />
        )}
        {mode === 'report' && (
          <Report
            words={VOCABULARY}
            knownIds={knownIds}
            weakIds={weakIds}
            quizCorrect={quizCorrect}
            quizTotal={quizTotal}
            quizWeakIds={quizWeakIds}
            onReset={handleReset}
            onGoMode={(m) => goMode(m as Mode)}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────── Home Screen (inner component) ───────────────────
interface HomeProps {
  knownIds: Set<number>;
  weakIds: Set<number>;
  quizTotal: number;
  quizCorrect: number;
  timerStarted: boolean;
  onGoMode: (m: Mode) => void;
  onReport: () => void;
  selectedChapter: 0 | 4 | 5 | 6;
  onChapterChange: (ch: 0 | 4 | 5 | 6) => void;
  filteredWords: Word[];
}

function HomeScreen({ knownIds, weakIds, quizTotal, quizCorrect, timerStarted, onGoMode, onReport, selectedChapter, onChapterChange, filteredWords }: HomeProps) {
  const total = filteredWords.length;
  // 현재 필터된 단어 기준 알았어/다시볼게 계산
  const filteredKnown = total > 0 ? [...knownIds].filter(id => filteredWords.some(w => w.id === id)).length : 0;
  const filteredWeak  = total > 0 ? [...weakIds].filter(id => filteredWords.some(w => w.id === id)).length : 0;
  const pct = total > 0 ? Math.round((filteredKnown / total) * 100) : 0;
  const quizPct = quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : null;

  return (
    <div className="flex flex-col h-full overflow-y-auto scroll-area screen-pad gap-4 tablet:gap-6">
      <div className="home-tablet-split">
        {/* Left column: hero + filter + progress */}
        <div className="flex flex-col gap-4 tablet:gap-5">
          <div className="text-center py-2 tablet:py-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 tablet:px-4 tablet:py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs tablet:text-sm mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-glow inline-block" />
              천재교육 4·5·6장 · 기말고사 대비
            </div>
            <h1 className="text-4xl tablet:text-5xl font-black text-cyan-400 glow-cyan chinese-font mb-1">
              中文 暗记
            </h1>
            <p className="text-slate-400 text-sm tablet:text-base">
              4장 {VOCABULARY.filter(w=>w.chapter===4).length}개 + 5장 {VOCABULARY.filter(w=>w.chapter===5).length}개 + 6장 {VOCABULARY.filter(w=>w.chapter===6).length}개 = 총 {VOCABULARY.length}단어
            </p>
          </div>

          <div className="flex gap-1.5 tablet:gap-2 p-1 tablet:p-1.5 bg-slate-800/60 rounded-xl border border-slate-700/40">
            {([0, 4, 5, 6] as const).map(ch => (
              <button
                key={ch}
                onClick={() => onChapterChange(ch)}
                className={`flex-1 touch-target py-2 tablet:py-3 rounded-lg text-xs tablet:text-sm font-bold transition-all ${
                  selectedChapter === ch
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ch === 0
                  ? `전체(${VOCABULARY.length})`
                  : `${ch}장(${VOCABULARY.filter(w => w.chapter === ch).length})`}
              </button>
            ))}
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-700/50 p-4 tablet:p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm tablet:text-base font-bold text-slate-300">
                학습 진행률
                {selectedChapter !== 0 && <span className="text-xs tablet:text-sm text-cyan-400 ml-1">({selectedChapter}장)</span>}
              </span>
              <span className="text-cyan-400 font-bold text-base tablet:text-lg">{pct}%</span>
            </div>
            <div className="bg-slate-800 rounded-full progress-track mb-3">
              <div
                className="bg-gradient-to-r from-cyan-700 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs tablet:text-sm text-slate-500">
              <span>✓ 알았어 <span className="text-green-400 font-bold">{filteredKnown}</span></span>
              <span>↺ 다시볼게 <span className="text-red-400 font-bold">{filteredWeak}</span></span>
              {quizPct !== null && <span>퀴즈 <span className="text-green-400 font-bold">{quizPct}%</span></span>}
              <span>전체 <span className="text-slate-300 font-bold">{total}</span></span>
            </div>
          </div>
        </div>

        {/* Right column: modes + actions */}
        <div className="flex flex-col gap-4 tablet:gap-5">
          <button
            onClick={() => onGoMode('prelearn')}
            className="w-full flex items-center gap-4 tablet:gap-5 p-4 tablet:p-5 rounded-2xl border border-yellow-500/40 bg-gradient-to-r from-yellow-900/20 to-amber-900/20 text-left relative overflow-hidden active:scale-[0.98] transition-transform touch-target-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />
            <div className="shrink-0 w-14 h-14 tablet:w-16 tablet:h-16 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <span className="text-3xl tablet:text-4xl">🔑</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs tablet:text-sm px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 font-bold">
                  🌟 여기서 시작!
                </span>
              </div>
              <p className="text-sm tablet:text-base font-bold text-amber-200">사전학습 · 한자 기초 부수</p>
              <p className="text-xs tablet:text-sm text-slate-400 mt-0.5 leading-snug">
                한자를 처음 보는 분! 부수를 먼저 익히면 단어 암기가 2배 쉬워져요
              </p>
            </div>
            <span className="text-slate-500 shrink-0 text-xl">›</span>
          </button>

          <div className="mode-grid-tablet">
            {(Object.entries(MODE_INFO) as [ModeKey, typeof MODE_INFO[ModeKey]][]).map(([key, info]) => {
              const cs = COLOR_STYLES[info.color];
              return (
                <button
                  key={key}
                  onClick={() => onGoMode(key)}
                  className={`flex flex-col items-start p-4 tablet:p-5 rounded-2xl border ${cs.border} ${cs.bg} text-left active:scale-[0.98] transition-transform touch-target-lg min-h-[6.5rem] tablet:min-h-[7.5rem]`}
                >
                  <span className="text-2xl tablet:text-3xl mb-2">{info.icon}</span>
                  <span className={`text-sm tablet:text-base font-bold ${cs.text}`}>{info.label}</span>
                  <span className="text-xs tablet:text-sm text-slate-500 mt-0.5 leading-tight">{info.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 tablet:p-4">
            <p className="text-sm tablet:text-base text-slate-300 chinese-font text-center leading-relaxed">
              我们都要<span className="text-cyan-400 font-bold">保护环境</span>嘛！
            </p>
            <p className="text-xs tablet:text-sm text-slate-500 text-center mt-1">우리는 모두 환경을 보호해야 하잖아!</p>
          </div>

          <div className="flex gap-2 tablet:gap-3 pb-2 tablet:pb-0">
            <button
              onClick={onReport}
              className="flex-1 touch-target-lg py-3 tablet:py-4 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-300 text-sm tablet:text-base font-medium"
            >
              📊 리포트
            </button>
            {!timerStarted ? (
              <button
                onClick={() => onGoMode('prelearn')}
                className="flex-1 touch-target-lg py-3 tablet:py-4 rounded-xl border border-yellow-500/60 bg-yellow-500/15 text-yellow-300 font-bold text-sm tablet:text-base border-pulse"
              >
                🌟 사전학습 시작
              </button>
            ) : (
              <button
                onClick={() => onGoMode('quiz')}
                className="flex-1 touch-target-lg py-3 tablet:py-4 rounded-xl border border-green-500/60 bg-green-500/15 text-green-300 font-bold text-sm tablet:text-base"
              >
                🧠 퀴즈 도전
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
