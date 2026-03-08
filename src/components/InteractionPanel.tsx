'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { useChat } from '@/hooks/useChat';
import { PATHS } from '@/lib/paths';
import { addShapeToCanvas, getAllCanvasText } from '@/lib/canvas-utils';
import { Send, Zap, PinIcon, Loader2 } from 'lucide-react';

const NOTE_COLORS: Record<string, "yellow" | "blue" | "green" | "light-violet" | "orange"> = {
  research: 'blue',
  entrepreneurship: 'green',
  deepdive: 'light-violet',
};

export default function InteractionPanel() {
  const { state, dispatch, getCanvasAPI } = useAppStore();
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
    const editor = getCanvasAPI();
    if (!editor) return;
    setIsJokerMode(true);
    const canvasText = getAllCanvasText(editor);
    if (!canvasText.trim()) {
      clearResponse();
      setIsJokerMode(false);
      return;
    }
    const result = await sendJoker(canvasText);
    dispatch({ type: 'SET_LAST_RESPONSE', response: result });
  };

  const handleAddToCanvas = () => {
    const editor = getCanvasAPI();
    if (!editor || !state.lastAiResponse) return;

    const title = isJokerMode
      ? 'מה חסר לי?'
      : action
      ? `${action.emoji} ${action.label}`
      : 'תוצאה';
    const color = NOTE_COLORS[selectedPath] || 'yellow';
    addShapeToCanvas(editor, state.lastAiResponse, title, color);
    dispatch({ type: 'SET_LAST_RESPONSE', response: null });
    clearResponse();
    setIsJokerMode(false);
  };

  const showJokerPanel = !activeAction && selectedPath;

  return (
    <div className="space-y-3">
      {/* Action prompt area */}
      {action && (
        <div className="border-3 border-black bg-[var(--color-brutal-cyan)] p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-bold">{action.promptHint}</p>
        </div>
      )}

      {/* Joker panel */}
      {showJokerPanel && (
        <div className="border-3 border-black bg-[var(--color-brutal-pink)] p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-bold mb-3">
            לחץ/י כדי שה-AI ינתח את מה שיש על הקאנבס ויציע כיוון חקר חדש
          </p>
          <button
            onClick={handleJoker}
            disabled={isStreaming}
            className="brutal-btn w-full bg-black text-white border-3 border-black p-2.5 text-sm font-black shadow-[4px_4px_0px_0px_var(--color-brutal-yellow)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" strokeWidth={2.5} />
            )}
            <span>{isStreaming ? 'מנתח...' : 'מה חסר לי?'}</span>
          </button>
        </div>
      )}

      {/* User input */}
      {action && (
        <div>
          <textarea
            dir="rtl"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="כתוב/י כאן..."
            className="w-full border-3 border-black p-3 text-sm font-medium resize-none h-24 bg-white focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
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
          className="brutal-btn w-full bg-black text-white border-3 border-black p-2.5 text-sm font-black shadow-[4px_4px_0px_0px_var(--color-brutal-cyan)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {isStreaming ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" strokeWidth={2.5} />
          )}
          <span>{isStreaming ? 'חושב...' : 'שלח'}</span>
        </button>
      )}

      {/* AI Response */}
      {response && (
        <div className="border-3 border-black bg-white p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-64 overflow-y-auto brutal-scroll">
          <div className="text-sm font-medium whitespace-pre-wrap leading-relaxed" dir="rtl">
            {response}
          </div>
        </div>
      )}

      {/* Add to Canvas button */}
      {state.lastAiResponse && !isStreaming && (
        <button
          onClick={handleAddToCanvas}
          className="brutal-btn w-full bg-[var(--color-brutal-green)] text-black border-3 border-black p-3 text-sm font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <PinIcon className="w-5 h-5" strokeWidth={2.5} />
          <span>הוסף לקאנבס</span>
        </button>
      )}
    </div>
  );
}
