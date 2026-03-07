'use client';

import { useState, useCallback } from 'react';
import { ActionId } from '@/types';
import { MOCK_RESPONSES, MOCK_JOKER_RESPONSE } from '@/lib/mock-responses';

export function useChat() {
  const [response, setResponse] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  const simulateStreaming = useCallback(async (text: string) => {
    setIsStreaming(true);
    setResponse('');

    // Simulate streaming by revealing text gradually
    const words = text.split(' ');
    let accumulated = '';

    for (let i = 0; i < words.length; i++) {
      accumulated += (i > 0 ? ' ' : '') + words[i];
      setResponse(accumulated);
      await new Promise((r) => setTimeout(r, 20 + Math.random() * 30));
    }

    setIsStreaming(false);
    return text;
  }, []);

  const sendMessage = useCallback(
    async (actionId: ActionId, userInput: string): Promise<string> => {
      const mockResponse = MOCK_RESPONSES[actionId];
      const fullResponse = await simulateStreaming(mockResponse);
      return fullResponse;
    },
    [simulateStreaming]
  );

  const sendJoker = useCallback(
    async (canvasText: string): Promise<string> => {
      const fullResponse = await simulateStreaming(MOCK_JOKER_RESPONSE);
      return fullResponse;
    },
    [simulateStreaming]
  );

  const clearResponse = useCallback(() => {
    setResponse('');
  }, []);

  return { response, isStreaming, sendMessage, sendJoker, clearResponse };
}
