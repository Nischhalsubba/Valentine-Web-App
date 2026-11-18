# Valentine experience — interaction, privacy and accessibility QA

## Project contract
The maintained React, TypeScript and Vite application lives in `app/`. Its package manifest provides `npm run check` (storage tests, type check and build), `npm run test:e2e`, and `npm run dev`. The experience describes bilingual content, persistent progress, interactive memories, quiz questions, and a hold-to-reveal finale. This document is an acceptance matrix, not an assertion that every scenario is passing.

## Experience state matrix
| State or interruption | Review question |
| --- | --- |
| First visit | Is the first action discoverable without animation or insider context? |
| English and Nepali variants | Is all meaningful text, button purpose and feedback translated consistently? |
| Choice, quiz or branching path | Can visitors understand what their choice changes and recover from mistakes? |
| Saved progress and resumed session | Does restoration preserve expected state without leaking private messages? |
| Browser storage unavailable | Does a clear session-only fallback prevent a crash or lost-input surprise? |
| Slow device or reduced motion | Can a visitor finish without animation timing dependencies? |
| Keyboard-only use | Are steps, answers and the finale reachable with visible focus? |
| Touch and long-press/hold | Is there a discoverable non-pointer alternative and cancel behavior? |
| Reload, back/forward and restart | Is state transition intentional and clearly explained? |
| Offline or missing assets | Does essential copy remain accessible and errors stay understandable? |

## Privacy and content release review
Keep personal details, private memories and relationship messages out of test fixtures, screenshots in public issues, analytics payloads and console output. Obtain the intended recipient's consent before publishing identifiable images or sensitive details. Review whether saved progress is confined to the browser, how it is cleared and whether navigation exposes messages in URLs or share previews. Do not claim encrypted or private storage without inspecting the actual implementation.

## Reproducible verification
```bash
cd app
npm ci
npm run check
npm run test:e2e
npm run dev
```
Use supported Node >=22. Test `prefers-reduced-motion: reduce`, keyboard only, narrow touch width, 200% text zoom, local-storage restrictions and a fresh browser profile. A Vite build passing is not a substitute for playing through all localized branches.

## Reviewer sign-off
- [ ] Every meaningful step has readable instructions, focus order, and an operable way forward/back.
- [ ] Language switch does not silently erase progress.
- [ ] Saved progress and restart/delete behavior are clear and tested.
- [ ] No private identifiable message or recipient data is exposed in code, logs or public issue attachments.
- [ ] Motion has reduced-motion behavior and the finale has an accessible alternative.
- [ ] Failure, interruption, replay and offline states are tested.
- [ ] Build, unit/storage and browser tests have recorded outcomes.

## Evidence template
```text
PR / owner / reviewed date:
Browser and device / language:
Step and branch coverage:
Storage on/off and reload findings:
Keyboard, zoom, touch and reduced-motion findings:
Tests executed and exact results:
Privacy / consent review:
Open blockers and rollback:
```

## Release boundary
This checklist does not modify gameplay, send messages, store personal content or certify consent. Any real recipient data or new analytics must receive a separate, explicit privacy review.
