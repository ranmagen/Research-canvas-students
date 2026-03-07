'use client';

import React from 'react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { useEditor } from '@/store/app-store';

function Canvas() {
  const { setEditor } = useEditor();

  return (
    <div
      className="fixed inset-0 right-[360px]"
      dir="ltr"
    >
      <Tldraw
        onMount={(editor) => {
          setEditor(editor);
        }}
      />
    </div>
  );
}

export default React.memo(Canvas);
