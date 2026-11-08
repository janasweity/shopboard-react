# Codex instructions for RAHA React

## Authorization and boundaries

- React root: C:/Users/morjm/OneDrive/Desktop/shopboard-react/shopboard-react (package.json is here, not in its parent).
- The Day 3 project at C:/Users/morjm/OneDrive/Desktop/shopboard is read-only. Preserve its user-owned untracked docs/ directory.
- Commit, push, deploy or upload only after the user approves that specific action. The repository has a GitHub remote (`origin`). Never force-push.
- Do not delete files without the user's approval; preview any deletion first.
- Inspect Git status before work. Make only the changes the user asks for, then stop and report.
- Follow CLAUDE.md for the full rules. README.md is the source of truth for the tree, routes, props, state ownership, API and verification.

## Shared React rules

- Use Vite, React and strict TypeScript. Use .tsx for components; .ts for types, API clients, state modules, hooks without JSX and pure logic.
- Put each reusable component in its own file with a typed Props interface. Use stable data IDs as list keys.
- Never mutate props or state. Give state one owner and one copy, and derive values instead of storing them. Use effects only to sync with something outside React.
- Avoid `any`, type assertions, non-null assertions, error-suppression comments and new lint or TypeScript exceptions.
- Keep StrictMode, clean up effects, and make effects safe to run twice.
- Preserve RAHA's design, accessibility and features. Write code and documentation in English, and explain changes to the user in simple Arabic.
- Do not invent personal mistakes, debug results, exercise completion or successful checks.
- The copied Day 3 types, API, logic, data and state files must stay byte-identical. Only an approved `import type` correction is allowed.

## Current architecture

- **Routing:** query-string routes on `/`, read by `useRoute`. All pages are lazy, declared at module level in src/app/lazy-pages.ts.
  - In App, the order is ErrorBoundary, then Suspense, then AppRoute, so only the page area loads or fails. The header, footer and cart stay usable.
  - The page boundary's Try again reloads the document, because React.lazy keeps a failed import. `resetKey={page}` clears the error on navigation.
  - `useRouteFocus` runs inside AppRoute.
- **Cart:** a React Context provider, not Zustand.
  - src/state.ts owns the entries and raha-cart storage, and cart-store.ts gives snapshots.
  - Only CartProvider calls useCart. Components use only useCartContext and its `add`, `change` and `clear` actions.
- **API:** tooling/products-api.ts serves `GET /api/products` (`{ items }`) and `GET /api/products/:id` (404 for unknown IDs) in dev and preview. It also handles the `/delay/<ms>`, `/fail/<code>` and `/empty` switches before `/api`.
  - `VITE_API_BASE` is the shared base URL for both requests.
  - products-resource.ts caches the request promises and validates responses with the unchanged Day 3 decoder.
- **Products and details:** Suspense and Error Boundaries with Try again. The details 404 shows the not-found view. The catalogue controls stay outside the boundaries.
- **Checkout:** `/?page=checkout`, built with react-hook-form, one Zod schema and the shadcn Field and Input.
  - Its summary reads only CartContext.
  - Nothing is sent or stored, there is no payment, delivery service or fee, and the cart is kept.
- **Styles:** Tailwind v4 is used only for src/components/ui, with no preflight. Its colours point to RAHA tokens, and unlayered RAHA rules win. Review all shadcn CLI output.

## Course delivery

- typecheck, lint (zero warnings), format:check and build must pass. Husky runs lint-staged. The Console must show no React warnings. Report real check results only.
- Do not modify the vendored skills in .claude/skills.
- Keep README.md aligned with the code. Record only the React DevTools inspections the user reports.
- debug-lab-log.md is the user's lab log, checked and translated by Claude. Bug 5 was found through source review, not visually; never describe it as observed. Do not change its findings without the user's request.
- DESIGN.md is not a confirmed course requirement; do not create it unless asked. Do not recreate planning files.

## Evidence

Keep three kinds of evidence separate, as CLAUDE.md describes:

1. **Course debug-lab bugs:** the user observed bugs 1-4, and bug 5 came from source review.
2. **Bugs found by Claude's automated checks or review:** the user did not observe these before the fix.
3. **The user's own manual verification after fixes.**

The course asks for rules from the user's own mistakes. None are recorded yet; add one only after the user reports a real mistake.
