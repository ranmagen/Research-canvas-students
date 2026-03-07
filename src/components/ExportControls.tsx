'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { exportCanvasAsImage, getAllCanvasText } from '@/lib/canvas-utils';

export default function ExportControls() {
  const { editor, state } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handleExportImage = async () => {
    if (!editor) return;
    try {
      await exportCanvasAsImage(editor);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleReflectionReport = async () => {
    setIsGenerating(true);
    setReport(null);
    try {
      const canvasText = editor ? getAllCanvasText(editor) : '';
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canvasText,
          actionsUsed: [...state.actionsUsed],
        }),
      });
      const data = await res.json();
      setReport(data.report || '');
    } catch (err) {
      console.error('Report generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = () => {
    if (!report) return;
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reflection-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

      <button
        onClick={handleReflectionReport}
        disabled={isGenerating}
        className="w-full border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-lg py-2 text-sm font-medium hover:bg-indigo-100 disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <span>📝</span>
        <span>{isGenerating ? 'מייצר דוח...' : 'דוח רפלקציה'}</span>
      </button>

      {report && (
        <div className="bg-white border border-[var(--color-border)] rounded-lg p-3 max-h-48 overflow-y-auto">
          <p className="text-xs whitespace-pre-wrap leading-relaxed" dir="rtl">
            {report}
          </p>
          <button
            onClick={handleDownloadReport}
            className="mt-2 w-full border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] rounded py-1 text-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            ⬇️ הורד דוח
          </button>
        </div>
      )}
    </div>
  );
}
