'use client';

import { useState, useCallback } from 'react';
import { ActionId } from '@/types';

export function useChat() {
  const [response, setResponse] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback(
    async (actionId: ActionId, userInput: string): Promise<string> => {
      setIsStreaming(true);
      setResponse('');
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actionId, userInput }),
        });
        const data = await res.json();
        const text = data.response || '';
        setResponse(text);
        return text;
      } catch (err) {
        console.error('Chat error:', err);
        const errMsg = 'אירעה שגיאה. נסה/י שוב.';
        setResponse(errMsg);
        return errMsg;
      } finally {
        setIsStreaming(false);
      }
    },
    []
  );

  const sendJoker = useCallback(
    async (canvasText: string): Promise<string> => {
      setIsStreaming(true);
      setResponse('');
      try {
        const res = await fetch('/api/joker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ canvasText }),
        });
        const data = await res.json();
        const text = data.response || '';
        setResponse(text);
        return text;
      } catch (err) {
        console.error('Joker error:', err);
        const errMsg = 'אירעה שגיאה. נסה/י שוב.';
        setResponse(errMsg);
        return errMsg;
      } finally {
        setIsStreaming(false);
      }
    },
    []
  );

  const clearResponse = useCallback(() => {
    setResponse('');
  }, []);

  return { response, isStreaming, sendMessage, sendJoker, clearResponse };
}
