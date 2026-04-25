<div align="center">

# Valentine Web App ♡

### A cinematic, step-by-step digital love letter built with React + TypeScript

**An interactive romantic storytelling experience with a private PIN gate, envelope reveal, memory timeline, relationship quiz, hold-to-reveal finale, collectible coupons, and carefully designed accessible motion.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=111111)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Playwright](https://img.shields.io/badge/Tests-Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](#getting-started)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

### Live Demo

[**valentine-web-app-seven.vercel.app**](https://valentine-web-app-seven.vercel.app/)

</div>

---

## Developed And Designed By

| Role | Details |
|---|---|
| Designer / Developer | **Nischhal Subba** |
| GitHub | [@Nischhalsubba](https://github.com/Nischhalsubba) |
| Email | `hinischalsubba@gmail.com` |
| Contribution | Product concept, UX direction, visual design, frontend engineering, motion design |

---

## Table Of Contents

- [Project Overview](#project-overview)
- [Product Vision](#product-vision)
- [Designer’s Perspective](#designers-perspective)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Design System](#design-system)
- [Motion System](#motion-system)
- [Accessibility](#accessibility)
- [Performance And Reliability](#performance-and-reliability)
- [SEO And Discoverability](#seo-and-discoverability)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Customization Guide](#customization-guide)
- [Quality Checklist](#quality-checklist)
- [License](#license)

---

## Project Overview

**Valentine Web App** is an interactive storytelling website that feels like opening a real digital love letter.

It guides users through five romantic chapters:

1. Cover / envelope open
2. Love letter reveal
3. Memory lane timeline
4. Relationship quiz
5. Finale with hold-to-reveal and collectible coupons

The app is intentionally built around **soft emotional motion**, **reduced-motion accessibility**, **private access**, and **high-polish microinteractions**.

---

## Product Vision

The goal is to create a personal, memorable, and emotionally paced experience instead of a generic Valentine greeting page.

The product direction focuses on:

- one clear action per chapter
- calm romantic pacing
- warm paper-inspired visual language
- gentle animated reveals
- memory-driven storytelling
- replay value through quiz, coupons, surprises, and easter eggs
- accessibility-friendly motion behavior

---

## Designer’s Perspective

This project is designed like a tiny emotional product.

The design challenge is not just “make something cute.” The real challenge is sequencing emotion: anticipation, reveal, memory, play, and final reward.

The app is built around a few UX decisions:

- private PIN gate creates intimacy
- envelope open interaction creates anticipation
- letter reveal slows the user down
- memory timeline gives emotional depth
- quiz adds playful participation
- finale hold interaction makes the ending feel earned
- coupons create a keepsake feeling

The result is a personal web experience that behaves more like a story than a static card.

---

## Features

| Feature | Description |
|---|---|
| 5-step story flow | Clear romantic progression from cover to finale |
| Private PIN gate | Session unlock persistence for private viewing |
| Envelope interaction | Hero opening moment with graceful fallback |
| Love letter reveal | Slow, readable emotional content section |
| Memory lane | Collapsible memory groups and bottom-sheet detail view |
| Media support | Memory cards can include optional image/video media |
| Relationship quiz | Correct/wrong answer feedback animations |
| Hold-to-reveal finale | 1.5s progress-ring interaction for final reveal |
| Coupon collection | Keepsake-style interactive coupon states |
| Easter egg | Extra surprise layer for replay value |
| Reduced motion | Major transitions respect motion preferences |
| Lazy loading | Steps are split and prefetched for smoother flow |

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
| Testing | Playwright | End-to-end testing |
| Deployment | Vercel | Production hosting and CI deploy |

---

## Architecture

```text
src/
  animations/        # Motion orchestration and animation helpers
  components/        # Reusable UI components
  content/           # Story/content source
  hooks/             # Shared hooks such as reduced-motion detection
  steps/             # 5 main chapters/screens
  types/             # Type definitions
  App.tsx            # Step flow, lazy loading, fallback, and prefetch
  styles.css         # Visual + motion design system tokens and component styling
```

### Content Architecture

All story data is managed in one editable source:

```text
src/content/content.json
```

Root keys include:

- `meta`
- `letter`
- `reasons`
- `chapters`
- `quiz`
- `quizMessages`
- `coupons`
- `finale`
- `easterEgg`

This keeps copy updates independent from component logic.

### Step Routing Model

- App-level state tracks the active step.
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

- **Inter** for UI and body text
- **Playfair Display** for emotional display headings

### Component Standards

- Button/tap targets use 48px minimum height where possible.
- Loading labels keep width stable to reduce layout shift.
- Progress and chapter state are always visible.
- Interaction states include default, hover, active, loading, and disabled.

---

## Motion System

### Motion Tokens

Defined in:

```text
src/animations/motionTokens.ts
```

| Token | Duration |
|---|---:|
| Micro | 140ms |
| Fast | 160ms |
| Standard UI | 300ms |
| Hero | 720ms |
| Hold interaction | 1500ms |

### Easing Rules

- Micro feedback: `ease-out`
- Standard transitions: `ease-in-out`
- Hero moments: decelerated curve

### Motion Direction

The UX feel is calm and intimate, not noisy. One premium flourish is reserved for the finale, while motion near reading content stays restrained.

---

## Accessibility

- `prefers-reduced-motion` is supported globally and at interaction level.
- Particles/flourishes are removed in reduced-motion mode.
- Large movement is reduced to fades where needed.
- Dialogs support `Escape` close.
- Buttons are semantic and focusable.
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

This README is structured for repository discoverability around terms such as:

- `valentine web app`
- `interactive love letter app`
- `react romantic website`
- `typescript animation web app`
- `digital memory timeline app`

### Implemented Technical SEO

- `index.html` includes canonical, robots, Open Graph, Twitter, theme-color, and JSON-LD.
- `public/robots.txt` and `public/sitemap.xml` are added for crawler support.
- `public/site.webmanifest` and `public/favicon.svg` improve metadata completeness.
- Semantic heading structure is used across the README.

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

### Run E2E Tests

```bash
npx playwright install chromium
npm run test:e2e
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

1. Push to `main`.
2. Vercel pulls repository.
3. `npm ci` installs exact lockfile dependencies.
4. `npm run build` runs type-safe production build.
5. Static build is deployed from `build/`.

---

## Customization Guide

### Update Story Content

Edit:

```text
src/content/content.json
```

Add optional media per memory:

- `media.type`: `image` or `video`
- `media.src`: public URL/path, such as `/memories/selfie.jpg`
- `media.alt`: accessible description
- `media.poster`: optional for videos

### Configure Private PIN

Recommended: set `VITE_APP_PRIVATE_PIN` in Vercel environment variables.

Local development:

```bash
cp .env.example .env
```

Fallback PIN can be set in:

```text
src/content/content.json → meta.lock.fallbackPin
```

### Update Visual Theme

Edit:

```text
src/styles.css
```

### Update Motion Behavior

Edit:

```text
src/animations/motionTokens.ts
src/animations/
```

### Update Step Flow

Edit:

```text
src/App.tsx
src/steps/
```

---

## Quality Checklist

### UX QA

- [ ] PIN gate is clear and private.
- [ ] Envelope reveal feels smooth.
- [ ] Story progress is visible.
- [ ] Memory timeline is easy to navigate.
- [ ] Quiz feedback is understandable.
- [ ] Hold-to-reveal finale works reliably.
- [ ] Coupons are clear and collectible.

### Accessibility QA

- [ ] Reduced-motion mode works.
- [ ] Keyboard focus is visible.
- [ ] Dialogs close with Escape.
- [ ] Buttons are semantic.
- [ ] Media has useful alt text.
- [ ] Motion does not block reading.

### Technical QA

- [ ] `npm ci` works.
- [ ] `npm run dev` works.
- [ ] `npm run check` passes.
- [ ] `npm run build` succeeds.
- [ ] `npm run test:e2e` works.
- [ ] Vercel deployment succeeds.

---

## Recommended GitHub About Description

```text
Interactive Valentine Web App built with React + TypeScript: love letter reveal, memory timeline, quiz, hold-to-reveal finale, and polished accessible microinteractions.
```

## Recommended GitHub Topics

```text
valentine, love-letter, react, typescript, vite, frontend, web-animation, microinteractions, interactive-storytelling, vercel
```

---

## Keywords

`valentine app`, `react valentine website`, `digital love letter`, `interactive memory lane`, `romantic web experience`, `microinteractions`, `frontend animation`, `typescript vite app`, `vercel deployment`, `accessible motion design`

---

## License

This is a personal/private project (`"private": true` in `package.json`).  
No open-source license is currently declared.

---

<div align="center">

Built as a small, cinematic love-letter product — with care, motion, and intention.

</div>
