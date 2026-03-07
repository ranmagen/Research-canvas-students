'use client';

import { PATHS } from '@/lib/paths';
import { useAppStore } from '@/store/app-store';
import { Wrench, Check, Zap } from 'lucide-react';

export default function ActionButtons() {
  const { state, dispatch } = useAppStore();

  if (!state.selectedPath) return null;

  const path = PATHS[state.selectedPath];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="brutal-badge bg-[var(--color-brutal-orange)] w-8 h-8">
          <Wrench className="w-4 h-4" strokeWidth={2.5} />
        </div>
        <h2 className="text-sm font-black uppercase tracking-wide">
          כלי חקר
        </h2>
      </div>

      {path.actions.map((action) => {
        const isUsed = state.actionsUsed.has(action.id);
        const isActive = state.activeAction === action.id;

        return (
          <button
            key={action.id}
            onClick={() => dispatch({ type: 'SET_ACTION', action: action.id })}
            className={`brutal-btn w-full text-right p-2.5 border-3 border-black cursor-pointer flex items-center gap-2
              ${isActive
                ? 'bg-[var(--color-brutal-yellow)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]'
                : isUsed
                  ? 'bg-[var(--color-brutal-green)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]'
              } transition-all`}
          >
            <span className="text-lg">{action.emoji}</span>
            <span className="text-sm font-bold flex-1">{action.label}</span>
            {isUsed && (
              <div className="w-6 h-6 bg-white border-2 border-black rounded-full flex items-center justify-center">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
            )}
          </button>
        );
      })}

      {/* Joker Button */}
      <div className="pt-3 mt-3 border-t-3 border-black">
        <button
          onClick={() => dispatch({ type: 'SET_ACTION', action: null })}
          className="brutal-btn w-full text-right p-3 border-3 border-black bg-[var(--color-brutal-pink)] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <div className="brutal-badge bg-[var(--color-brutal-yellow)] w-8 h-8">
            <Zap className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-black">מה חסר לי?</span>
        </button>
      </div>
    </div>
  );
}
