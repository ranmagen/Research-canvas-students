'use client';

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { AppState, AppAction, ActionId, CanvasNote } from '@/types';

const initialState: AppState = {
  selectedPath: null,
  activeAction: null,
  messages: [],
  isStreaming: false,
  lastAiResponse: null,
  actionsUsed: new Set<ActionId>(),
  topic: '',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PATH':
      return {
        ...state,
        selectedPath: action.path,
        activeAction: null,
        messages: [],
        lastAiResponse: null,
      };
    case 'SET_ACTION':
      return {
        ...state,
        activeAction: action.action,
        messages: [],
        lastAiResponse: null,
      };
    case 'SET_TOPIC':
      return { ...state, topic: action.topic };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] };
    case 'SET_STREAMING':
      return { ...state, isStreaming: action.streaming };
    case 'SET_LAST_RESPONSE':
      return { ...state, lastAiResponse: action.response };
    case 'MARK_ACTION_USED':
      return {
        ...state,
        actionsUsed: new Set([...state.actionsUsed, action.action]),
      };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [], lastAiResponse: null };
    default:
      return state;
  }
}

// Canvas notes context - separate from app state to avoid unnecessary re-renders
interface CanvasContextType {
  notes: CanvasNote[];
  addNote: (note: CanvasNote) => void;
  updateNotePosition: (id: string, x: number, y: number) => void;
  removeNote: (id: string) => void;
  getNotes: () => CanvasNote[];
}

// App state context - changes frequently with sidebar interactions
interface AppStateContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const CanvasContext = createContext<CanvasContextType | null>(null);
const AppStateContext = createContext<AppStateContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [notes, setNotes] = React.useState<CanvasNote[]>([]);

  const addNote = useCallback((note: CanvasNote) => {
    setNotes((prev) => [...prev, note]);
  }, []);

  const updateNotePosition = useCallback((id: string, x: number, y: number) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, x, y } : n))
    );
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notesRef = React.useRef(notes);
  notesRef.current = notes;
  const getNotes = useCallback(() => notesRef.current, []);

  const canvasValue = useMemo(
    () => ({ notes, addNote, updateNotePosition, removeNote, getNotes }),
    [notes, addNote, updateNotePosition, removeNote, getNotes]
  );
  const appStateValue = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <CanvasContext.Provider value={canvasValue}>
      <AppStateContext.Provider value={appStateValue}>
        {children}
      </AppStateContext.Provider>
    </CanvasContext.Provider>
  );
}

// Hook for components that need the canvas (like Canvas)
export function useCanvasAPI() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvasAPI must be used within AppProvider');
  }
  return context;
}

// Hook for components that need app state (like Sidebar)
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}

// Combined hook for components that need both (like InteractionPanel)
export function useAppStore() {
  const canvasCtx = useContext(CanvasContext);
  const appStateCtx = useContext(AppStateContext);
  if (!canvasCtx || !appStateCtx) {
    throw new Error('useAppStore must be used within AppProvider');
  }
  return { ...appStateCtx, ...canvasCtx };
}
