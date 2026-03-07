'use client';

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { AppState, AppAction, ActionId, PathId, ChatMessage } from '@/types';
import { Editor } from 'tldraw';

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

// Separate context for the editor - doesn't change with app state
interface EditorContextType {
  editor: Editor | null;
  setEditor: (editor: Editor) => void;
}

// App state context - changes frequently with sidebar interactions
interface AppStateContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const EditorContext = createContext<EditorContextType | null>(null);
const AppStateContext = createContext<AppStateContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [editor, setEditorState] = React.useState<Editor | null>(null);

  const setEditor = useCallback((ed: Editor) => {
    setEditorState(ed);
  }, []);

  const editorValue = useMemo(() => ({ editor, setEditor }), [editor, setEditor]);
  const appStateValue = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <EditorContext.Provider value={editorValue}>
      <AppStateContext.Provider value={appStateValue}>
        {children}
      </AppStateContext.Provider>
    </EditorContext.Provider>
  );
}

// Hook for components that only need the editor (like Canvas)
export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within AppProvider');
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
  const editorCtx = useContext(EditorContext);
  const appStateCtx = useContext(AppStateContext);
  if (!editorCtx || !appStateCtx) {
    throw new Error('useAppStore must be used within AppProvider');
  }
  return { ...appStateCtx, ...editorCtx };
}
