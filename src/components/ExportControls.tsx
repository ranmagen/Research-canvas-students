'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { exportCanvasAsImage, getAllCanvasText } from '@/lib/canvas-utils';
import { Image, FileText, Download, Loader2 } from 'lucide-react';

export default function ExportControls() {
  const { getCanvasAPI, state } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handleExportImage = async () => {
    const editor = getCanvasAPI();
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
      const editor = getCanvasAPI();
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
        className="brutal-btn w-full bg-white text-black border-3 border-black p-2.5 text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-2"
      >
        <Image className="w-4 h-4" strokeWidth={2.5} />
        <span>ייצוא כתמונה</span>
      </button>

      <button
        onClick={handleReflectionReport}
        disabled={isGenerating}
        className="brutal-btn w-full bg-[var(--color-brutal-purple)] text-black border-3 border-black p-2.5 text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" strokeWidth={2.5} />
        )}
        <span>{isGenerating ? 'מייצר דוח...' : 'דוח רפלקציה'}</span>
      </button>

      {report && (
        <div className="border-3 border-black bg-[var(--color-brutal-yellow)] p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-medium whitespace-pre-wrap leading-relaxed" dir="rtl">
            {report}
          </p>
          <button
            onClick={handleDownloadReport}
            className="brutal-btn mt-2 w-full bg-white text-black border-3 border-black p-1.5 text-xs font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-1"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>הורד דוח</span>
          </button>
        </div>
      )}
    </div>
  );
}
