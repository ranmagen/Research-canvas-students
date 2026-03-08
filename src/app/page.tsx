'use client';

import { AppProvider } from '@/store/app-store';
import Sidebar from '@/components/Sidebar';
import Canvas from '@/components/Canvas';

export default function Home() {
  return (
    <AppProvider>
      <Canvas />
      <Sidebar />
    </AppProvider>
  );
}
