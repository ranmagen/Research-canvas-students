// Excalidraw API type (imported dynamically to avoid SSR issues)
type ExcalidrawAPI = {
  getSceneElements: () => readonly any[];
  getAppState: () => any;
  getFiles: () => any;
  updateScene: (scene: any) => void;
  scrollToContent: (target?: any, opts?: any) => void;
};

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

function calculateNextPosition(api: ExcalidrawAPI): { x: number; y: number } {
  const elements = api.getSceneElements().filter((el: any) => !el.isDeleted);
  const cols = 3;
  const spacingX = 320;
  const spacingY = 280;
  const startX = 50;
  const startY = 50;

  const index = elements.length;
  const col = index % cols;
  const row = Math.floor(index / cols);

  return {
    x: startX + col * spacingX,
    y: startY + row * spacingY,
  };
}

export function addShapeToCanvas(
  api: ExcalidrawAPI,
  text: string,
  title: string,
  color: string = 'yellow'
) {
  try {
    const pos = calculateNextPosition(api);
    const fullText = `${title}\n\n${text}`;
    const bgColor = NOTE_BG_COLORS[color] || NOTE_BG_COLORS.yellow;

    // Create a sticky-note style rectangle with text
    const rectId = randomId();
    const textId = randomId();
    const width = 280;
    const height = Math.max(200, Math.min(400, 80 + fullText.length * 0.8));

    const newElements = [
      {
        id: rectId,
        type: 'rectangle',
        x: pos.x,
        y: pos.y,
        width,
        height,
        backgroundColor: bgColor,
        fillStyle: 'solid',
        strokeColor: '#000000',
        strokeWidth: 2,
        roughness: 1,
        roundness: { type: 3 },
        isDeleted: false,
        boundElements: [{ type: 'text', id: textId }],
        version: 1,
        versionNonce: Math.floor(Math.random() * 1000000),
      },
      {
        id: textId,
        type: 'text',
        x: pos.x + 10,
        y: pos.y + 10,
        width: width - 20,
        height: height - 20,
        text: fullText,
        fontSize: 16,
        fontFamily: 1,
        textAlign: 'right',
        verticalAlign: 'top',
        strokeColor: '#000000',
        isDeleted: false,
        containerId: rectId,
        originalText: fullText,
        autoResize: true,
        version: 1,
        versionNonce: Math.floor(Math.random() * 1000000),
      },
    ];

    const existingElements = api.getSceneElements();
    api.updateScene({
      elements: [...existingElements, ...newElements],
    });

    setTimeout(() => {
      api.scrollToContent(undefined, { fitToContent: true, animate: true });
    }, 100);
  } catch (err) {
    console.error('Failed to add shape to canvas:', err);
  }
}

export function getAllCanvasText(api: ExcalidrawAPI): string {
  const elements = api.getSceneElements();
  const texts: string[] = [];

  for (const el of elements) {
    if (el.isDeleted) continue;
    if (el.type === 'text' && el.text) {
      const text = el.text.trim();
      if (text) texts.push(text);
    }
  }

  return texts.join('\n\n---\n\n');
}

export async function exportCanvasAsImage(api: ExcalidrawAPI): Promise<void> {
  const elements = api.getSceneElements().filter((el: any) => !el.isDeleted);
  if (elements.length === 0) return;

  const { exportToBlob } = await import('@excalidraw/excalidraw');

  const blob = await exportToBlob({
    elements,
    appState: {
      ...api.getAppState(),
      exportWithDarkMode: false,
      exportBackground: true,
    },
    files: api.getFiles(),
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mind-canvas.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
