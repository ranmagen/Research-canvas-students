'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { useChat } from '@/hooks/useChat';
import { PATHS } from '@/lib/paths';
import { addShapeToCanvas, getAllCanvasText } from '@/lib/canvas-utils';

const NOTE_COLORS: Record<string, "yellow" | "blue" | "green" | "light-violet" | "orange"> = {
  research: 'blue',
  entrepreneurship: 'green',
  deepdive: 'light-violet',
};

export default function InteractionPanel() {
  const { state, dispatch, editor } = useAppStore();
  const { response, isStreaming, sendMessage, sendJoker, clearResponse } = useChat();
  const [userInput, setUserInput] = useState('');
  const [isJokerMode, setIsJokerMode] = useState(false);

  const activeAction = state.activeAction;
  const selectedPath = state.selectedPath;

  if (!selectedPath) return null;

  const path = PATHS[selectedPath];
  const action = activeAction
    ? path.actions.find((a) => a.id === activeAction)
    : null;

  const handleSend = async () => {
    if (!userInput.trim() && !isJokerMode) return;

    if (activeAction) {
      const contextualInput = state.topic
        ? `הנושא: ${state.topic}\n\n${userInput}`
        : userInput;
      dispatch({ type: 'ADD_MESSAGE', message: { role: 'user', content: userInput } });
      const result = await sendMessage(activeAction, contextualInput);
      dispatch({ type: 'SET_LAST_RESPONSE', response: result });
      dispatch({ type: 'MARK_ACTION_USED', action: activeAction });
    }
  };

  const handleJoker = async () => {
    if (!editor) return;
    setIsJokerMode(true);
    const canvasText = getAllCanvasText(editor);
    if (!canvasText.trim()) {
      clearResponse();
      return;
    }
    const result = await sendJoker(canvasText);
    dispatch({ type: 'SET_LAST_RESPONSE', response: result });
    setIsJokerMode(false);
  };

  const handleAddToCanvas = () => {
    if (!editor || !state.lastAiResponse) return;

    const title = isJokerMode
      ? '🃏 מה חסר לי?'
      : action
      ? `${action.emoji} ${action.label}`
      : 'תוצאה';
    const color = NOTE_COLORS[selectedPath] || 'yellow';
    addShapeToCanvas(editor, state.lastAiResponse, title, color);
    dispatch({ type: 'SET_LAST_RESPONSE', response: null });
    clearResponse();
  };

  // Check if joker button was clicked (activeAction is null but path is selected)
  const showJokerPanel = !activeAction && selectedPath;

  return (
    <div className="space-y-3">
      {/* Action prompt area */}
      {action && (
        <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
          <p className="text-sm text-indigo-700">{action.promptHint}</p>
        </div>
      )}

      {/* Joker panel */}
      {showJokerPanel && (
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
          <p className="text-sm text-amber-700 mb-2">
            לחץ/י כדי שה-AI ינתח את מה שיש על הקאנבס ויציע כיוון חקר חדש
          </p>
          <button
            onClick={handleJoker}
            disabled={isStreaming}
            className="w-full bg-amber-500 text-white rounded-lg py-2 text-sm font-bold hover:bg-amber-600 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isStreaming ? 'מנתח...' : '🃏 מה חסר לי?'}
          </button>
        </div>
      )}

      {/* User input */}
      {action && (
        <div className="flex gap-2">
          <textarea
            dir="rtl"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="כתוב/י כאן..."
            className="flex-1 border border-[var(--color-border)] rounded-lg p-2 text-sm resize-none h-20 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>
      )}

      {action && (
        <button
          onClick={handleSend}
          disabled={isStreaming || !userInput.trim()}
          className="w-full bg-[var(--color-primary)] text-white rounded-lg py-2 text-sm font-semibold hover:bg-[var(--color-primary-dark)] disabled:opacity-50 transition-colors cursor-pointer"
        >
          {isStreaming ? 'חושב...' : 'שלח'}
        </button>
      )}

      {/* AI Response */}
      {response && (
        <div className="bg-white border border-[var(--color-border)] rounded-lg p-3 max-h-64 overflow-y-auto">
          <div className="text-sm whitespace-pre-wrap leading-relaxed" dir="rtl">
            {response}
          </div>
        </div>
      )}

      {/* Add to Canvas button */}
      {state.lastAiResponse && !isStreaming && (
        <button
          onClick={handleAddToCanvas}
          className="w-full bg-green-500 text-white rounded-lg py-2.5 text-sm font-bold hover:bg-green-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <span>📌</span>
          <span>הוסף לקאנבס</span>
        </button>
      )}
    </div>
  );
}
