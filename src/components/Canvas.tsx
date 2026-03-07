'use client';

import React, { useCallback } from 'react';
import { Tldraw, Editor } from 'tldraw';
import 'tldraw/tldraw.css';
import { useEditor } from '@/store/app-store';

function Canvas() {
  const { setEditor } = useEditor();

  const handleMount = useCallback(
    (editor: Editor) => {
      setEditor(editor);
    },
    [setEditor],
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 360,
      }}
    >
      <Tldraw onMount={handleMount} />
    </div>
  );
}

export default React.memo(Canvas);
