# Repository Instructions

## Setup

Valentine Web App is a Vite, React, TypeScript, handcrafted CSS, animation, and Playwright project.

```bash
npm ci
npm run dev
```

Use Node.js 22 or newer and npm 10 or newer, matching `package.json`.

## Commands

| Task | Command |
|---|---|
| Start development server | `npm run dev` |
| Type-check | `npm run typecheck` |
| Build production bundle | `npm run build` |
| Run full repository check | `npm run check` |
| Preview production bundle | `npm run preview` |
| Install Playwright Chromium | `npx playwright install chromium` |
| Run end-to-end tests | `npm run test:e2e` |

## Key files

- `src/App.tsx`: gate, settings, progress, persistence, chapter loading, and shared navigation.
- `src/content/content.json`: primary story, memory, quiz, promise, and finale content.
- `src/steps/`: eight lazy-loaded story chapters.
- `src/components/`: shared UI, actions, widgets, dialogs, and chapter shells.
- `src/animations/`: reusable motion behavior and duration/easing tokens.
- `src/hooks/useReducedMotion.ts`: motion-preference handling.
- `src/utils/i18n.ts`: English, Nepali, and mixed-language localization.
- `src/utils/storage.ts`: browser persistence helpers.
- `src/styles.css`: visual tokens and component styling.
- `tests/e2e/`: Playwright flows.
- `playwright.config.ts`: E2E server and Chromium configuration.
- `docs/PRODUCT_AND_ENGINEERING_CASE_STUDY.md`: product and engineering reference.

## Architecture rules

- Keep story content in `src/content/content.json` rather than hard-coding it into components.
- Keep chapter components isolated under `src/steps/`.
- Route shared controls and state through `StepComponentProps` instead of reading unrelated global state from each chapter.
- Preserve lazy loading and next-step prefetch behavior unless profiling shows a better approach.
- Treat lazy-load fallback rendering as a reliability feature, not disposable boilerplate.
- Use the existing localization utilities for any copy visible to users.
- Use the existing storage helpers and namespaced keys for persistent browser state.

## Privacy and security

- The phrase/PIN gate is client-side and must never be described as secure authentication.
- Do not place genuinely sensitive content behind the current gate.
- Review personal text, images, videos, dates, names, and location clues before public deployment.
- Do not commit secrets, private media, or credentials.
- Avoid analytics or third-party trackers unless privacy and consent requirements are understood.

## Design and motion conventions

- Preserve the warm-paper, rose, blush, Playfair, and Inter brand system unless intentionally redesigning it.
- Use CSS tokens instead of introducing isolated colors, spacing, radii, or animation durations.
- Keep motion calm around reading content and reserve stronger effects for transitions or rewards.
- Every essential interaction must remain usable with reduced motion enabled.
- Do not rely on hover alone for important information or actions.
- Maintain visible keyboard focus and semantic buttons.

## Testing and verification

Before committing meaningful changes:

1. Run `npm run check`.
2. Run `npm run test:e2e` after installing Playwright Chromium.
3. Run `npm run preview` and inspect the production bundle.
4. Test the private gate with valid and invalid values.
5. Test all eight chapters in order and by direct step navigation.
6. Verify persistence after refresh.
7. Test English, Nepali, and mixed-language modes.
8. Test soft, funny, and romantic moods.
9. Test system, reduced, and full-motion modes.
10. Test keyboard-only navigation and Escape behavior in dialogs.
11. Test common mobile, tablet, and desktop widths.
12. Confirm personal media and copy are appropriate for public deployment.

## Do not

- Do not claim the gate provides confidentiality.
- Do not hard-code personal copy inside chapter components when it belongs in the content file.
- Do not add another animation library without removing or justifying an existing one.
- Do not break progress storage or unlock-state compatibility without a migration plan.
- Do not present the generated repository thumbnail as a browser screenshot.
- Do not publish private relationship content merely because the repository happens to be deployable.
