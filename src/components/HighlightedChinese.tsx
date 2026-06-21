import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { getRadicalHighlightIndices } from '../data/radicals';

interface Props {
  text: string;
  hint?: string;
  className?: string;
  baseColorClass?: string;
  style?: CSSProperties;
}

export default function HighlightedChinese({
  text,
  hint,
  className = '',
  baseColorClass = 'text-cyan-400',
  style,
}: Props) {
  const highlightIndices = useMemo(
    () => getRadicalHighlightIndices(text, hint),
    [text, hint],
  );

  return (
    <span className={`chinese-font ${className}`} style={style}>
      {[...text].map((c, i) => (
        <span
          key={`${i}-${c}`}
          className={
            highlightIndices.has(i)
              ? 'text-red-500'
              : baseColorClass
          }
          style={
            highlightIndices.has(i)
              ? { textShadow: '0 0 20px rgba(239, 68, 68, 0.55)' }
              : undefined
          }
        >
          {c}
        </span>
      ))}
    </span>
  );
}
