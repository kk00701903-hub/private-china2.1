import { Word } from '../data/vocab';

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
    <div className="flex flex-col h-full overflow-y-auto p-4 gap-4 scroll-area">
      {/* Header */}
      <div className="text-center py-2">
        <p className="text-2xl font-bold text-white">{grade}</p>
        <p className="text-slate-400 text-sm mt-1">천재교육 5장 · 총 {total}단어</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {/* Flashcard stat */}
        <div className="rounded-xl bg-slate-900/80 border border-cyan-900/40 p-4">
          <p className="text-xs text-slate-500 mb-1">단어 학습</p>
          <p className="text-3xl font-bold text-cyan-400 glow-cyan">{known}<span className="text-lg text-slate-500">/{total}</span></p>
          <div className="mt-2 bg-slate-800 rounded-full h-1.5">
            <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-1">알았어 {pct}%</p>
        </div>

        {/* Quiz stat */}
        <div className="rounded-xl bg-slate-900/80 border border-green-900/40 p-4">
          <p className="text-xs text-slate-500 mb-1">퀴즈 결과</p>
          {quizTotal > 0 ? (
            <>
              <p className="text-3xl font-bold text-green-400 glow-green">{quizCorrect}<span className="text-lg text-slate-500">/{quizTotal}</span></p>
              <div className="mt-2 bg-slate-800 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${quizPct}%` }} />
              </div>
              <p className="text-xs text-slate-500 mt-1">정답률 {quizPct}%</p>
            </>
          ) : (
            <p className="text-slate-500 text-sm mt-2">퀴즈 미실시</p>
          )}
        </div>
      </div>

      {/* Weak words */}
      {weakWords.length > 0 && (
        <div className="rounded-xl bg-slate-900/80 border border-red-900/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-red-400">⚠️ 취약 단어 ({weakWords.length}개)</p>
            <button
              onClick={() => onGoMode('flashcard')}
              className="text-xs text-cyan-400 border border-cyan-900/50 px-2 py-1 rounded-lg"
            >
              다시 학습 →
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto scroll-area">
            {weakWords.map(w => (
              <div key={w.id} className="flex items-center gap-3 py-2 border-b border-slate-800/60 last:border-0">
                <span className="text-xl font-bold text-red-300 chinese-font w-16 shrink-0">{w.chinese}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-purple-300">{w.pinyin}</p>
                  <p className="text-sm text-slate-300 truncate">{w.korean}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All words list */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-700/40 p-4">
        <p className="text-sm font-bold text-slate-300 mb-3">📋 전체 단어 목록</p>
        <div className="space-y-1.5 max-h-56 overflow-y-auto scroll-area">
          {words.map(w => (
            <div key={w.id} className="flex items-center gap-2 py-1.5 border-b border-slate-800/40 last:border-0">
              <span className={`w-4 h-4 rounded-full shrink-0 text-xs flex items-center justify-center ${
                knownIds.has(w.id) ? 'bg-green-500/20 text-green-400' : weakIds.has(w.id) ? 'bg-red-500/20 text-red-400' : 'bg-slate-800'
              }`}>
                {knownIds.has(w.id) ? '✓' : weakIds.has(w.id) ? '✗' : ''}
              </span>
              <span className="text-lg font-bold text-cyan-300 chinese-font w-12 shrink-0">{w.chinese}</span>
              <span className="text-xs text-purple-300 w-20 shrink-0">{w.pinyin}</span>
              <span className="text-xs text-slate-300 flex-1 truncate">{w.korean}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 pb-4">
        <button
          onClick={() => onGoMode('quiz')}
          className="py-4 rounded-xl border border-green-500/50 bg-green-500/10 text-green-300 font-bold"
        >
          🧠 퀴즈 다시 풀기
        </button>
        <button
          onClick={onReset}
          className="py-3 rounded-xl border border-slate-700 text-slate-400 text-sm"
        >
          🔄 학습 기록 초기화
        </button>
      </div>
    </div>
  );
}
