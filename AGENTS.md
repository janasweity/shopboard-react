# Codex instructions for RAHA React

## Authorization and boundaries

- Original project C:/Users/morjm/OneDrive/Desktop/shopboard is read-only. Preserve its user-owned untracked docs/ directory.
- Verified React root: C:/Users/morjm/OneDrive/Desktop/shopboard-react/shopboard-react; package.json is here, not in its parent.
- Current authorization: Stage 0 only. Configure development tools, strict typing, the independent local Git repository and the two project-local skills. Leave all work uncommitted and stop for review.
- Do not copy Day 3 modules, migrate UI components, modify the original, stage files, commit, configure a remote, push, delete files, deploy or upload. Preserve user work. A startup root guard and mechanical formatting are setup changes, not UI migration.
- Inspect both projects and Git status before work. Stage 0 created a local .git at the verified React root after confirming no parent repository. All project files remain unstaged/uncommitted. Original status remains ?? docs/.

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

## Architecture after approval

- Follow CLAUDE.md and the approved plan. Keep React features separate from path-preserved Day 3 dependencies.
- Use the original shared API client, runtime decoder and cents-to-dollars mapping. Load Products through the API; do not hide failures with static fallback data. Deployed static assets require a functioning API endpoint.
- Preserve the native cart dialog and all actions. Original state.ts owns cart/storage; an external adapter supplies stable snapshots and notifications to React. Do not add duplicate persistence effects or mutate snapshots.
- Keep cleanup/stale-response protection and StrictMode. Do not add subscriptions or AbortSignal parameters to protected modules.
- Preserve forms as non-sending demos, product/finish IDs, route compatibility, images and reduced-motion behavior. Inactive room hotspot code does not justify a new UI without approval.

## Course delivery after approval

- Stage 0 initialized the independent React repository with no remotes. Do not commit or push without further authorization.
- Configure Prettier, Husky, lint-staged, strict typing, and build/lint checks with zero warnings. Verify with React DevTools Components and browser Console/Network/Sources.
- Both vercel-react-best-practices and vercel-composition-patterns are installed as real files under .claude/skills with source hashes in skills-lock.json. Keep them eligible for Git tracking; do not reformat vendored content. Their course-required commit remains pending explicit authorization.
- Keep README.md's App-rooted tree, props and state ownership aligned with source; deliver DESIGN.md and debug-lab-log.md.
- Obtain the five exact course debug-lab bug descriptions before doing the lab; they have not been supplied. Keep completion pending and record only actual work.
- Add at least three mistake-based rules to CLAUDE.md only after the user actually observes the relevant mistakes. Keep personal learning pending; do not manufacture examples.
- Run relevant checks and report real outcomes; never disable checks to pass or claim an unmeasured Lighthouse score.
- MIGRATION_PLAN.md is temporary development documentation and must be removed before final submission. Plan cleanup of unused starter files, backups, screenshots, prompts and AI planning files; preview exact deletions and obtain deletion approval first. No deletions now.
- Do not commit or push unless explicitly authorized. Stop after Stage 0 and wait for review; do not start Stage 1.
