import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { JOKER_SYSTEM_PROMPT } from '@/lib/prompts';
import { MOCK_JOKER_RESPONSE } from '@/lib/mock-responses';

const apiKey = process.env.ANTHROPIC_API_KEY;
const hasRealKey = apiKey && apiKey !== 'your-api-key-here';

export async function POST(req: NextRequest) {
  const { canvasText } = await req.json();

  if (!canvasText || !canvasText.trim()) {
    return NextResponse.json(
      { error: 'No content on canvas to analyze' },
      { status: 400 }
    );
  }

  if (!hasRealKey) {
    return NextResponse.json({ response: MOCK_JOKER_RESPONSE });
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: JOKER_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `תוכן הקאנבס:\n\n${canvasText}`,
        },
      ],
    });

    const text =
      message.content[0].type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ response: text });
  } catch (err) {
    console.error('Anthropic API error:', err);
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}
