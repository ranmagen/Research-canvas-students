'use client';

import React from 'react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { useEditor } from '@/store/app-store';

function Canvas() {
  const { setEditor } = useEditor();

  return (
    <div className="flex-1 h-screen min-w-0" dir="ltr">
      <Tldraw
        onMount={(editor) => {
          setEditor(editor);
        }}
      />
    </div>
  );
}

export default React.memo(Canvas);
