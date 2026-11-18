# Valentine Web App: interaction, storage and accessibility QA

This guide covers the maintained interactive experience under **app/**. A delightful animation is not a replacement for an accessible choice, predictable feedback or recovery when the browser restricts storage.

## Interaction-state review

| Scenario | Expected behavior |
| --- | --- |
| Initial visit | Primary content and first actionable choice remain understandable before animation |
| User chooses an option | The result reflects the actual selection and offers a clear next step |
| Repeated activation | Accidental double-clicks or fast repeated key presses do not corrupt state |
| Keyboard only | All meaningful actions are reachable with Tab and activated with their semantic keys |
| Reduced motion | The final message and transitions remain usable when movement is disabled |
| Reload/navigation | Persistence follows the documented policy rather than implying saved state where none exists |
| Storage blocked | The experience remains usable in memory and surfaces a recoverable failure if needed |
| Small screens | Controls remain visible and readable without horizontal clipping |
| Assistive technology | Messages and state changes are labelled; visual effects do not hide the result |
| Share flow | The shared link reflects only content intended to be public |

Avoid surprising redirects, manipulative button motion, hidden opt-outs or messages that falsely suggest a user completed an action.

## Automated checks

Use Node.js 22+ and npm 10+, from **app/**:

~~~bash
npm install
npm run test:storage
npm run typecheck
npm run build
~~~

**npm run check** combines the storage tests, typecheck and build. The repository also exposes **npm run test:e2e** for Playwright; install the supported browser dependencies and report the actual browser/environment. Passing a build does not prove focus order, reduced-motion behavior or real browser storage restrictions.

## Manual acceptance

Test one normal desktop session, one narrow phone viewport, keyboard-only flow, a reduced-motion session and a private/restricted-storage scenario. Inspect loading and error states. Record each result; mark unrun scenarios explicitly.

## Privacy and content review

Never expose personal messages, gift names, account links or private images in public test fixtures. Before adding analytics, persistence or sharing, document the purpose and whether user data leaves the device. Clear or reset actions must do what the UI promises.

## Pull request checklist

Identify the changed controls/states, expected outcomes, failure behavior, fixtures, commands/results, browser evidence, privacy impact and rollback path. If a new motion effect harms usability, revert the focused effect while preserving the underlying user choice and content.
