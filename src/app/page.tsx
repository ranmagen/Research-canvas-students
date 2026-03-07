'use client';

import { useState, useEffect } from 'react';
import { AppProvider } from '@/store/app-store';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const [CanvasComponent, setCanvasComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    import('@/components/Canvas').then((mod) => {
      setCanvasComponent(() => mod.default);
    });
  }, []);

  return (
    <AppProvider>
      {CanvasComponent ? (
        <CanvasComponent />
      ) : (
        <div
          className="flex items-center justify-center bg-[var(--color-surface)]"
          style={{ position: 'fixed', inset: 0, right: 380 }}
        >
          <div className="border-3 border-black bg-[var(--color-brutal-yellow)] px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-lg font-black">טוען קאנבס...</span>
          </div>
        </div>
      )}
      <Sidebar />
    </AppProvider>
  );
}
