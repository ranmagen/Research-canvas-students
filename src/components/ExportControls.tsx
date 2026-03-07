'use client';

import { useAppStore } from '@/store/app-store';
import { exportCanvasAsImage } from '@/lib/canvas-utils';

export default function ExportControls() {
  const { editor } = useAppStore();

  const handleExportImage = async () => {
    if (!editor) return;
    try {
      await exportCanvasAsImage(editor);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleExportImage}
        disabled={!editor}
        className="w-full border border-[var(--color-border)] bg-white text-[var(--color-text)] rounded-lg py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <span>🖼️</span>
        <span>ייצוא כתמונה</span>
      </button>
    </div>
  );
}
