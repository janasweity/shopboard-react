# RAHA React rules

## Project and workflow

RAHA is the React + TypeScript version of the user's Day 3 ShopBoard project, built with the Next.js App Router. The React root is C:/Users/morjm/OneDrive/Desktop/shopboard-react/shopboard-react. The Day 3 project (C:/Users/morjm/OneDrive/Desktop/shopboard) is read-only.

To run it locally: `npm run api:build`, `npm run api:start` (products API on port 4000), then `npm run dev` with `RAHA_API_URL=http://127.0.0.1:4000` (for example in `.env.local`) and open `http://localhost:5173`.

README.md is the source of truth for the component tree, routes, props, state ownership, API and verification results. Keep it aligned with the code after every change.

- Commit, push, deploy or upload only after the user approves that specific action. The repository has a GitHub remote (`origin`). Never force-push.
- Do not delete files without the user's approval, and preview any deletion first.
- Recompare the protected Day 3 modules after any pre-commit hook run; do not change them.
- Explain what changed, where and why after every implementation step, including checks and limitations. Explain to the user in simple Arabic.

## Shared React rules

- Use Next.js (App Router), React and strict TypeScript. Use .tsx for components; .ts for types, API clients, state modules, hooks without JSX and pure logic.
- Put each reusable component in its own file with a typed Props interface. Use stable data IDs as list keys.
- Never mutate props or React state. Give each piece of state one owner and one copy, and pass events upward through typed callbacks. Derive filtered products and totals instead of storing them.
- Build the UI with React rendering, event handling and hooks. Do not initialize the old DOM UI or render HTML strings.
- Handle loading, error with retry, empty catalogue, no-match and success states explicitly.
- Call hooks unconditionally at the top level. Keep render pure, keep StrictMode, and clean up effects, listeners, timers and stale async results. Use an effect only to sync with something outside React.
- Avoid `any`, type assertions, non-null assertions and error-suppression comments. Narrow unknown values and check DOM refs at run time. Do not add lint or TypeScript exceptions.
- Preserve RAHA's design, responsive behavior, accessibility and features. Reuse its colours, typography, spacing and assets.
- Keep filenames, code, comments, documentation, website text and commit messages in English.
- Do not invent personal mistakes, debug results, exercise completion, skill use or successful checks.

## Architecture

The app uses the Next.js 16 App Router (`src/app/`). Next.js 16 changed APIs and file conventions; read the matching guide in `node_modules/next/dist/docs/` before writing Next.js code.

### Routing and pages

- Routes: `/`, `/products`, `/products/[id]`, `/inspiration`, `/about`, `/checkout`, and `not-found.tsx` for anything else. The root layout renders AppShell (header, footer, cart dialog, cart status, intro) around every page.
- Links use `next/link`. URL helpers live in src/lib/routes.ts: `productPath()`, `productsHref()`, `readProductSelection()`, `replaceProductSelection()`, `replaceProductColor()`, `redirectPath()` and `toAppHref()`.
- src/proxy.ts (the Next.js 16 name for middleware) redirects old `/?page=…` URLs, old category pages and retired product IDs to the new paths (307). Keep those URLs working.
- Day 3 data still holds old query-string links (`productURL()`, hero-slide `href`). Use `productPath()` and `toAppHref()` in React code; do not change the Day 3 files.
- Next.js splits and loads each route itself. Do not add `React.lazy` for pages or a root `loading.tsx` (it streamed static pages behind a hidden copy). `/products/[id]` has its own `loading.tsx`, `error.tsx` and `not-found.tsx`; `src/app/error.tsx` covers other pages. `error.tsx` uses the `retry` prop (stable since Next.js 16.3).
- Titles use `metadata` and `generateMetadata` with the template `%s | RAHA`; the root page sets an absolute title because the template does not apply to it.
- `useRouteFocus` (in AppShell) moves focus to main after a pathname change, or to the hash target once it appears. Its effect must give the same result if StrictMode runs it twice.

### Server and Client Components

- Put `'use client'` only on components that a Server Component imports and that need hooks, events or Context. Route files, HomePage, FeaturedProducts and ProductGrid are Server Components and pass only plain data or promises to Client Components.
- Never read `window`, `document` or storage during render; read them in effects, event handlers or `useSyncExternalStore` with a server snapshot.
- Do not drive a controlled input from `useSearchParams`. The catalogue selection is read with `useProductSelection` (`useSyncExternalStore` on `location.search`, with the server's search for hydration) and written with `history.replaceState`.
- The intro starts after hydration. `useEntranceMotion` animates only server-rendered content (a hydration flag read once); catalogue cards never animate (CatalogueResults provides EntranceContext as `null`).

### Cart

- Shared cart state uses a React Context provider, not Zustand. README explains why.
- The preserved src/state.ts is the only owner of cart entries and raha-cart storage.
  - src/features/cart/cart-store.ts gives a cached snapshot and change notifications.
  - Only CartProvider calls useCart, which derives lines, count and subtotal. useCart passes an empty server snapshot, so the server render and hydration show an empty cart and the browser cart appears right after (the user accepted the brief 0).
  - CartProvider shares them, the page-scoped add announcement (keyed by pathname) and the actions `add`, `change` and `clear` through CartContext.
- Components read the cart only with useCartContext and change it only through those actions. Never import cart-store.ts or state.ts mutations in components or Server Components, copy cart entries into state, or pass cart callbacks through components that do not use them.
- The cart stays a native modal dialog. Preserve add, increase, decrease, remove and clear, product-and-finish identity, saved-data validation, Escape, focus return and action focus recovery.

### Products API and data loading

- products-api/ is a separate API that serves RAHA products (not the course API). Its JSON is generated from src/data.ts at build time and ignored by Git.
  - `GET /api/products` returns `{ items }`; `GET /api/products/:id` returns one product or 404 with `{ "error": "Product not found" }`.
  - `/delay/<ms>` (max 8000), `/fail/<400-599>` and `/empty` go before `/api`; `/empty` affects only the list.
- src/lib/api/products.ts (`server-only`) is the only products API client. It requests the full `RAHA_API_URL` with the unchanged Day 3 `fetchJson`, `parseProductsResponse` and `mapApiProduct`; one product is validated as a one-item list. `getProducts` and `getProduct` use React `cache()`. Never fetch a relative URL, call the app's own routes, or read src/data.ts in place of the API for catalogue or product data.
- `getProduct` returns `null` for 404, and the page calls `notFound()`; other errors are thrown to `error.tsx`.
- `/products` is `force-dynamic`. It passes the unawaited `getProducts()` promise, a new `requestId` and the server's search to ProductsPage. CatalogueSummary and CatalogueResults read it with `use()` inside Suspense and two Error Boundaries reset by `requestId`. The search, filters and sort stay outside the boundaries. Try again calls `router.refresh()`.
- API test switches: src/proxy.ts strips `/delay`, `/fail` and `/empty` from a page URL and passes them in the `x-raha-test-switches` header (deleted from every incoming request first); the client puts them in front of `/api`. They are on in development and in production only with `RAHA_TEST_SWITCHES=1`.

### Demo checkout and forms

- Registration and contact remain non-sending demos with native validation, as before.
- Forms that use react-hook-form have one Zod schema each through @hookform/resolvers. They do not transmit or store data, and do not take payment details. Do not invent delivery services, fees or prices.
- The demo checkout (`/checkout`, src/features/checkout) is linked from the cart when it has items.
  - Fields: full name, email, street address, city, postal code and a required demo confirmation. Every rule is in checkout-schema.ts.
  - The order summary reads only useCartContext. An empty cart shows a message and a Products link.
  - Success shows a focused confirmation, keeps the cart and discards the values.
  - Keep `aria-invalid` with `aria-describedby` on each field and focus on the first invalid field.
  - Keep ref callbacks that move focus stable at module level. An inline ref callback runs again on every render and steals focus.

### Styles, Tailwind and shadcn/ui

- All CSS is in src/app/globals.css, imported once by the root layout. Do not add other CSS files. Use mobile-first min-width breakpoints at 768px and 1280px (Tailwind `md` and `xl`), no !important and no max-width layout queries. Avoid overflow at 360, 768 and 1280px.
- Tailwind CSS v4 (through `@tailwindcss/postcss`) is set up for the whole project, with preflight. Classes are generated only from src/components, src/features and src/app (`source(none)` and `@source`).
- Design tokens live only in `@theme static`: the RAHA palette, colour roles and shadcn colour names, `font-body` and `font-heading`, the RAHA radii and `gutter`. Tailwind's default colours, fonts and radii are removed.
  - Use token utilities (`bg-panel`, `text-muted`, `rounded-panel`, `font-heading`) or `var(--color-…)`, `var(--radius-…)`; never raw colour values.
  - Do not add colours, dark-mode styles, `!` utilities or `max-*` variants without the user's approval.
- `@layer base` holds element styles and the browser defaults that preflight removes but RAHA needs (dialog margin, button, legend and option padding, option-group weight, placeholder colour). Do not repeat what preflight already sets.
- Gradual conversion to Tailwind:
  - Convert one feature at a time, only when the user asks. Features not yet converted keep their component rules in globals.css.
  - The component rules and the focus ring stay unlayered, so they beat Tailwind classes. When a feature is converted, remove its old rules in the same step, so no element is styled by both.
  - Keep each converted feature's look, responsive behavior, focus, motion and accessibility. Compare computed styles of the affected pages with a baseline at 360, 768 and 1280px, before and after.
- shadcn/ui files in src/components/ui (field, input, label, separator) are project code and follow every rule.
  - Add only components a feature uses, and review all CLI output before keeping it.
  - Use the RAHA Button. shadcn files import with `@/` and explicit extensions; RAHA files keep relative imports.

## RAHA behavior and accessibility

- Home keeps its hero, six featured cards, manual room slider and registration demo. There is one Products catalogue, with case-insensitive name search, category and collection filters and copied-array price sorting.
- Keep finish-specific prices, images and availability, gallery links, dimensions, materials and care, room inspiration links and the floor-area calculator.
- Keep English, semantic landmarks, one h1 per active route, logical headings, labels, alt text, keyboard access, visible focus, accessible contrast and route title and focus updates.
- Preserve entrance skip, Escape, once-per-session, replay and reduced-motion behavior. Clean up its timers, frames and listeners.

## Day 3 reuse policy

Preserve the copied Day 3 types, API, pure logic, data and state modules at their original paths; all 23 are byte-identical to the originals. Only necessary `import type` corrections would be allowed; any other change needs an explanation and the user's explicit approval first. React rendering, events, routing and integration belong in new files. `tsconfig.app.json` sets `erasableSyntaxOnly: false` because the Day 3 `ApiError` uses a constructor parameter property; `strict` stays on.

## Course submission

- typecheck, lint (zero warnings), format:check and build must pass. Husky runs lint-staged, which formats and lints staged files. The Console must show no React warnings.
- Both required skills are installed as real files under .claude/skills (vercel-react-best-practices, vercel-composition-patterns), with hashes in skills-lock.json. Do not modify them.
- README.md must keep the App-rooted tree, routes, props, state owners, commands and API hosting limits. Record only the React DevTools inspections the user reports.
- debug-lab-log.md covers the five course bugs from shopboard-api.vercel.app/debug-lab, with AI disclosure (ChatGPT and Claude).
  - The user did the lab and wrote an Arabic draft. Claude checked it against the lab source, added three clarifications (bugs 1-3) and translated it.
  - The fixes are suggestions and were not applied to the lab. Do not change the log's findings without the user's request.
- DESIGN.md is not mentioned in the course text the user provided; do not create it unless asked.
- Keep the repository clean: no unused files, templates, backups, screenshots, prompts or AI planning files. Retain AGENTS.md and CLAUDE.md.

## Evidence and learning rules

Keep these four kinds of evidence separate, and never claim more than the evidence shows.

1. **Course debug-lab bugs.** The user observed bugs 1-4 in the running lab. Bug 5 (CartRow mutating `item.qty`, then `setCart` with the same array) showed no visible problem in the user's test; it was identified through Claude's source review. Never describe bug 5 as visually observed.
2. **Bugs found by Claude's automated checks or review.** These are listed below. The user did not observe them before they were fixed.
   - The ProductGallery `key` remount that dropped finish focus.
   - The `useRouteFocus` effect not surviving a StrictMode re-run.
   - Catalogue cards animating on a fast API response.
   - The blank app on a failed page file download.
   - The shadcn CLI installing an unrelated `cn` package and writing an index key.
   - During the Next.js migration: `useSearchParams` dropping typed search characters, the intro missing server-rendered content, a hash link losing its target while the page loaded, and a root `loading.tsx` hiding static pages behind a hidden copy.
3. **The user's own manual verification after fixes.** This is not observation of the bugs before they were fixed.
   - React DevTools inspections, as recorded in README.
   - Trying `VITE_API_BASE` (Vite version) with `/delay/3000`, `/fail/500` and `/empty`.
   - The checkout: empty submit, success, and the cart kept afterwards.
4. **The user's own mistakes.** These are reported by the user in their own words. Record only what the user reports, and add a new one only after the user reports a real mistake.
   - **Delay test setup (reported by the user).** This was a problem with how the test was set up, not a bug in the app code.
     - What happened:
       - The user tried to start the dev server on port 5173, but the port was busy.
       - They opened a server on 5174, but the loading message did not appear, even after refreshing and opening a new tab.
       - With ChatGPT's help, they checked the `VITE_API_BASE` environment variable in the terminal they were using. It was empty.
       - They set it and tried to start the server on 5174 again, but that port was now busy.
       - Finally they set `VITE_API_BASE=/delay/3000`, started the server in the same terminal on port 5175 and opened the matching URL. The loading message appeared.
     - Why: Vite reads `VITE_` variables only when the dev server starts, and only from the terminal that starts it. The server on 5174 had been started without the variable, so it still sent normal requests.

The rules below come from these kinds of evidence. Each rule names its source.

1. **Use stable data IDs as list keys, never the array index.** (Lab bug, observed by the user.) With `key={index}`, a saved heart moved from Leather Tote Bag to Wool Scarf after sorting.
2. **Copy an array before sorting it.** (Lab bug, observed by the user.) Sorting the shared array in place kept Wool Scarf first after returning to Featured.
3. **Update props and state immutably, through the owner.** (Lab bug 5, found by source review.) A child requests the change through a typed callback, and the owner sets a new array and new item object.
4. **Do not reset state with a `key` on a component that renders focusable children.** (Found by an automated focus check.) Reset only that state, derived or adjusted during render, and check keyboard focus after such a change.
5. **Make effects safe to run twice.** (Found by an automated dev-mode check.) StrictMode re-runs effects when Suspense reveals content. Do not update refs in a way that changes the second run's result.
6. **Put an Error Boundary around lazy pages, and recover from a failed `React.lazy` with a reload.** (Found by a review check.) Without it, one failed page file blanks the whole app, and resetting the boundary alone does not reload the file.
7. **Before testing an API state, check the environment, the server and the URL together.** (The user's own mistake in the delay test setup, made with the Vite version's `VITE_API_BASE`.) With Next.js, follow these steps in order:
   1. Start the products API and confirm it answers, for example `http://127.0.0.1:4000/api/products`.
   2. Set `RAHA_API_URL` (and `RAHA_TEST_SWITCHES=1` for `npm run start`) in the terminal that will start Next.js, or in `.env.local`, and print it to confirm the value.
   3. Start a new Next.js server from that terminal. A server that is already running keeps the values it started with, and refreshing the browser does not change them.
   4. Read the port Next.js prints. If the port is busy, choose a free one with `--port`. Open exactly that URL, using `localhost` in development.
   5. Open the page with the switch in front, for example `/delay/3000/products`, and confirm the result before suspecting the app code.
8. **Do not drive a controlled input from state that updates later than the input.** (Found by an automated check during the Next.js migration.) `useSearchParams` updated after `history.replaceState`, so typing "Lamp" in the search field produced "Lp". Read such URL state synchronously (`useSyncExternalStore`), and test fast typing after changing how an input gets its value.
