'use client';

import dynamic from 'next/dynamic';
import { AppProvider } from '@/store/app-store';
import Sidebar from '@/components/Sidebar';

const Canvas = dynamic(() => import('@/components/Canvas'), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center bg-[var(--color-surface)]"
      style={{ position: 'fixed', top: 0, left: 0, bottom: 0, right: 380 }}
    >
      <div className="border-3 border-black bg-[var(--color-brutal-yellow)] px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <span className="text-lg font-black">טוען קאנבס...</span>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <AppProvider>
      <Canvas />
      <Sidebar />
    </AppProvider>
  );
}
