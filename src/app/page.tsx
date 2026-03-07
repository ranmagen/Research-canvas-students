'use client';

import dynamic from 'next/dynamic';
import { AppProvider } from '@/store/app-store';
import Sidebar from '@/components/Sidebar';

const Canvas = dynamic(() => import('@/components/Canvas'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 left-0 right-[360px] flex items-center justify-center bg-slate-100">
      <div className="text-[var(--color-text-secondary)]">טוען קאנבס...</div>
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
