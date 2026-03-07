import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { REFLECTION_SYSTEM_PROMPT } from '@/lib/prompts';

const apiKey = process.env.ANTHROPIC_API_KEY;
const hasRealKey = apiKey && apiKey !== 'your-api-key-here';

export async function POST(req: NextRequest) {
  const { canvasText, actionsUsed } = await req.json();

  if (!hasRealKey) {
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
    const anthropic = new Anthropic({ apiKey });
    const userContent = canvasText
      ? `תוכן הקאנבס של התלמיד:\n\n${canvasText}`
      : 'התלמיד לא הוסיף עדיין תוכן לקאנבס.';

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: REFLECTION_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    });

    const report =
      message.content[0].type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ report });
  } catch (err) {
    console.error('Anthropic API error:', err);
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}
