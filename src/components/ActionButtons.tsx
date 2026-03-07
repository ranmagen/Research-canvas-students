'use client';

import { PATHS } from '@/lib/paths';
import { useAppStore } from '@/store/app-store';

export default function ActionButtons() {
  const { state, dispatch } = useAppStore();

  if (!state.selectedPath) return null;

  const path = PATHS[state.selectedPath];

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">
        כלי חקר
      </h2>
      {path.actions.map((action) => {
        const isUsed = state.actionsUsed.has(action.id);
        const isActive = state.activeAction === action.id;

        return (
          <button
            key={action.id}
            onClick={() => dispatch({ type: 'SET_ACTION', action: action.id })}
            className={`w-full text-right p-2.5 rounded-lg border transition-all duration-200 cursor-pointer flex items-center gap-2
              ${
                isActive
                  ? 'border-[var(--color-primary)] bg-indigo-50 shadow-sm'
                  : isUsed
                  ? 'border-green-200 bg-green-50 hover:border-green-300'
                  : 'border-[var(--color-border)] bg-white hover:border-indigo-200 hover:bg-slate-50'
              }`}
          >
            <span className="text-lg">{action.emoji}</span>
            <span className="text-sm font-medium flex-1">{action.label}</span>
            {isUsed && <span className="text-green-500 text-xs">✓</span>}
          </button>
        );
      })}

      {/* Joker Button */}
      <div className="pt-2 border-t border-[var(--color-border)]">
        <button
          onClick={() => dispatch({ type: 'SET_ACTION', action: null })}
          className="w-full text-right p-2.5 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 hover:bg-amber-100 transition-all duration-200 cursor-pointer flex items-center gap-2 joker-button"
          data-joker="true"
        >
          <span className="text-lg">🃏</span>
          <span className="text-sm font-bold text-amber-700">מה חסר לי?</span>
        </button>
      </div>
    </div>
  );
}
