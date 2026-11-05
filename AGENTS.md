# Codex instructions for RAHA React

## Authorization and boundaries

- Original project C:/Users/morjm/OneDrive/Desktop/shopboard is read-only. Preserve its user-owned untracked docs/ directory.
- Verified React root: C:/Users/morjm/OneDrive/Desktop/shopboard-react/shopboard-react; package.json is here, not in its parent.
- Current status: Stages 3-5 (API catalogue, cart, product details, forms, rooms, about, entrance) are implemented on top of 07d4702 and are under the user's review. Make only review fixes the user asks for.
- Do not modify the original, stage/commit, configure remotes, push, deploy or upload without explicit authorization. Do not delete files without explicit approval; keep MIGRATION_PLAN.md until the review is complete. Preserve protected Day 3 files; report any proposed exception first.
- Inspect both projects and Git status before work. The original retains its pre-existing untracked docs/ directory.

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

- Follow CLAUDE.md. README.md is the source of truth for the implemented tree, props and state ownership; where MIGRATION_PLAN.md proposed different files (CartProvider, cart.context.ts, CartSummary, NotificationRegion), the README supersedes it. Keep React features separate from path-preserved Day 3 dependencies.
- Use the original shared API client, runtime decoder and cents-to-dollars mapping. Load Products through the API; do not hide failures with static fallback data. Deployed static assets require a functioning API endpoint.
- Preserve the native cart dialog and all actions. Original state.ts owns cart/storage; src/features/cart/cart-store.ts supplies stable snapshots and notifications, and useCart derives lines/count/subtotal. All cart changes go through cart-store.ts. Do not add a provider, duplicate persistence effects or mutate snapshots.
- Keep cleanup/stale-response protection and StrictMode. Do not add subscriptions or AbortSignal parameters to protected modules.
- Preserve forms as non-sending demos, product/finish IDs, route compatibility, images and reduced-motion behavior. Inactive room hotspot code does not justify a new UI without approval.

## Course delivery after approval

- Stage 0 initialized the independent React repository with no remotes. Do not commit or push without further authorization.
- Configure Prettier, Husky, lint-staged, strict typing, and build/lint checks with zero warnings. Verify with React DevTools Components and browser Console/Network/Sources.
- Both vercel-react-best-practices and vercel-composition-patterns are installed as real files under .claude/skills with source hashes in skills-lock.json. Keep them eligible for Git tracking; do not reformat vendored content. Their installation was saved in Stage 0 commit b8fccdf; do not modify vendored skills.
- Keep README.md's App-rooted tree, props and state ownership aligned with source; deliver DESIGN.md and debug-lab-log.md.
- The five course debug-lab bugs are at shopboard-api.vercel.app/debug-lab. The lab is pending for the user's own practice: do not perform it or write debug-lab-log.md on the user's behalf.
- Add at least three mistake-based rules to CLAUDE.md only after the user actually observes the relevant mistakes. Keep personal learning pending; do not manufacture examples.
- Run relevant checks and report real outcomes; never disable checks to pass or claim an unmeasured Lighthouse score.
- MIGRATION_PLAN.md is temporary development documentation; keep it until the review is complete, then remove it before final submission. The unused Vite starter files were already removed with approval. Preview any further deletion and obtain approval first.
- Do not commit or push unless explicitly authorized. Stop after each requested review step and wait for the user.
