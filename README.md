# Valentine Web App <3  
### A cinematic, step-by-step digital love letter built with React + TypeScript

<div align="center">

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

</div>

---

## Developed And Designed By
- **Nischhal Subba**
- GitHub: [@Nischhalsubba](https://github.com/Nischhalsubba)
- Email: `hinischalsubba@gmail.com`
- Role: Product concept, UX direction, visual design, frontend engineering, motion design

---

## Project Overview
**Valentine Web App** is an interactive storytelling website that feels like opening a real love letter.  
It guides users through five romantic chapters:

1. Cover / envelope open
2. Love letter reveal
3. Memory lane timeline
4. Relationship quiz
5. Finale with hold-to-reveal and collectible coupons

The app is intentionally built around **soft, emotional motion**, **reduced-motion accessibility**, and **high polish microinteractions**.

---

## Table Of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Design System](#design-system)
5. [Motion System](#motion-system)
6. [Accessibility](#accessibility)
7. [Performance And Reliability](#performance-and-reliability)
8. [SEO And Discoverability](#seo-and-discoverability)
9. [Getting Started](#getting-started)
10. [Deployment](#deployment)
11. [Customization Guide](#customization-guide)
12. [License](#license)

---

## Features
- 5-step romantic narrative experience with clear progress states
- Envelope opening hero interaction with graceful fallback on low-power devices
- Tap-to-reveal reason list with spring-based line reveals
- Chapter navigation with memory cards and bottom-sheet detail view
- Quiz feedback animations for correct/wrong answers
- Finale hold-to-reveal interaction with a 1.5s progress ring
- Interactive heart pulse and one-time sparkle flourish
- Coupon collection states for keepsake-style interaction
- Reduced-motion support across all major transitions
- Lazy-loaded steps with fallback UI and prefetching to reduce loading friction

---

## Tech Stack
| Layer | Technology | Purpose |
|---|---|---|
| Framework | React 18 | Component-driven UI |
| Language | TypeScript 5 | Type safety and maintainability |
| Build Tool | Vite 5 | Fast dev/build pipeline |
| Styling | CSS variables + handcrafted CSS | Design system tokens and custom theme |
| Motion | `motion`, `@react-spring/web`, WAAPI | UI transitions and microinteractions |
| Motion Helpers | `animejs`, `velocity-animate`, `@formkit/auto-animate`, `@mojs/core` | Specialized effects and fallbacks |
| UI Transition | `react-transition-group` | Sheet open/close choreography |
| Deployment | Vercel | Production hosting and CI deploy |

---

## Architecture
```
src/
  animations/        # Motion orchestration and animation helpers
  components/        # Reusable UI components (StepShell, StepActions, reason list)
  content/           # Story/content source (content.json)
  hooks/             # Shared hooks (prefers-reduced-motion)
  steps/             # 5 main chapters/screens
  types/             # Type definitions
  App.tsx            # Step flow, lazy loading, fallback and prefetch
  styles.css         # Visual + motion design system tokens and component styling
```

### Step Routing Model
- App-level state tracks active step.
- Each step is lazy loaded.
- The next step is prefetched to improve continuity.
- If a chunk fails, a fallback step keeps the story unblocked.

---

## Design System

### Visual Tokens
Defined in `src/styles.css` under `:root`:
- Color system: `--bg`, `--surface`, `--accent`, `--accent-soft`, `--text`, `--muted`
- Radius scale: `--radius-btn`, `--radius-card`, `--radius-modal`
- Spacing scale: `--s1` to `--s9`
- Shadow: `--shadow-soft`

### Typography
- **Inter** for UI and body
- **Playfair Display** for emotional display headings

### Component Standards
- Button/tap targets use >= 48px minimum height
- Consistent states: default, hover, active, loading, disabled
- Loading labels keep width stable to avoid layout shift
- Progress and chapter state are always visible to users

---

## Motion System

### Motion Tokens
Defined in `src/animations/motionTokens.ts`:
- Micro: 140ms
- Fast: 160ms
- Standard/UI: 300ms
- Hero: 720ms
- Hold interaction: 1500ms

### Easing Rules
- Micro feedback: `ease-out`
- Standard transitions: `ease-in-out`
- Hero moments: decelerate curve

### Motion Direction
- The UX feel is calm and intimate, not noisy.
- One premium flourish is reserved for the finale.
- Motion near reading content is intentionally restrained.

---

## Accessibility
- `prefers-reduced-motion` is supported globally and at interaction level.
- Reduced motion behavior includes:
  - particles/flourishes removed
  - large movement reduced to fades
  - smooth scroll replaced by instant behavior where needed
- Keyboard-safe interactions:
  - dialogs support `Escape` close
  - buttons are semantic and focusable
- UI feedback remains functional even when decorative motion is disabled.

---

## Performance And Reliability
- Step-level code splitting and lazy loading reduce initial bundle impact.
- Next-step prefetch in `App.tsx` improves chapter transitions.
- Animation helpers include WAAPI/CSS fallback paths to prevent hard failures.
- Vercel install is deterministic via `npm ci` in `vercel.json`.
- Build command validates TypeScript before production bundling.

---

## SEO And Discoverability

This README is intentionally structured for repository SEO and discoverability around terms such as:
- `valentine web app`
- `interactive love letter app`
- `react romantic website`
- `typescript animation web app`
- `digital memory timeline app`

### Recommended GitHub About Description
`Interactive Valentine Web App built with React + TypeScript: love letter reveal, memory timeline, quiz, hold-to-reveal finale, and polished accessible microinteractions.`

### Recommended GitHub Topics
- `valentine`
- `love-letter`
- `react`
- `typescript`
- `vite`
- `frontend`
- `web-animation`
- `microinteractions`
- `interactive-storytelling`
- `vercel`

### Repository SEO Checklist
- Use a clear project title and keyword-rich description
- Keep README sections semantic (`##` and `###`) and scannable
- Add preview images/gifs with descriptive alt text
- Use release tags and meaningful changelog notes
- Keep setup/deploy instructions complete and accurate
- Link the live demo in both README and repo About section

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install
```bash
npm ci
```

### Run Development Server
```bash
npm run dev
```

### Type Check
```bash
npm run check
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## Deployment

### Vercel Configuration
Defined in `vercel.json`:
- install command: `npm ci`
- build command: `npm run build`
- output directory: `build`

### Deploy Flow
1. Push to `main`
2. Vercel pulls repository
3. `npm ci` installs exact lockfile dependencies
4. `npm run build` runs type-safe production build
5. Static build is deployed from `build/`

---

## Customization Guide

### Update Story Content
Edit:
- `src/content/content.json`

### Update Visual Theme
Edit:
- `src/styles.css` (`:root` color, spacing, radius, typography variables)

### Update Motion Behavior
Edit:
- `src/animations/motionTokens.ts`
- step-specific files under `src/animations/`

### Update Step Flow
Edit:
- `src/App.tsx`
- files in `src/steps/`

---

## Keywords
`valentine app`, `react valentine website`, `digital love letter`, `interactive memory lane`, `romantic web experience`, `microinteractions`, `frontend animation`, `typescript vite app`, `vercel deployment`, `accessible motion design`

---

## License
This is a personal/private project (`"private": true` in `package.json`).  
No open-source license is currently declared.

---

If you want, I can also add:
1. A polished `CONTRIBUTING.md`
2. A `CHANGELOG.md`
3. A screenshot/gallery section template with SEO-friendly alt text format
