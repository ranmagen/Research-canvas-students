import { Editor, createShapeId } from 'tldraw';
import { toRichText } from '@tldraw/tlschema';

function calculateNextPosition(editor: Editor): { x: number; y: number } {
  const shapes = editor.getCurrentPageShapes();
  const cols = 3;
  const spacingX = 320;
  const spacingY = 350;
  const startX = -400;
  const startY = -200;

  const index = shapes.length;
  const col = index % cols;
  const row = Math.floor(index / cols);

  return {
    x: startX + col * spacingX,
    y: startY + row * spacingY,
  };
}

export function addShapeToCanvas(
  editor: Editor,
  text: string,
  title: string,
  color: "black" | "blue" | "green" | "grey" | "light-blue" | "light-green" | "light-red" | "light-violet" | "orange" | "red" | "violet" | "white" | "yellow" = 'yellow'
) {
  const id = createShapeId();
  const pos = calculateNextPosition(editor);
  const fullText = `${title}\n\n${text}`;

  editor.createShape({
    id,
    type: 'note',
    x: pos.x,
    y: pos.y,
    props: {
      richText: toRichText(fullText),
      color,
      size: 'l',
    },
  });

  setTimeout(() => {
    editor.zoomToFit({ animation: { duration: 300 } });
  }, 100);
}

function extractTextFromRichText(richText: unknown): string {
  if (!richText || typeof richText !== 'object') return '';
  const doc = richText as { content?: Array<{ content?: Array<{ text?: string }> }> };
  if (!doc.content) return '';
  return doc.content
    .map((block) =>
      block.content
        ? block.content.map((inline) => inline.text || '').join('')
        : ''
    )
    .join('\n');
}

export function getAllCanvasText(editor: Editor): string {
  const shapes = editor.getCurrentPageShapes();
  const texts: string[] = [];

  for (const shape of shapes) {
    if (shape.type === 'note' || shape.type === 'text') {
      const props = shape.props as unknown as Record<string, unknown>;
      if (props.richText) {
        const text = extractTextFromRichText(props.richText);
        if (text.trim()) texts.push(text);
      }
    }
  }

  return texts.join('\n\n---\n\n');
}

export async function exportCanvasAsImage(editor: Editor): Promise<void> {
  const shapeIds = editor.getCurrentPageShapeIds();
  if (shapeIds.size === 0) return;

  const result = await editor.toImage([...shapeIds]);
  if (!result) return;

  const url = URL.createObjectURL(result.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mind-canvas.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
