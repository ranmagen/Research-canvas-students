import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ACTION_PROMPTS } from '@/lib/prompts';
import { MOCK_RESPONSES } from '@/lib/mock-responses';
import { ActionId } from '@/types';

const apiKey = process.env.ANTHROPIC_API_KEY;
const hasRealKey = apiKey && apiKey !== 'your-api-key-here';

export async function POST(req: NextRequest) {
  const { actionId, userInput } = await req.json();

  if (!actionId || !(actionId in ACTION_PROMPTS)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const promptConfig = ACTION_PROMPTS[actionId as ActionId];

  if (!hasRealKey) {
    const mockResponse = MOCK_RESPONSES[actionId as ActionId];
    return NextResponse.json({ response: mockResponse });
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: promptConfig.systemPrompt,
      messages: [{ role: 'user', content: userInput || 'ספר לי על הנושא' }],
    });

    const text =
      message.content[0].type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ response: text });
  } catch (err) {
    console.error('Anthropic API error:', err);
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}
