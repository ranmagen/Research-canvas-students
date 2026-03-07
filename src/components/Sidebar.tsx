'use client';

import { useAppStore } from '@/store/app-store';
import PathSelector from './PathSelector';
import ActionButtons from './ActionButtons';
import InteractionPanel from './InteractionPanel';
import ExportControls from './ExportControls';

export default function Sidebar() {
  const { state, dispatch } = useAppStore();

  return (
    <aside dir="rtl" className="fixed top-0 right-0 w-[360px] h-screen bg-white border-l-2 border-[var(--color-border)] flex flex-col overflow-hidden z-10">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)] bg-gradient-to-l from-indigo-50 to-white">
        <h1 className="text-lg font-bold text-[var(--color-primary-dark)]">
          🧠 Mind Canvas
        </h1>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
          משטח חקר חכם
        </p>
      </div>

      {/* Topic input */}
      <div className="p-4 border-b border-[var(--color-border)]">
        <label className="text-sm font-semibold text-[var(--color-text-secondary)] block mb-2">
          מה הנושא שלך?
        </label>
        <input
          dir="rtl"
          type="text"
          value={state.topic}
          onChange={(e) => dispatch({ type: 'SET_TOPIC', topic: e.target.value })}
          placeholder="למשל: מלחמת העולם השנייה, אפליקציה חברתית..."
          className="w-full border border-[var(--color-border)] rounded-lg p-2 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
        />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <PathSelector />

        {state.selectedPath && (
          <>
            <ActionButtons />
            <InteractionPanel />
          </>
        )}
      </div>

      {/* Export at bottom */}
      <div className="p-4 border-t border-[var(--color-border)] bg-slate-50">
        <ExportControls />
      </div>
    </aside>
  );
}
