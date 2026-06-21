import { Word } from '../data/vocab';
import WordNoBadge from './WordNoBadge';

interface Props {
  words: Word[];
  knownIds: Set<number>;
  weakIds: Set<number>;
  quizCorrect: number;
  quizTotal: number;
  quizWeakIds: number[];
  onReset: () => void;
  onGoMode: (mode: string) => void;
}

export default function Report({ words, knownIds, weakIds, quizCorrect, quizTotal, quizWeakIds, onReset, onGoMode }: Props) {
  const weakWords = words.filter(w => weakIds.has(w.id) || quizWeakIds.includes(w.id));
  const known = knownIds.size;
  const total = words.length;
  const pct = total > 0 ? Math.round((known / total) * 100) : 0;
  const quizPct = quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : 0;

  const grade = quizTotal > 0
    ? (quizPct >= 90 ? '🏆 완벽해요!' : quizPct >= 70 ? '🎉 잘했어요!' : quizPct >= 50 ? '📚 조금 더 화이팅!' : '💪 반복 학습이 필요해요')
    : (pct >= 80 ? '🎉 훌륭해요!' : '📚 계속 학습해봐요!');

  return (
    <div className="flex flex-col h-full overflow-y-auto screen-pad gap-4 tablet:gap-5 scroll-area">
      {/* Header */}
      <div className="text-center py-2 tablet:py-4">
        <p className="text-2xl tablet:text-3xl font-bold text-white">{grade}</p>
        <p className="text-slate-400 text-sm tablet:text-base mt-1">총 {total}단어</p>
      </div>

      {/* Stats */}
      <div className="report-stats-grid">
        {/* Flashcard stat */}
        <div className="rounded-xl bg-slate-900/80 border border-cyan-900/40 p-4 tablet:p-5">
          <p className="text-xs tablet:text-sm text-slate-500 mb-1">단어 학습</p>
          <p className="text-3xl tablet:text-4xl font-bold text-cyan-400 glow-cyan">{known}<span className="text-lg tablet:text-xl text-slate-500">/{total}</span></p>
          <div className="mt-2 bg-slate-800 rounded-full progress-track">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs tablet:text-sm text-slate-500 mt-1">알았어 {pct}%</p>
        </div>

        {/* Quiz stat */}
        <div className="rounded-xl bg-slate-900/80 border border-green-900/40 p-4 tablet:p-5">
          <p className="text-xs tablet:text-sm text-slate-500 mb-1">퀴즈 결과</p>
          {quizTotal > 0 ? (
            <>
              <p className="text-3xl tablet:text-4xl font-bold text-green-400 glow-green">{quizCorrect}<span className="text-lg tablet:text-xl text-slate-500">/{quizTotal}</span></p>
              <div className="mt-2 bg-slate-800 rounded-full progress-track">
                <div className="bg-green-500 h-full rounded-full" style={{ width: `${quizPct}%` }} />
              </div>
              <p className="text-xs tablet:text-sm text-slate-500 mt-1">정답률 {quizPct}%</p>
            </>
          ) : (
            <p className="text-slate-500 text-sm tablet:text-base mt-2">퀴즈 미실시</p>
          )}
        </div>
      </div>

      <div className="report-columns flex-1 min-h-0">
      {/* Weak words */}
      {weakWords.length > 0 && (
        <div className="rounded-xl bg-slate-900/80 border border-red-900/30 p-4 tablet:p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm tablet:text-base font-bold text-red-400">⚠️ 취약 단어 ({weakWords.length}개)</p>
            <button
              onClick={() => onGoMode('flashcard')}
              className="text-xs tablet:text-sm text-cyan-400 border border-cyan-900/50 px-2 py-1 tablet:px-3 tablet:py-1.5 rounded-lg touch-target"
            >
              다시 학습 →
            </button>
          </div>
          <div className="space-y-2 max-h-48 tablet:max-h-64 landscape:max-h-none overflow-y-auto scroll-area">
            {weakWords.map(w => (
              <div key={w.id} className="flex items-center gap-3 py-2 border-b border-slate-800/60 last:border-0">
                <WordNoBadge word={w} className="w-16 justify-center" />
                <span className="text-xl tablet:text-2xl font-bold text-red-300 chinese-font shrink-0">{w.chinese}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs tablet:text-sm text-purple-300">{w.pinyin}</p>
                  <p className="text-sm tablet:text-base text-slate-300 truncate">{w.korean}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All words list */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-700/40 p-4 tablet:p-5">
        <p className="text-sm tablet:text-base font-bold text-slate-300 mb-3">📋 전체 단어 목록</p>
        <div className="space-y-1.5 max-h-56 tablet:max-h-72 landscape:max-h-none overflow-y-auto scroll-area">
          {words.map(w => (
            <div key={w.id} className="flex items-center gap-2 py-1.5 tablet:py-2 border-b border-slate-800/40 last:border-0">
              <span className={`w-5 h-5 tablet:w-6 tablet:h-6 rounded-full shrink-0 text-xs flex items-center justify-center ${
                knownIds.has(w.id) ? 'bg-green-500/20 text-green-400' : weakIds.has(w.id) ? 'bg-red-500/20 text-red-400' : 'bg-slate-800'
              }`}>
                {knownIds.has(w.id) ? '✓' : weakIds.has(w.id) ? '✗' : ''}
              </span>
              <WordNoBadge word={w} className="min-w-[4.5rem] justify-center" />
              <span className="text-lg tablet:text-xl font-bold text-cyan-300 chinese-font w-12 shrink-0">{w.chinese}</span>
              <span className="text-xs tablet:text-sm text-purple-300 w-20 shrink-0">{w.pinyin}</span>
              <span className="text-xs tablet:text-sm text-slate-300 flex-1 truncate">{w.korean}</span>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 pb-4 shrink-0">
        <button
          onClick={() => onGoMode('quiz')}
          className="touch-target-lg py-4 tablet:py-5 rounded-xl border border-green-500/50 bg-green-500/10 text-green-300 font-bold text-base tablet:text-lg"
        >
          🧠 퀴즈 다시 풀기
        </button>
        <button
          onClick={onReset}
          className="touch-target-lg py-3 tablet:py-4 rounded-xl border border-slate-700 text-slate-400 text-sm tablet:text-base"
        >
          🔄 학습 기록 초기화
        </button>
      </div>
    </div>
  );
}
