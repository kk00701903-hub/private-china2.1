import type { Word } from './vocab';
import {
  EXPECTED_EXAM_POOL,
  type ExpectedExamQuestion,
  type ExamQType,
} from './expectedExamQuestions';

const TYPE_TARGETS: Record<ExamQType, number> = {
  pinyin: 3,
  meaning: 3,
  category: 2,
  dialogue: 2,
};

const TOTAL = 10;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function isValidForWords(q: ExpectedExamQuestion, wordIds: Set<number>): boolean {
  return q.relatedWordIds.every((id) => wordIds.has(id));
}

function pickByType(
  pool: ExpectedExamQuestion[],
  type: ExamQType,
  count: number,
  used: Set<string>,
  preferChapter?: number,
): ExpectedExamQuestion[] {
  let candidates = pool.filter((q) => q.type === type && !used.has(q.id));
  if (preferChapter != null) {
    const chFirst = candidates.filter((q) => q.chapter === preferChapter);
    if (chFirst.length >= count) candidates = chFirst;
  }
  const picked = shuffle(candidates).slice(0, count);
  picked.forEach((q) => used.add(q.id));
  return picked;
}

/** 전체 모드: 장별 균형 (4·5·6 각 최소 2문항 목표) */
function selectBalancedAll(valid: ExpectedExamQuestion[]): ExpectedExamQuestion[] {
  const used = new Set<string>();
  const result: ExpectedExamQuestion[] = [];
  const chapters: (4 | 5 | 6)[] = [4, 5, 6];

  for (const type of Object.keys(TYPE_TARGETS) as ExamQType[]) {
    const need = TYPE_TARGETS[type];
    const typePool = valid.filter((q) => q.type === type && !used.has(q.id));
    const byChapter = shuffle(chapters);
    let picked = 0;
    for (const ch of byChapter) {
      if (picked >= need) break;
      const chQs = shuffle(typePool.filter((q) => q.chapter === ch && !used.has(q.id)));
      if (chQs.length > 0) {
        result.push(chQs[0]);
        used.add(chQs[0].id);
        picked++;
      }
    }
    const remaining = shuffle(typePool.filter((q) => !used.has(q.id))).slice(0, need - picked);
    remaining.forEach((q) => {
      result.push(q);
      used.add(q.id);
    });
  }

  return shuffle(result).slice(0, TOTAL);
}

/** 단일 장 모드 */
function selectSingleChapter(valid: ExpectedExamQuestion[], chapter: 4 | 5 | 6): ExpectedExamQuestion[] {
  const chPool = valid.filter((q) => q.chapter === chapter);
  const used = new Set<string>();
  const result: ExpectedExamQuestion[] = [];

  for (const type of Object.keys(TYPE_TARGETS) as ExamQType[]) {
    const need = TYPE_TARGETS[type];
    const picked = pickByType(chPool, type, need, used);
    result.push(...picked);
  }

  return shuffle(result).slice(0, TOTAL);
}

export function selectExpectedExam(words: Word[]): ExpectedExamQuestion[] {
  const wordIds = new Set(words.map((w) => w.id));
  const valid = EXPECTED_EXAM_POOL.filter((q) => isValidForWords(q, wordIds));

  if (valid.length < 8) return [];

  const chapters = [...new Set(words.map((w) => w.chapter))].filter(
    (c): c is 4 | 5 | 6 => c === 4 || c === 5 || c === 6,
  );

  if (chapters.length === 1) {
    return selectSingleChapter(valid, chapters[0]);
  }

  return selectBalancedAll(valid);
}

export { TOTAL as EXPECTED_EXAM_TOTAL };
