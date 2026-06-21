import type { Word } from '../data/vocab';

interface Props {
  word: Word;
  className?: string;
}

export default function WordNoBadge({ word, className = '' }: Props) {
  if (word.no == null || (word.chapter !== 4 && word.chapter !== 5 && word.chapter !== 6)) return null;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 tablet:px-3 tablet:py-1 rounded-full bg-cyan-500/10 border border-cyan-500/35 text-cyan-300 text-xs tablet:text-sm font-semibold shrink-0 ${className}`}
    >
      {word.chapter}장 {word.no}번
    </span>
  );
}
