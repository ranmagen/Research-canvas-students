import { NextRequest, NextResponse } from 'next/server';
import { ACTION_PROMPTS } from '@/lib/prompts';
import { MOCK_RESPONSES } from '@/lib/mock-responses';
import { ActionId } from '@/types';
import { hasOpenRouterKey, chatCompletion } from '@/lib/openrouter';

export async function POST(req: NextRequest) {
  const { actionId, userInput } = await req.json();

  if (!actionId || !(actionId in ACTION_PROMPTS)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const promptConfig = ACTION_PROMPTS[actionId as ActionId];

  if (!hasOpenRouterKey()) {
    const mockResponse = MOCK_RESPONSES[actionId as ActionId];
    return NextResponse.json({ response: mockResponse });
  }

  try {
    const text = await chatCompletion(
      promptConfig.systemPrompt,
      userInput || 'ספר לי על הנושא',
      1024
    );
    return NextResponse.json({ response: text });
  } catch (err) {
    console.error('OpenRouter API error:', err);
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}
