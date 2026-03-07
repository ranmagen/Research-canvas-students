import { NextRequest, NextResponse } from 'next/server';
import { MOCK_RESPONSES } from '@/lib/mock-responses';
import { ActionId } from '@/types';

export async function POST(req: NextRequest) {
  const { actionId, userInput } = await req.json();

  const mockResponse = MOCK_RESPONSES[actionId as ActionId];
  if (!mockResponse) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  // For now, return mock response. Later: integrate with Anthropic API
  // const anthropic = new Anthropic();
  // const stream = await anthropic.messages.stream({...});

  return NextResponse.json({ response: mockResponse });
}
