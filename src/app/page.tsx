'use client';

import dynamic from 'next/dynamic';
import { AppProvider } from '@/store/app-store';
import Sidebar from '@/components/Sidebar';

const Canvas = dynamic(() => import('@/components/Canvas'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 h-screen flex items-center justify-center bg-slate-100">
      <div className="text-[var(--color-text-secondary)]">טוען קאנבס...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <AppProvider>
      <div className="flex h-screen w-screen overflow-hidden" dir="rtl">
        <Sidebar />
        <Canvas />
      </div>
    </AppProvider>
  );
}
