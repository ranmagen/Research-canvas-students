export type PathId = 'research' | 'entrepreneurship' | 'deepdive';

export type ActionId =
  // Research path
  | 'perspectives'
  | 'timeline'
  | 'cause-effect'
  | 'interview'
  | 'myth-reality'
  // Entrepreneurship path
  | 'problem'
  | 'user-persona'
  | 'brainstorm'
  | 'how-it-works'
  | 'name-slogan'
  // Deep dive path
  | 'simple-explain'
  | 'my-world'
  | 'analogy'
  | 'big-questions'
  | 'quiz';

export interface ActionButton {
  id: ActionId;
  label: string;
  emoji: string;
  promptHint: string;
}

export interface LearningPath {
  id: PathId;
  label: string;
  emoji: string;
  description: string;
  actions: ActionButton[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CanvasNote {
  id: string;
  x: number;
  y: number;
  title: string;
  text: string;
  color: string;
}

export interface AppState {
  selectedPath: PathId | null;
  activeAction: ActionId | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  lastAiResponse: string | null;
  actionsUsed: Set<ActionId>;
  topic: string;
}

export type AppAction =
  | { type: 'SET_PATH'; path: PathId }
  | { type: 'SET_ACTION'; action: ActionId | null }
  | { type: 'SET_TOPIC'; topic: string }
  | { type: 'ADD_MESSAGE'; message: ChatMessage }
  | { type: 'SET_STREAMING'; streaming: boolean }
  | { type: 'SET_LAST_RESPONSE'; response: string | null }
  | { type: 'MARK_ACTION_USED'; action: ActionId }
  | { type: 'CLEAR_MESSAGES' };
