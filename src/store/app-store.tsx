'use client';

import React, { createContext, useContext, useReducer, useCallback, useMemo, useRef } from 'react';
import { AppState, AppAction, ActionId, PathId, ChatMessage } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CanvasAPI = any;

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

// CanvasAPI context uses a ref - no re-renders when editor is set
interface CanvasAPIContextType {
  getCanvasAPI: () => CanvasAPI | null;
  setCanvasAPI: (editor: CanvasAPI) => void;
}

// App state context - changes frequently with sidebar interactions
interface AppStateContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const CanvasAPIContext = createContext<CanvasAPIContextType | null>(null);
const AppStateContext = createContext<AppStateContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const editorRef = useRef<CanvasAPI | null>(null);

  const setCanvasAPI = useCallback((ed: CanvasAPI) => {
    editorRef.current = ed;
  }, []);

  const getCanvasAPI = useCallback(() => editorRef.current, []);

  // This value NEVER changes - no re-renders for Canvas
  const editorValue = useMemo(() => ({ getCanvasAPI, setCanvasAPI }), [getCanvasAPI, setCanvasAPI]);
  const appStateValue = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <CanvasAPIContext.Provider value={editorValue}>
      <AppStateContext.Provider value={appStateValue}>
        {children}
      </AppStateContext.Provider>
    </CanvasAPIContext.Provider>
  );
}

// Hook for components that only need the editor (like Canvas)
export function useCanvasAPI() {
  const context = useContext(CanvasAPIContext);
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
  const editorCtx = useContext(CanvasAPIContext);
  const appStateCtx = useContext(AppStateContext);
  if (!editorCtx || !appStateCtx) {
    throw new Error('useAppStore must be used within AppProvider');
  }
  return { ...appStateCtx, ...editorCtx };
}
