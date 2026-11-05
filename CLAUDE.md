# RAHA course React rules

## Requirements and workflow

The user's attached RAHA React Architecture and Migration Planning requirements resolve the earlier uncertainty about tool names, skills, delivery filenames and stages. They do not include the five exact debug-lab bug descriptions. The original is read-only; the verified React root is C:/Users/morjm/OneDrive/Desktop/shopboard-react/shopboard-react.

Current authorization is Stage 1 only: copy the planned Day 3 modules and required dependencies, preserve their original paths, compare their contents and run checks. Stage 0 is saved in b8fccdf. Leave Stage 1 changes unstaged/uncommitted; do not implement React UI components, modify the original, configure remotes, push, delete, deploy or upload. Later stages need approval.

## Shared React rules

- Use Vite, React, and strict TypeScript. Use .tsx for components; .ts for types, API clients, state modules, hooks without JSX, and pure logic.
- Put each reusable component in its own file with a typed Props interface. Use stable data IDs as list keys.
- Never mutate props or React state. Define clear state ownership and pass events upward through typed callbacks. Derive filtered products and totals instead of duplicating state.
- Build the UI with React rendering, event handling, and hooks. Do not initialize the old DOM UI or render HTML strings.
- Handle loading, error with retry, empty catalogue, no-match, and success states explicitly.
- Call hooks unconditionally at component/custom-hook top level. Keep render pure, retain StrictMode, and clean up effects, listeners, timers and stale async results.
- Avoid any, TypeScript type assertions, non-null assertions, and error-suppression comments. Narrow unknown values and check DOM refs/roots at runtime.
- Preserve RAHA's existing design, responsive behavior, accessibility, and intended features. Reuse appropriate colors, typography, spacing, and assets.
- Explain what changed, where, and why after every implementation step, including checks and limitations. Explain to the user in simple Arabic.
- Keep filenames, code, comments, documentation, website text, and approved commit messages in English.
- Copied Day 3 types, API, logic, and state files permit only necessary import type corrections. Preserve original relative paths and runtime imports; use separate React adapters. Explain any proposed protected-file change beyond import type and wait for explicit approval before applying it.
- Do not invent personal mistakes, debug results, exercise completion, skill use, or successful checks.

## RAHA behavior and accessibility

- Home keeps its hero, six featured article cards, manual room slider and registration demo. Use one Products catalogue with combined case-insensitive name search, category/collection filtering and copied-array price sorting.
- Keep details, finish-specific prices/images/availability, gallery links, dimensions/materials/care, room inspiration links and the floor-area calculator.
- The cart stays a native modal dialog, not a new route. Preserve add/increase/decrease/remove/clear, product+finish identity, count, totals, raha-cart restoration before first display, saved-data validation and in-memory fallback.
- Preserve registration as a non-modal dialog with close/reset/reopen after successful validation. Required email and password (minLength 8) use native validation. Contact remains a non-sending demo with required name/email/topic/message and minLength 10 for the message. Do not transmit form data or store credentials.
- Preserve existing polite cart/form/slider feedback using React components; no new toast framework is needed.
- Keep English language, semantic landmarks, one h1 per active route, logical headings, labels, alt handling, keyboard access, visible focus, accessible contrast, and route title/focus updates.
- Keep cart Escape handling, focus containment/return and action focus recovery; registration is non-modal and must not trap focus.
- Keep tokens in src/styles/tokens.css and active styles in src/styles/main.css, mobile-first min-width layout breakpoints at 768px/1280px, no !important or max-width layout queries, and no overflow at 360/768/1280px.
- Preserve entrance skip/Escape/session/replay behavior and reduced motion; clean up timers, frames, media-query listeners and route listeners.

## Day 3 reuse and conflict policy

Preserve types, API, pure logic and state modules at their original paths with their dependency closure. Only necessary import type corrections are allowed in protected copies. React rendering, events, routing and integration belong in new files; do not copy old DOM templates/initializers into the React UI. Any proposed exception requires explanation and explicit approval before the protected change; approval alone does not certify course compliance.

Stage 1 reported TS1294 for the original ApiError parameter-property syntax before changing configuration. The planned target-only adjustment sets erasableSyntaxOnly=false in tsconfig.app.json while strict remains true; the protected API client is byte-identical to its original. The products endpoint is Vite middleware, so deployed static assets require a functioning API route/backend.

## Course setup and submission

- Stage 0 created a separate React repository at the verified target root; no parent Git repository was inherited. Stage 0 files are saved in b8fccdf; Stage 1 changes remain unstaged/uncommitted and no remote is configured.
- Require successful production build and lint with zero warnings, Prettier, Husky, lint-staged, strict typing without prohibited shortcuts, and no React warnings in the Console.
- Both required skills are installed as real copies under .claude/skills: vercel-react-best-practices and vercel-composition-patterns. Source hashes are in skills-lock.json. These installed skill files are tracked in Stage 0 commit b8fccdf. Do not create another commit now.
- Require at least six reusable TSX components, each in its own file with a typed Props interface and actual reuse.
- Final README.md must include the actual App-rooted tree, exact files, props, state owners, commands and API hosting limitations. Verify tree and ownership with React DevTools Components.
- Deliver DESIGN.md and debug-lab-log.md. The log must cover the five course bugs with real reproduction, expected/actual behavior, diagnosis tools, cause, fix, verification and AI disclosure. Specific tasks remain missing; do not invent replacements or count the old two-bug log as completion.
- Final repository must be clean with current documents and no unused templates, backups, screenshots, prompts or AI planning files. MIGRATION_PLAN.md must be removed before final submission after approved deletion; no files are deleted now. Retain AGENTS.md and CLAUDE.md.

## Rules based on observed mistakes — pending personal learning

Required: at least three rules derived from mistakes the user actually observes during React work. None are claimed or invented here. After each real observation, record evidence and the prevention rule with the user, then add that rule here. Debug-lab completion and personal observations remain pending until performed.
