import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { getRadicalHighlightIndices } from '../data/radicals';

interface Props {
  text: string;
  hint?: string;
  chapter?: number;
  className?: string;
  baseColorClass?: string;
  style?: CSSProperties;
}

export default function HighlightedChinese({
  text,
  hint,
  chapter,
  className = '',
  baseColorClass = 'text-cyan-400',
  style,
}: Props) {
  const highlightIndices = useMemo(
    () => getRadicalHighlightIndices(text, hint, chapter),
    [text, hint, chapter],
  );

  return (
    <span className={`chinese-font ${className}`} style={style}>
      {[...text].map((c, i) => (
        <span
          key={`${i}-${c}`}
          className={
            highlightIndices.has(i)
              ? 'text-red-500 font-bold'
              : baseColorClass
          }
          style={
            highlightIndices.has(i)
              ? { textShadow: '0 0 20px rgba(239, 68, 68, 0.65)' }
              : undefined
          }
        >
          {c}
        </span>
      ))}
    </span>
  );
}
