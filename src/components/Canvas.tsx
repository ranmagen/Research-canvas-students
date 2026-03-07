'use client';

import { Tldraw } from 'tldraw';
import { useEditor } from '@/store/app-store';

export default function Canvas() {
  const { setEditor } = useEditor();

  return (
    <div style={{ position: 'fixed', inset: 0, right: 380 }}>
      <Tldraw
        onMount={(editor) => {
          setEditor(editor);
        }}
      />
    </div>
  );
}
