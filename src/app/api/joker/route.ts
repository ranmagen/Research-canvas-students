import { NextRequest, NextResponse } from 'next/server';
import { JOKER_SYSTEM_PROMPT } from '@/lib/prompts';
import { MOCK_JOKER_RESPONSE } from '@/lib/mock-responses';
import { hasOpenRouterKey, chatCompletion } from '@/lib/openrouter';

export async function POST(req: NextRequest) {
  const { canvasText } = await req.json();

  if (!canvasText || !canvasText.trim()) {
    return NextResponse.json(
      { error: 'No content on canvas to analyze' },
      { status: 400 }
    );
  }

  if (!hasOpenRouterKey()) {
    return NextResponse.json({ response: MOCK_JOKER_RESPONSE });
  }

  try {
    const text = await chatCompletion(
      JOKER_SYSTEM_PROMPT,
      `תוכן הקאנבס:\n\n${canvasText}`,
      512
    );
    return NextResponse.json({ response: text });
  } catch (err) {
    console.error('OpenRouter API error:', err);
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}
