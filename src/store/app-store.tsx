'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
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

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  editor: Editor | null;
  setEditor: (editor: Editor) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [editor, setEditorState] = React.useState<Editor | null>(null);

  const setEditor = useCallback((ed: Editor) => {
    setEditorState(ed);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, editor, setEditor }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within AppProvider');
  }
  return context;
}
