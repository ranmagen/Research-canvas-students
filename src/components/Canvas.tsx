'use client';

import { useState, useEffect } from 'react';
import { useCanvasAPI } from '@/store/app-store';

export default function Canvas() {
  const { setCanvasAPI } = useCanvasAPI();
  const [Comp, setComp] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import('@excalidraw/excalidraw').then((mod) => {
      setComp(() => mod.Excalidraw);
    });
  }, []);

  if (!Comp) {
    return (
      <div
        className="flex items-center justify-center bg-[var(--color-surface)]"
        style={{ position: 'fixed', inset: 0, right: 380 }}
      >
        <div className="border-3 border-black bg-[var(--color-brutal-yellow)] px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-lg font-black">טוען קאנבס...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, right: 380 }}>
      <Comp
        excalidrawAPI={(api: any) => setCanvasAPI(api)}
        theme="light"
        langCode="en"
        UIOptions={{
          canvasActions: {
            loadScene: false,
          },
        }}
      />
    </div>
  );
}
