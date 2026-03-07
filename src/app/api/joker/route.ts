import { NextRequest, NextResponse } from 'next/server';
import { MOCK_JOKER_RESPONSE } from '@/lib/mock-responses';

export async function POST(req: NextRequest) {
  const { canvasText } = await req.json();

  if (!canvasText || !canvasText.trim()) {
    return NextResponse.json(
      { error: 'No content on canvas to analyze' },
      { status: 400 }
    );
  }

  // For now, return mock response. Later: integrate with Anthropic API
  return NextResponse.json({ response: MOCK_JOKER_RESPONSE });
}
