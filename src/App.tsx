import { useState, useEffect, useCallback, useMemo } from 'react';
import { VOCABULARY, type Word } from './data/vocab';
import FlashCard from './components/FlashCard';
import ExamTips from './components/ExamTips';
import ExpectedExam from './components/ExpectedExam';
import Quiz from './components/Quiz';
import Report from './components/Report';
import PreLearn from './components/PreLearn';

type ChapterFilter = 0 | 4 | 5 | 6;

const CHAPTER_OPTIONS: ChapterFilter[] = [4, 5, 6, 0];

function isChapterFilter(v: unknown): v is ChapterFilter {
  return v === 0 || v === 4 || v === 5 || v === 6;
}

type Mode = 'home' | 'prelearn' | 'flashcard' | 'examtips' | 'expectedexam' | 'quiz' | 'report';

interface SavedProgress {
  k: number[];
  w: number[];
  tl: number;
  ch?: ChapterFilter;
}

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
  quiz:         { icon: '🧠', label: '퀴즈',       desc: '4지선다 3종 실전 테스트',   color: 'green' },
  expectedexam: { icon: '📝', label: '시험예상문제', desc: '고2 기말고사형 5지선다 10문항', color: 'amber' },
  flashcard:    { icon: '📖', label: '단어 학습',   desc: '카드 뒤집기로 빠르게 암기', color: 'cyan' },
  examtips:     { icon: '📋', label: '시험팁',     desc: '중간고사 단어 출제 패턴 한눈에', color: 'purple' },
} as const;

type ModeKey = keyof typeof MODE_INFO;

const HOME_MODE_ORDER: ModeKey[] = ['quiz', 'expectedexam', 'flashcard', 'examtips'];

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
  const [selectedChapter, setSelectedChapter] = useState<ChapterFilter>(4);

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
        const parsed = JSON.parse(saved) as SavedProgress;
        setKnownIds(new Set(parsed.k));
        setWeakIds(new Set(parsed.w));
        if (typeof parsed.tl === 'number' && parsed.tl > 0 && parsed.tl < 3600) {
          setTimeLeft(parsed.tl);
          setTimerStarted(true);
        }
        if (isChapterFilter(parsed.ch)) {
          setSelectedChapter(parsed.ch);
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
        ch: selectedChapter,
      }));
    } catch { /* ignore */ }
  }, [knownIds, weakIds, timeLeft, selectedChapter]);

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
    examtips: '📋 시험팁',
    expectedexam: '📝 시험예상문제',
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
        {mode === 'examtips' && (
          <ExamTips onBack={() => setMode('home')} />
        )}
        {mode === 'expectedexam' && (
          <ExpectedExam
            words={filteredWords}
            onBack={() => setMode('home')}
            playSound={playSound}
            onResult={handleQuizResult}
          />
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
  selectedChapter: ChapterFilter;
  onChapterChange: (ch: ChapterFilter) => void;
  filteredWords: Word[];
}

const CHAPTER_COUNTS = {
  4: VOCABULARY.filter(w => w.chapter === 4).length,
  5: VOCABULARY.filter(w => w.chapter === 5).length,
  6: VOCABULARY.filter(w => w.chapter === 6).length,
} as const;

function HomeScreen({ knownIds, weakIds, quizTotal, quizCorrect, timerStarted, onGoMode, onReport, selectedChapter, onChapterChange, filteredWords }: HomeProps) {
  const total = filteredWords.length;
  const filteredKnown = total > 0 ? [...knownIds].filter(id => filteredWords.some(w => w.id === id)).length : 0;
  const filteredWeak  = total > 0 ? [...weakIds].filter(id => filteredWords.some(w => w.id === id)).length : 0;
  const remaining = total - filteredKnown;
  const pct = total > 0 ? Math.round((filteredKnown / total) * 100) : 0;
  const quizPct = quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : null;

  return (
    <div className="home-screen h-full overflow-y-auto scroll-area screen-pad">
      <div className="home-bento">
        {/* Left: hero + progress */}
        <div className="home-bento-left">
          <div className="home-hero">
            <div className="home-hero-glow" aria-hidden />
            <div className="home-hero-glow-2" aria-hidden />
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs tablet:text-sm mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-glow" aria-hidden />
                천재교육 · 고2 1학기 기말고사
              </div>
              <h1 className="text-[2.75rem] tablet:text-5xl font-black text-cyan-400 glow-cyan chinese-font leading-none tracking-tight">
                中文 暗记
              </h1>
              <p className="text-slate-500 text-xs tablet:text-sm mt-2">
                4장 {CHAPTER_COUNTS[4]} · 5장 {CHAPTER_COUNTS[5]} · 6장 {CHAPTER_COUNTS[6]}
                <span className="text-slate-600 mx-1">|</span>
                <span className="text-slate-400">총 {VOCABULARY.length}단어</span>
              </p>
            </div>

            <div className="home-chapter-row relative">
              {CHAPTER_OPTIONS.map(ch => {
                const count = ch === 0 ? VOCABULARY.length : CHAPTER_COUNTS[ch];
                const active = selectedChapter === ch;
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => onChapterChange(ch)}
                    className={`home-chapter-pill touch-target ${active ? 'is-active' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <span className={`text-xs tablet:text-sm font-bold ${active ? 'text-cyan-300' : ''}`}>
                      {ch === 0 ? '전체' : `${ch}장`}
                    </span>
                    <span className={`text-[0.65rem] tablet:text-xs tabular-nums ${active ? 'text-cyan-400/80' : 'text-slate-600'}`}>
                      {count}개
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="home-progress-card">
            <div className="flex justify-between items-baseline mb-2.5">
              <span className="text-sm tablet:text-base font-semibold text-slate-300">
                학습 진행
                {selectedChapter !== 0 && (
                  <span className="text-cyan-400/90 font-normal ml-1.5 text-xs tablet:text-sm">{selectedChapter}장</span>
                )}
              </span>
              <span className="text-2xl tablet:text-3xl font-black text-cyan-400 tabular-nums leading-none">{pct}<span className="text-base font-bold text-cyan-400/70">%</span></span>
            </div>
            <div className="bg-slate-800/80 rounded-full progress-track mb-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-600 via-cyan-400 to-teal-300 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="home-stats-grid">
              <div className="home-stat-card">
                <span className="text-[0.65rem] tablet:text-xs text-slate-500 uppercase tracking-wide">알았어</span>
                <span className="text-xl tablet:text-2xl font-bold text-green-400 tabular-nums">{filteredKnown}</span>
              </div>
              <div className="home-stat-card">
                <span className="text-[0.65rem] tablet:text-xs text-slate-500 uppercase tracking-wide">다시볼게</span>
                <span className="text-xl tablet:text-2xl font-bold text-red-400 tabular-nums">{filteredWeak}</span>
              </div>
              <div className="home-stat-card">
                <span className="text-[0.65rem] tablet:text-xs text-slate-500 uppercase tracking-wide">남은 단어</span>
                <span className="text-xl tablet:text-2xl font-bold text-slate-300 tabular-nums">{remaining}</span>
              </div>
              <div className="home-stat-card">
                <span className="text-[0.65rem] tablet:text-xs text-slate-500 uppercase tracking-wide">퀴즈</span>
                <span className="text-xl tablet:text-2xl font-bold text-emerald-400 tabular-nums">
                  {quizPct !== null ? `${quizPct}%` : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="home-quote hidden tablet:block">
            <p className="text-sm text-slate-300 chinese-font leading-relaxed">
              我们都要<span className="text-cyan-400 font-bold">保护环境</span>嘛！
            </p>
            <p className="text-xs text-slate-500 mt-1">우리는 모두 환경을 보호해야 하잖아!</p>
          </div>
        </div>

        {/* Right: learning modes */}
        <div className="home-bento-right">
          <button type="button" onClick={() => onGoMode('prelearn')} className="home-featured touch-target-lg">
            <div className="home-featured-icon" aria-hidden>🔑</div>
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[0.65rem] tablet:text-xs px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-200 font-bold mb-1">
                여기서 시작
              </span>
              <p className="text-sm tablet:text-base font-bold text-amber-100 leading-snug">사전학습 · 한자 기초 부수</p>
              <p className="text-xs tablet:text-sm text-slate-400 mt-0.5 leading-snug line-clamp-2">
                부수를 먼저 익히면 단어 암기가 훨씬 쉬워져요
              </p>
            </div>
            <span className="home-mode-chevron" aria-hidden>›</span>
          </button>

          <div className="home-mode-list">
            {HOME_MODE_ORDER.map((key) => {
              const info = MODE_INFO[key];
              const cs = COLOR_STYLES[info.color];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onGoMode(key)}
                  className={`home-mode-card touch-target-lg border ${cs.border} ${cs.bg}`}
                >
                  <div className={`home-mode-icon border ${cs.border} ${cs.bg}`}>{info.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm tablet:text-base font-bold ${cs.text}`}>{info.label}</p>
                    <p className="text-xs tablet:text-sm text-slate-500 mt-0.5 leading-snug truncate">{info.desc}</p>
                  </div>
                  <span className="home-mode-chevron" aria-hidden>›</span>
                </button>
              );
            })}
          </div>

          <div className="home-quote tablet:hidden">
            <p className="text-sm text-slate-300 chinese-font leading-relaxed">
              我们都要<span className="text-cyan-400 font-bold">保护环境</span>嘛！
            </p>
            <p className="text-xs text-slate-500 mt-1">우리는 모두 환경을 보호해야 하잖아!</p>
          </div>

          <div className={timerStarted ? 'w-full' : 'home-actions'}>
            <button
              type="button"
              onClick={onReport}
              className={`home-actions-primary touch-target-lg py-3 border border-slate-700/80 bg-slate-800/60 text-slate-300 text-sm tablet:text-base font-medium ${timerStarted ? 'w-full' : ''}`}
            >
              📊 리포트
            </button>
            {!timerStarted && (
              <button
                type="button"
                onClick={() => onGoMode('prelearn')}
                className="home-actions-primary touch-target-lg py-3 border border-amber-500/50 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-200 text-sm tablet:text-base border-pulse"
              >
                🌟 사전학습 시작
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
