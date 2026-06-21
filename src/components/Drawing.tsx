import { useState, useRef, useEffect, useCallback } from 'react';
import type { PointerEvent } from 'react';
import { Word } from '../data/vocab';

interface Props {
  words: Word[];
  onBack: () => void;
}

export default function Drawing({ words, onBack }: Props) {
  const [idx, setIdx] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [drawn, setDrawn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });

  const word = words[idx];

  const drawGuide = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = '#0D1B2A';
    ctx.fillRect(0, 0, w, h);

    // Grid lines (십자 + 대각)
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.moveTo(0, 0);
    ctx.lineTo(w, h);
    ctx.moveTo(w, 0);
    ctx.lineTo(0, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Border
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, w - 4, h - 4);

    // Guide character
    if (showGuide) {
      const fontSize = Math.min(w, h) * 0.72;
      ctx.font = `${fontSize}px "Noto Sans SC", "Microsoft YaHei", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(168, 85, 247, 0.18)';
      ctx.fillText(word.chinese, w / 2, h / 2);
    }
  }, [word, showGuide]);

  useEffect(() => {
    drawGuide();
    setDrawn(false);
  }, [drawGuide]);

  const getPos = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    setDrawn(true);
    const pos = getPos(e);
    lastPos.current = pos;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = e.pointerType === 'touch' ? 5 : 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(0, 245, 255, 0.5)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    lastPos.current = pos;
  };

  const handlePointerUp = (e: PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.shadowBlur = 0;
    }
  };

  const handleClear = () => {
    drawGuide();
    setDrawn(false);
  };

  const handleNext = () => {
    if (idx < words.length - 1) {
      setIdx(i => i + 1);
    } else {
      setIdx(0);
    }
    setIsDrawing(false);
  };

  const handleToggleGuide = () => {
    setShowGuide(g => !g);
  };

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-slate-800 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((idx + 1) / words.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-slate-400">{idx + 1}/{words.length}</span>
      </div>

      {/* Word info */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-2xl font-bold text-cyan-400 chinese-font glow-cyan mr-3">{word.chinese}</span>
          <span className="text-purple-300 text-sm">{word.pinyin}</span>
        </div>
        <span className="text-white font-medium text-sm">{word.korean}</span>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center canvas-container">
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="w-full max-w-xs aspect-square rounded-2xl cursor-crosshair"
          style={{ touchAction: 'none', maxHeight: '55vw' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>

      {/* Hint */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-700/50 p-3 space-y-1">
        <p className="text-xs text-cyan-300/80">
          <span className="text-cyan-500 font-bold">🔑</span> {word.hint}
        </p>
        <p className="text-xs text-amber-300/80 italic">
          <span className="text-amber-400 font-bold not-italic">💡</span> {word.memory}
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleToggleGuide}
          className={`py-3 rounded-xl border text-sm font-medium transition-all ${
            showGuide
              ? 'border-purple-500/60 bg-purple-500/15 text-purple-300'
              : 'border-slate-700 bg-slate-800/50 text-slate-400'
          }`}
        >
          {showGuide ? '👁 가이드 숨기기' : '👁 가이드 보기'}
        </button>
        <button
          onClick={handleClear}
          className="py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-300 text-sm font-medium"
        >
          🗑 지우기
        </button>
        <button
          onClick={handleNext}
          className={`py-3 rounded-xl border text-sm font-bold transition-all ${
            drawn
              ? 'border-cyan-500/60 bg-cyan-500/15 text-cyan-300'
              : 'border-slate-700 bg-slate-800/50 text-slate-400'
          }`}
        >
          {idx < words.length - 1 ? '다음 →' : '처음으로 ↺'}
        </button>
      </div>
    </div>
  );
}
