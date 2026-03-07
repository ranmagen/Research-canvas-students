import { LearningPath, PathId } from '@/types';

export const PATHS: Record<PathId, LearningPath> = {
  research: {
    id: 'research',
    label: 'חקר אירוע או אדם',
    emoji: '🔎',
    description: 'חקירה מעמיקה של אירוע היסטורי או דמות',
    actions: [
      {
        id: 'perspectives',
        label: 'נקודות מבט',
        emoji: '👥',
        promptHint: 'ספר/י על האירוע או הדמות שאת/ה חוקר/ת',
      },
      {
        id: 'timeline',
        label: 'ציר זמן',
        emoji: '⏳',
        promptHint: 'מה האירוע שתרצה/י לבנות לו ציר זמן?',
      },
      {
        id: 'cause-effect',
        label: 'סיבה ותוצאה',
        emoji: '🔍',
        promptHint: 'איזה אירוע תרצה/י לנתח?',
      },
      {
        id: 'interview',
        label: 'ראיון אישי',
        emoji: '🎙️',
        promptHint: 'את מי תרצה/י לראיין? שאל/י שאלה!',
      },
      {
        id: 'myth-reality',
        label: 'מיתוס מול מציאות',
        emoji: '💡',
        promptHint: 'איזה נושא תרצה/י לבדוק - מה נכון ומה לא?',
      },
    ],
  },
  entrepreneurship: {
    id: 'entrepreneurship',
    label: 'פרוייקט יזמות',
    emoji: '🚀',
    description: 'פיתוח רעיון יזמי מהבעיה ועד המיתוג',
    actions: [
      {
        id: 'problem',
        label: 'הגדרת הבעיה',
        emoji: '😟',
        promptHint: 'מה הבעיה שאת/ה רוצה לפתור?',
      },
      {
        id: 'user-persona',
        label: 'מי המשתמש?',
        emoji: '👤',
        promptHint: 'תאר/י את הבעיה שהמשתמש שלך חווה',
      },
      {
        id: 'brainstorm',
        label: 'סיעור מוחות',
        emoji: '🌪️',
        promptHint: 'מה הבעיה שצריך לפתור? נחשוב על פתרונות!',
      },
      {
        id: 'how-it-works',
        label: 'איך זה עובד',
        emoji: '🏗️',
        promptHint: 'מה הרעיון שתרצה/י לפרק לשלבים?',
      },
      {
        id: 'name-slogan',
        label: 'שם וסלוגן',
        emoji: '📛',
        promptHint: 'ספר/י על המיזם שלך בכמה מילים',
      },
    ],
  },
  deepdive: {
    id: 'deepdive',
    label: 'למידה עמוקה של נושא',
    emoji: '🧠',
    description: 'הבנה מעמיקה של מושג או נושא לימודי',
    actions: [
      {
        id: 'simple-explain',
        label: 'הסבר פשוט',
        emoji: '👶',
        promptHint: 'מה המושג שתרצה/י להבין בצורה פשוטה?',
      },
      {
        id: 'my-world',
        label: 'הקשר לעולם שלי',
        emoji: '🔗',
        promptHint: 'מה הנושא שתרצה/י לחבר לחיי היומיום?',
      },
      {
        id: 'analogy',
        label: 'האנלוגיה המושלמת',
        emoji: '🎭',
        promptHint: 'מה המושג שתרצה/י להבין דרך השוואה?',
      },
      {
        id: 'big-questions',
        label: 'שאלות גדולות',
        emoji: '❓',
        promptHint: 'מה הנושא שתרצה/י לחשוב עליו לעומק?',
      },
      {
        id: 'quiz',
        label: 'בחן את עצמי',
        emoji: '🧪',
        promptHint: 'על מה תרצה/י להיבחן?',
      },
    ],
  },
};

export const PATH_LIST: LearningPath[] = [
  PATHS.research,
  PATHS.entrepreneurship,
  PATHS.deepdive,
];
