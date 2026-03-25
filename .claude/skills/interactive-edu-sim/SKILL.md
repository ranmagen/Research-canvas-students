---
name: interactive-edu-sim
description: Create immersive, interactive 2D and 3D educational simulations for the web. Use this skill whenever a user asks to build an educational simulation, interactive learning tool, science lab, math explorer, or any "learn by doing" web experience — especially for physics, chemistry, biology, math, geography, or history. Trigger even if the user says "demo", "visualization", "interactive explainer", "virtual lab", or "educational app". Always use this skill when the request involves Hebrew-language educational content or simulations for Israeli classrooms.
---

name: interactive-edu-sim
description: Create immersive, interactive 2D and 3D educational simulations for the web. Use this skill whenever a user asks to build an educational simulation, interactive learning tool, science lab, math explorer, or any "learn by doing" web experience — especially for physics, chemistry, biology, math, geography, or history. Trigger even if the user says "demo", "visualization", "interactive explainer", "virtual lab", or "educational app". Always use this skill when the request involves Hebrew-language educational content or simulations for Israeli classrooms.
license: Complete terms in LICENSE.txt
Interactive Educational Simulations
Build single-file web simulations where students learn through discovery. All output is in Hebrew (RTL), feels like premium educational software, and runs in the browser with no backend.

Step 1 — Understand the Topic Before Writing Code
Before touching code, answer these questions internally:

What is the core phenomenon? (e.g., wave interference, osmosis, compound interest)
What misconception does this fix? Design the simulation to directly confront it.
What are the 2–3 most meaningful variables? Only expose those as controls.
What does success look like? Define 3 missions the student must complete.

Write a brief mental model paragraph (not shown to user unless requested) — then generate the simulation.

Step 2 — Architecture Decisions
When to use 3D (Three.js)

Molecular structures, orbital mechanics, 3D geometry, anything spatial
Load via CDN: https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js

When to use 2D (Canvas or SVG)

Waves, graphs, circuits, chemical reactions, statistics — prefer Canvas API for performance

Always use

Tailwind CSS (CDN) for UI panels — gives a "real dashboard" feel
Google Fonts — load Assistant or Heebo for crisp Hebrew rendering
dir="rtl" on <body> and all major containers


Step 3 — Mandatory Structure (every simulation must have all 5)
1. Onboarding Overlay (#welcome-screen)

Full-screen overlay on load
Simulation name + one-sentence description in Hebrew
Large "התחל" button that dismisses the overlay
Brief animated hint showing which controls to use first

2. Main Canvas / World (#simulation-canvas)

70–80% of viewport
Smooth animation loop (requestAnimationFrame)
Visual quality: use gradients, shadows, glows — never flat solid colors
Show units on all measurements (°C, m/s, mol, etc.)

3. Control Deck (#control-panel)

Right-aligned panel (RTL: appears on the right)
Every control needs: Hebrew label + current value display + unit
Use sliders for continuous values, toggles for binary states, buttons for discrete actions
Sliders must update the simulation in real time (no "Apply" needed)
Group related controls with subtle section headers

4. Mission Box (#mission-box)

Persistent card — bottom or left side
Shows: current mission title, description, progress indicator
"בדוק משימה" button → runs validation logic
On success: toast notification with ✓ animation + unlock next mission
On failure: gentle hint message (never scolding)
3 missions minimum, increasing in difficulty

5. Reset Button

Always visible, labeled "אפס סימולציה"
Returns all parameters to initial values, replays onboarding hint briefly


Step 4 — Visual & UX Standards
Color palette approach

Choose a domain-appropriate palette (lab blues/whites for chemistry, earthy greens for biology, deep space for physics)
Use CSS variables: --primary, --accent, --surface, --text
Avoid pure black backgrounds — use very dark saturated colors (#0d1117 style)

Hebrew Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700&display=swap');
body { font-family: 'Assistant', sans-serif; direction: rtl; }
```
Feedback & Accessibility

All text ≥ 14px; labels ≥ 16px
Real-time value displays update on every animation frame
Color-blind safe: don't rely on color alone — use icons + text
No alert() — use styled toast/modal components

Animation quality checklist

 requestAnimationFrame loop (not setInterval)
 deltaTime-based physics (not frame-count-based)
 Smooth parameter transitions (lerp values, don't snap)
 Particle/object counts don't drop the simulation below 30fps on a mid-range device


Step 5 — Physics / Logic Engine Quality
Ask before finalizing: "Is this accurate enough for a classroom?"

Use real formulas with correct constants (gravity = 9.81 m/s², speed of light = 3×10⁸ m/s, etc.)
Label approximations explicitly in comments
Avoid "magic numbers" — all constants should have named variables with units in comments
For chemistry: use actual periodic table values
For biology: represent processes proportionally even if not to exact scale


Step 6 — Code Rules

Single file — all HTML, CSS, JS in one .html file
Libraries via CDN only (no npm, no build step)
No inline onclick attributes — use addEventListener
Wrap simulation in DOMContentLoaded
Include a // SIMULATION STATE comment block at top of JS defining all state variables
Include a resetSimulation() function that restores the full initial state


Example Mission Validation Pattern
```javascript
function checkMission(missionIndex) {
  const checks = {
    0: () => state.temperature >= 100,              // הרתח את המים
    1: () => state.pressure > 2 && state.volume < 5, // לחץ ונפח
    2: () => Math.abs(state.pH - 7) < 0.5,           // איזון חומציות
  };
  if (checks[missionIndex]?.()) {
    showToast('🎉 כל הכבוד! השגת את המטרה!', 'success');
    unlockNextMission(missionIndex + 1);
  } else {
    showToast('טרם הגעת ליעד — נסה שוב!', 'hint');
  }
}
```

Quick Reference: Approved CDN Libraries
| Purpose | Library | CDN URL |
|---------|---------|---------|
| 3D rendering | Three.js r128 | cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js |
| Styling | Tailwind CSS | cdn.tailwindcss.com |
| Charts | Chart.js | cdn.jsdelivr.net/npm/chart.js |
| Math | math.js | cdnjs.cloudflare.com/ajax/libs/mathjs/11.11.0/math.min.js |
| Icons | Font Awesome | cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css |
| Hebrew fonts | Google Fonts | fonts.googleapis.com/css2?family=Assistant:wght@400;600;700 |

Output Checklist (verify before delivering)

 Loads without errors in Chrome
 dir="rtl" on body
 Hebrew font loaded and rendering correctly
 Welcome overlay appears on load
 All 3 missions are functional and validatable
 Reset button works completely
 Simulation runs smoothly (no jank)
 Control panel updates are real-time
 No alert() calls anywhere
 Single .html file — self-contained
