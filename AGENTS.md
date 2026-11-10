# Codex instructions for RAHA React

## Authorization and boundaries

- React root: C:/Users/morjm/OneDrive/Desktop/shopboard-react/shopboard-react (package.json is here, not in its parent).
- The Day 3 project at C:/Users/morjm/OneDrive/Desktop/shopboard is read-only. Preserve its user-owned untracked docs/ directory.
- Commit, push, deploy or upload only after the user approves that specific action. The repository has a GitHub remote (`origin`). Never force-push.
- Do not delete files without the user's approval; preview any deletion first.
- Inspect Git status before work. Make only the changes the user asks for, then stop and report.
- Follow CLAUDE.md for the full rules. README.md is the source of truth for the tree, routes, props, state ownership, API and verification.

## Shared React rules

- Use Next.js (App Router), React and strict TypeScript. Use .tsx for components; .ts for types, API clients, state modules, hooks without JSX and pure logic.
- Put each reusable component in its own file with a typed Props interface. Use stable data IDs as list keys.
- Never mutate props or state. Give state one owner and one copy, and derive values instead of storing them. Use effects only to sync with something outside React.
- Avoid `any`, type assertions, non-null assertions, error-suppression comments and new lint or TypeScript exceptions.
- Keep StrictMode, clean up effects, and make effects safe to run twice.
- Preserve RAHA's design, accessibility and features. Write code and documentation in English, and explain changes to the user in simple Arabic.
- Do not invent personal mistakes, debug results, exercise completion or successful checks.
- The copied Day 3 types, API, logic, data and state files must stay byte-identical. Only an approved `import type` correction is allowed.

## Current architecture

- **Next.js 16 App Router** in `src/app/`. Read the matching guide in `node_modules/next/dist/docs/` before writing Next.js code.
  - Routes: `/`, `/products`, `/products/[id]`, `/inspiration`, `/about`, `/checkout` and `not-found.tsx`. AppShell (header, footer, cart, intro) wraps every page.
  - src/proxy.ts redirects old `/?page=…` URLs and retired products, and strips API test switches into a request header.
  - `'use client'` only where a Server Component imports a component that needs hooks, events or Context.
- **Data:** src/lib/api/products.ts (`server-only`) requests the separate products API (products-api/) at the full `RAHA_API_URL` with the unchanged Day 3 decoder. Server Components use it; never fetch a relative URL or the app's own routes.
  - `/products` passes the unawaited list promise to Client Components that read it with `use()` inside Suspense and Error Boundaries (Try again: `router.refresh()`).
  - `/products/[id]` awaits the product, calls `notFound()` for 404, and has its own loading, error (`retry()`) and not-found files.
- **Cart:** a React Context provider, not Zustand.
  - src/state.ts owns the entries and raha-cart storage, and cart-store.ts gives snapshots. useCart has an empty server snapshot, so the count is 0 until hydration.
  - Only CartProvider calls useCart. Components use only useCartContext and its `add`, `change` and `clear` actions.
- **Checkout:** `/checkout`, built with react-hook-form, one Zod schema and the shadcn Field and Input.
  - Its summary reads only CartContext.
  - Nothing is sent or stored, there is no payment, delivery service or fee, and the cart is kept.
- **Styles:** all CSS is in src/app/globals.css. Tailwind v4 (through `@tailwindcss/postcss`, with preflight) covers src/components, src/features and src/app, and the RAHA colours, fonts, radii and gutter are tokens in `@theme`.
  - Features are converted to Tailwind one at a time, only when the user asks. Until then their old component rules stay unlayered and win; a converted feature removes its old rules.
  - No new colours or dark mode without approval. Review all shadcn CLI output.

## Course delivery

- typecheck, lint (zero warnings), format:check and build must pass. Husky runs lint-staged. The Console must show no React warnings. Report real check results only.
- Do not modify the vendored skills in .claude/skills.
- Keep README.md aligned with the code. Record only the React DevTools inspections the user reports.
- debug-lab-log.md is the user's lab log, checked and translated by Claude. Bug 5 was found through source review, not visually; never describe it as observed. Do not change its findings without the user's request.
- DESIGN.md is not a confirmed course requirement; do not create it unless asked. Do not recreate planning files.

## Evidence

Keep four kinds of evidence separate, as CLAUDE.md describes:

1. **Course debug-lab bugs:** the user observed bugs 1-4, and bug 5 came from source review.
2. **Bugs found by Claude's automated checks or review:** the user did not observe these before the fix.
3. **The user's own manual verification after fixes.**
4. **The user's own mistakes, in the user's words.** Add one only after the user reports a real mistake.

The first user-reported mistake was in the delay test setup, not in the app code. On the Vite version, the loading state did not appear because the dev server had been started without `VITE_API_BASE`. Ports 5173 and 5174 were also busy. The resulting rule (CLAUDE.md rule 7), now for Next.js:

- Before testing an API state, start the products API, then set and print `RAHA_API_URL` in the terminal that starts Next.js.
- Start a new server from that terminal, use the port Next.js prints (a free one if needed), and open exactly that URL with the switch in front, for example `/delay/3000/products`.
- Confirm the result before suspecting the code.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
