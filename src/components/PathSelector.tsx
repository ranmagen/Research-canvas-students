'use client';

import { PATH_LIST } from '@/lib/paths';
import { useAppStore } from '@/store/app-store';

export default function PathSelector() {
  const { state, dispatch } = useAppStore();

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">
        בחר/י מסלול למידה
      </h2>
      {PATH_LIST.map((path) => (
        <button
          key={path.id}
          onClick={() => dispatch({ type: 'SET_PATH', path: path.id })}
          className={`w-full text-right p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer
            ${
              state.selectedPath === path.id
                ? 'border-[var(--color-primary)] bg-indigo-50 shadow-sm'
                : 'border-[var(--color-border)] bg-white hover:border-indigo-200 hover:bg-slate-50'
            }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{path.emoji}</span>
            <div>
              <div className="font-semibold text-sm">{path.label}</div>
              <div className="text-xs text-[var(--color-text-secondary)]">
                {path.description}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
