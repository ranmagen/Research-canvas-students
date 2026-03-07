'use client';

import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { useAppStore } from '@/store/app-store';

export default function Canvas() {
  const { setEditor } = useAppStore();

  return (
    <div className="flex-1 h-screen">
      <Tldraw
        onMount={(editor) => {
          setEditor(editor);
        }}
      />
    </div>
  );
}
