'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCanvasAPI } from '@/store/app-store';
import { CanvasNote } from '@/types';
import { X } from 'lucide-react';

const NOTE_BG: Record<string, string> = {
  yellow: '#FFF9DB',
  blue: '#D0EBFF',
  green: '#D3F9D8',
  'light-violet': '#E8DAFB',
  orange: '#FFE8CC',
};

function StickyNote({
  note,
  onDragEnd,
  onRemove,
  scale,
}: {
  note: CanvasNote;
  onDragEnd: (id: string, x: number, y: number) => void;
  onRemove: (id: string) => void;
  scale: number;
}) {
  const bg = NOTE_BG[note.color] || NOTE_BG.yellow;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(_e, info) => {
        onDragEnd(note.id, note.x + info.offset.x / scale, note.y + info.offset.y / scale);
      }}
      style={{
        position: 'absolute',
        left: note.x,
        top: note.y,
        width: 280,
        minHeight: 160,
        backgroundColor: bg,
        cursor: 'grab',
        zIndex: 10,
      }}
      className="border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] select-none"
      whileDrag={{ cursor: 'grabbing', scale: 1.03 }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b-3 border-black px-3 py-2 bg-black/5">
        <span className="text-sm font-black truncate flex-1" dir="rtl">
          {note.title}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(note.id);
          }}
          className="w-6 h-6 flex items-center justify-center hover:bg-black/10 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" strokeWidth={3} />
        </button>
      </div>
      {/* Body */}
      <div className="p-3">
        <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap" dir="rtl">
          {note.text}
        </p>
      </div>
    </motion.div>
  );
}

export default function Canvas() {
  const { notes, updateNotePosition, removeNote } = useCanvasAPI();
  const containerRef = useRef<HTMLDivElement>(null);

  // Panning state
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only pan on middle-click or when clicking the background directly
      if (e.button === 1 || e.target === e.currentTarget || (e.target as HTMLElement).dataset.canvas) {
        isPanning.current = true;
        panStart.current = { x: e.clientX, y: e.clientY };
        offsetStart.current = { ...offset };
        e.preventDefault();
      }
    },
    [offset]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setOffset({
      x: offsetStart.current.x + dx,
      y: offsetStart.current.y + dy,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setScale((s) => Math.min(2, Math.max(0.3, s + delta)));
  }, []);

  const handleDragEnd = useCallback(
    (id: string, x: number, y: number) => {
      updateNotePosition(id, x, y);
    },
    [updateNotePosition]
  );

  // Dot pattern background via CSS
  const dotSize = 1.5;
  const dotSpacing = 24;
  const dotColor = '#c0c0c0';

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, right: 380, overflow: 'hidden' }}
      className="bg-[#f8f8f8]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Dot background */}
      <div
        data-canvas="true"
        style={{
          position: 'absolute',
          inset: -200,
          backgroundImage: `radial-gradient(circle, ${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
          backgroundSize: `${dotSpacing}px ${dotSpacing}px`,
          backgroundPosition: `${offset.x % dotSpacing}px ${offset.y % dotSpacing}px`,
          pointerEvents: 'none',
        }}
      />

      {/* Canvas surface */}
      <div
        data-canvas="true"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          position: 'absolute',
          inset: 0,
        }}
      >
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onDragEnd={handleDragEnd}
            onRemove={removeNote}
            scale={scale}
          />
        ))}
      </div>

      {/* Empty state */}
      {notes.length === 0 && (
        <div className="absolute inset-0 right-0 flex items-center justify-center pointer-events-none">
          <div className="text-center opacity-40">
            <p className="text-4xl mb-2">🧠</p>
            <p className="text-lg font-black">הקאנבס שלך ריק</p>
            <p className="text-sm font-medium mt-1">בחר/י מסלול בסרגל הצד והתחל/י לחקור</p>
          </div>
        </div>
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 border-2 border-black bg-white px-2 py-1 text-xs font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
}
