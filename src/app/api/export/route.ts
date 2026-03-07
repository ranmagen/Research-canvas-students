import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { canvasText, actionsUsed } = await req.json();

  // Mock reflection report
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
