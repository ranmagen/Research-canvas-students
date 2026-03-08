import { CanvasNote } from '@/types';

const NOTE_BG_COLORS: Record<string, string> = {
  yellow: '#FFF9DB',
  blue: '#D0EBFF',
  green: '#D3F9D8',
  'light-violet': '#E8DAFB',
  orange: '#FFE8CC',
};

function randomId(): string {
  return Math.random().toString(36).slice(2, 12);
}

export interface CanvasAPI {
  getNotes: () => CanvasNote[];
  addNote: (note: CanvasNote) => void;
}

function calculateNextPosition(notes: CanvasNote[]): { x: number; y: number } {
  const cols = 3;
  const spacingX = 320;
  const spacingY = 280;
  const startX = 80;
  const startY = 80;

  const index = notes.length;
  const col = index % cols;
  const row = Math.floor(index / cols);

  return {
    x: startX + col * spacingX,
    y: startY + row * spacingY,
  };
}

export function addShapeToCanvas(
  api: CanvasAPI,
  text: string,
  title: string,
  color: string = 'yellow'
) {
  try {
    const notes = api.getNotes();
    const pos = calculateNextPosition(notes);

    api.addNote({
      id: randomId(),
      x: pos.x,
      y: pos.y,
      title,
      text,
      color,
    });
  } catch (err) {
    console.error('Failed to add shape to canvas:', err);
  }
}

export function getAllCanvasText(api: CanvasAPI): string {
  const notes = api.getNotes();
  if (notes.length === 0) return '';

  return notes
    .map((n) => `${n.title}\n\n${n.text}`)
    .join('\n\n---\n\n');
}

export async function exportCanvasAsImage(api: CanvasAPI): Promise<void> {
  const notes = api.getNotes();
  if (notes.length === 0) return;

  // Use html2canvas approach: capture the canvas container
  const canvasEl = document.querySelector('[data-canvas="true"]')?.parentElement;
  if (!canvasEl) return;

  // Dynamic import to avoid SSR
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(canvasEl as HTMLElement, {
    backgroundColor: '#f8f8f8',
    scale: 2,
  });

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mind-canvas.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
