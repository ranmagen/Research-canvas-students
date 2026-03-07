'use client';

import { useAppStore } from '@/store/app-store';
import { Sparkles } from 'lucide-react';
import PathSelector from './PathSelector';
import ActionButtons from './ActionButtons';
import InteractionPanel from './InteractionPanel';
import ExportControls from './ExportControls';

export default function Sidebar() {
  const { state, dispatch } = useAppStore();

  return (
    <aside
      dir="rtl"
      className="fixed top-0 right-0 w-[380px] h-screen bg-[var(--color-surface)] border-l-4 border-black flex flex-col overflow-hidden z-10"
    >
      {/* Header - Sticker style */}
      <div className="p-5 border-b-4 border-black bg-[var(--color-brutal-yellow)] relative">
        <div className="flex items-center gap-3">
          <div className="brutal-badge bg-white">
            <Sparkles className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">
              Mind Canvas
            </h1>
            <p className="text-xs font-bold text-gray-700 mt-0.5">
              משטח חקר חכם
            </p>
          </div>
        </div>
      </div>

      {/* Topic input */}
      <div className="p-4 border-b-4 border-black bg-white">
        <label className="text-sm font-black block mb-2">
          מה הנושא שלך?
        </label>
        <input
          dir="rtl"
          type="text"
          value={state.topic}
          onChange={(e) => dispatch({ type: 'SET_TOPIC', topic: e.target.value })}
          placeholder="למשל: מלחמת העולם השנייה, אפליקציה חברתית..."
          className="w-full border-3 border-black rounded-none p-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brutal-cyan)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
        />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 brutal-scroll">
        <PathSelector />

        {state.selectedPath && (
          <>
            <ActionButtons />
            <InteractionPanel />
          </>
        )}
      </div>

      {/* Export at bottom */}
      <div className="p-4 border-t-4 border-black bg-white">
        <ExportControls />
      </div>
    </aside>
  );
}
