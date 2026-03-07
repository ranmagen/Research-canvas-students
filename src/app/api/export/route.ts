import { NextRequest, NextResponse } from 'next/server';
import { REFLECTION_SYSTEM_PROMPT } from '@/lib/prompts';
import { hasOpenRouterKey, chatCompletion } from '@/lib/openrouter';

export async function POST(req: NextRequest) {
  const { canvasText, actionsUsed } = await req.json();

  if (!hasOpenRouterKey()) {
    const report = `# דוח רפלקציה - מה למדתי?

## 📋 סיכום המחקר
חקרת נושא מרתק והשתמשת ב-${actionsUsed?.length || 0} כלי חקר שונים.

## 🔍 מה נחקר
${canvasText ? 'עברת על מגוון היבטים של הנושא, כולל ניתוח מנקודות מבט שונות.' : 'עדיין לא הוספת תוכן לקאנבס.'}

## 💡 תובנות מרכזיות
- למדת להסתכל על הנושא מזוויות שונות
- גילית קשרים בין סיבות ותוצאות
- פיתחת חשיבה ביקורתית

## 🚀 המלצות להמשך
- נסה/י להעמיק בנקודה אחת שמצאת מעניינת במיוחד
- שתף/י את המחקר עם חבר/ה וקבל/י משוב
- חפש/י מקורות נוספים שתומכים או סותרים את מה שמצאת

---
*נוצר אוטומטית ע"י Mind Canvas*`;
    return NextResponse.json({ report });
  }

  try {
    const userContent = canvasText
      ? `תוכן הקאנבס של התלמיד:\n\n${canvasText}`
      : 'התלמיד לא הוסיף עדיין תוכן לקאנבס.';

    const report = await chatCompletion(
      REFLECTION_SYSTEM_PROMPT,
      userContent,
      1024
    );
    return NextResponse.json({ report });
  } catch (err) {
    console.error('OpenRouter API error:', err);
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}
