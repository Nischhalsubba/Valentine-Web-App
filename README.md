<div align="center">

<img src="./docs/assets/valentine-web-app-thumbnail.svg" width="100%" alt="Valentine Web App branded repository thumbnail" />

# Valentine Web App

### A private, bilingual digital love letter told in eight interactive chapters

A cinematic React experience combining a private gate, envelope reveal, letters, memories, gallery moments, playful questions, promises, and a hold-to-reveal finale.

[Live demo](https://valentine-web-app-seven.vercel.app/) · [Engineering case study](./docs/PRODUCT_AND_ENGINEERING_CASE_STUDY.md) · [Repository instructions](./AGENTS.md)

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=111111)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)
![Playwright](https://img.shields.io/badge/E2E-Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-111111?style=flat-square&logo=vercel)

![Stars](https://img.shields.io/github/stars/Nischhalsubba/Valentine-Web-App?style=flat-square)
![Forks](https://img.shields.io/github/forks/Nischhalsubba/Valentine-Web-App?style=flat-square)
![Issues](https://img.shields.io/github/issues/Nischhalsubba/Valentine-Web-App?style=flat-square)
![Last commit](https://img.shields.io/github/last-commit/Nischhalsubba/Valentine-Web-App?style=flat-square)

</div>

## Product concept

Valentine Web App is designed as a small emotional product rather than a single greeting page. The experience controls pacing across anticipation, reading, memory, play, promises, and reward.

The app supports:

- English, Nepali, and mixed-language modes
- soft, funny, and romantic mood modes
- system, reduced, and full-motion preferences
- persistent progress and unlock state in local storage
- a private phrase/PIN gate
- lazy-loaded chapters with fallback rendering
- next-step prefetching for smoother transitions
- accessible reduced-motion behavior
- Playwright end-to-end testing

## Story flow

| Step | Component | Experience |
|---|---|---|
| 1 | `StepCover` | Envelope reveal and introduction |
| 2 | `StepLetter` | Main love-letter reading experience |
| 3 | `StepMemory` | Timeline and memory exploration |
| 4 | `StepGallery` | Visual memory collection |
| 5 | `StepNurse` | Personalized themed chapter |
| 6 | `StepQuiz` | Interactive relationship questions |
| 7 | `StepPromises` | Promise and commitment sequence |
| 8 | `StepFinale` | Hold-to-reveal ending and rewards |

## Architecture

```text
src/
├── animations/     motion orchestration and reusable tokens
├── components/     shared controls, shells, dialogs, and widgets
├── content/        editable story data
├── hooks/          reduced-motion and shared behavior
├── steps/          eight lazy-loaded chapters
├── types/          app and content contracts
├── utils/          localization and storage helpers
├── App.tsx         gate, progress, settings, persistence, routing
└── styles.css      visual system and component styling
```

`App.tsx` acts as the experience controller. It reads the story content, manages the gate, stores settings and progress, loads each chapter lazily, prefetches the next chapter, and supplies shared actions to each step.

## Design system

The visual system is defined primarily in `src/styles.css`:

- warm paper background: `#fff7ef`
- rose accent: `#e85d75`
- soft blush accent: `#ffd3da`
- dark text: `#1b1b1f`
- Playfair Display for emotional headings
- Inter for interface and body copy
- reusable radius, spacing, shadow, duration, and easing tokens

The repository thumbnail uses the same system and is a designed presentation asset, not a browser screenshot.

## Privacy model

The gate is a lightweight experience gate, not secure authentication.

- accepted phrases are delivered to the browser
- unlock state is stored in local storage
- the gate should not protect sensitive information
- personal content and media should be reviewed before public deployment
- private media should not be hosted in publicly accessible folders when confidentiality matters

## Current status

| Area | Status |
|---|---|
| Eight-step story experience | Implemented |
| English/Nepali/mixed copy | Implemented |
| Mood controls | Implemented |
| Reduced-motion controls | Implemented |
| Persistent progress | Implemented |
| Private gate | Implemented as client-side deterrent |
| Lazy loading and fallback | Implemented |
| Playwright configuration | Present |
| Vercel deployment | Configured |
| Strong authentication | Not implemented |
| Browser screenshot in this documentation pass | Not captured |

The listed Vercel deployment could not be reached from the current execution environment, so no fabricated runtime screenshot has been added. Humanity will survive one less misleading portfolio image.

## Run locally

Requirements:

- Node.js 22 or newer
- npm 10 or newer

```bash
npm ci
npm run dev
```

Verification:

```bash
npm run check
npx playwright install chromium
npm run test:e2e
npm run preview
```

## Content customization

Edit the main story source:

```text
src/content/content.json
```

Key groups include:

- metadata and settings
- access gate
- cover and letter
- memories and gallery
- quiz and feedback
- promises
- finale and rewards
- easter eggs

Keep personal copy out of component logic whenever possible.

## Deployment

The project is configured for Vercel.

Typical deployment flow:

1. Push changes to `main`.
2. Vercel installs with the lockfile.
3. TypeScript and Vite build the app.
4. The static output is deployed.
5. Verify the gate, progress persistence, media, and all eight chapters on production.

## Important risks

- client-side gate values are discoverable
- local-storage progress can be cleared or modified
- emotional/personal content may be exposed by a public deployment
- multiple animation libraries increase bundle and maintenance cost
- chapter media can create privacy, performance, and copyright issues
- motion-rich flows require reduced-motion and keyboard testing
- a live romantic experience still deserves ordinary engineering discipline, despite what greeting-card companies have taught society

## Documentation

- [Product and engineering case study](./docs/PRODUCT_AND_ENGINEERING_CASE_STUDY.md)
- [Repository instructions](./AGENTS.md)
- [Branded repository thumbnail](./docs/assets/valentine-web-app-thumbnail.svg)

## Author

Designed and developed by [Nischhal Raj Subba](https://github.com/Nischhalsubba).
