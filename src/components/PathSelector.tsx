'use client';

import { PATH_LIST } from '@/lib/paths';
import { useAppStore } from '@/store/app-store';
import { Search, Rocket, Brain } from 'lucide-react';
import { PathId } from '@/types';

const PATH_ICONS: Record<PathId, React.ReactNode> = {
  research: <Search className="w-5 h-5" strokeWidth={2.5} />,
  entrepreneurship: <Rocket className="w-5 h-5" strokeWidth={2.5} />,
  deepdive: <Brain className="w-5 h-5" strokeWidth={2.5} />,
};

const PATH_COLORS: Record<PathId, string> = {
  research: 'bg-[var(--color-brutal-cyan)]',
  entrepreneurship: 'bg-[var(--color-brutal-green)]',
  deepdive: 'bg-[var(--color-brutal-purple)]',
};

export default function PathSelector() {
  const { state, dispatch } = useAppStore();

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-black uppercase tracking-wide">
        בחר/י מסלול למידה
      </h2>
      {PATH_LIST.map((path) => {
        const isSelected = state.selectedPath === path.id;
        const bgColor = PATH_COLORS[path.id];

        return (
          <button
            key={path.id}
            onClick={() => dispatch({ type: 'SET_PATH', path: path.id })}
            className={`brutal-btn w-full text-right p-3 border-3 border-black cursor-pointer relative doodle-corners
              ${isSelected
                ? `${bgColor} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]`
                : 'bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]'
              } transition-all`}
          >
            <div className="flex items-center gap-3">
              <div className={`brutal-badge ${isSelected ? 'bg-white' : bgColor}`}>
                {PATH_ICONS[path.id]}
              </div>
              <div>
                <div className="font-black text-sm">{path.label}</div>
                <div className="text-xs font-medium text-gray-700">
                  {path.description}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
