# RAHA React rules

## Project and workflow

RAHA is the React + TypeScript version of the user's Day 3 ShopBoard project. The React root is C:/Users/morjm/OneDrive/Desktop/shopboard-react/shopboard-react. The Day 3 project (C:/Users/morjm/OneDrive/Desktop/shopboard) is read-only.

README.md is the source of truth for the component tree, routes, props, state ownership, API and verification results. Keep it aligned with the code after every change.

- Commit, push, deploy or upload only after the user approves that specific action. The repository has a GitHub remote (`origin`). Never force-push.
- Do not delete files without the user's approval, and preview any deletion first.
- Recompare the protected Day 3 modules after any pre-commit hook run; do not change them.
- Explain what changed, where and why after every implementation step, including checks and limitations. Explain to the user in simple Arabic.

## Shared React rules

- Use Vite, React and strict TypeScript. Use .tsx for components; .ts for types, API clients, state modules, hooks without JSX and pure logic.
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

### Routing and pages

- Routes use the query string on `/`: `?page=products`, `product`, `inspiration`, `about` and `checkout`. Anything else is the 404 page.
  - `useRoute` (src/app/useRoute.ts) reads the URL with `useSyncExternalStore`, and `navigation.ts` handles links, legacy URLs and retired IDs.
  - No router package is used.
- Every page is lazy. The `React.lazy` declarations stay fixed at module level in src/app/lazy-pages.ts, and AppRoute imports them. Never choose or create components during render, which Oxlint `react/static-components` rejects.
- In App, only the page area waits or fails. The order is ErrorBoundary, then Suspense ("Loading page..."), then AppRoute. The header, footer, cart dialog and cart status stay outside both.
  - React.lazy keeps a failed import, so the page Error Boundary's Try again reloads the document.
  - `resetKey={page}` clears the error when another page opens.
- `useRouteFocus` runs inside AppRoute, so focus and hash scrolling happen after a lazy page is shown.
  - Its effect must give the same result if StrictMode runs it twice. It updates the previous URL only when the focus move runs.
- The entrance intro starts after the first page is shown. AppRoute calls `onReady`, App sets `pageReady`, and `useEntrance` waits for it.
  - Arrival motion applies only to content mounted before the intro starts.
  - Catalogue cards never animate, because CatalogueResults provides EntranceContext as `null`.

### Cart

- Shared cart state uses a React Context provider, not Zustand. README explains why.
- The preserved src/state.ts is the only owner of cart entries and raha-cart storage.
  - src/features/cart/cart-store.ts gives a cached snapshot and change notifications.
  - Only CartProvider calls useCart, which derives lines, count and subtotal.
  - CartProvider shares them, the page-scoped add announcement and the actions `add`, `change` and `clear` through CartContext.
- Components read the cart only with useCartContext and change it only through those actions. Never import cart-store.ts or state.ts mutations in components, copy cart entries into state, or pass cart callbacks through components that do not use them.
- The cart stays a native modal dialog. Preserve add, increase, decrease, remove and clear, and product-and-finish identity. Also preserve restore before first display, saved-data validation, Escape, focus return and action focus recovery.

### Products API and data loading

- tooling/products-api.ts is Vite dev and preview middleware. It serves RAHA products, not the course API.
  - `GET /api/products` returns `{ items }` and is unchanged.
  - `GET /api/products/:id` returns one product, or 404 with `{ "error": "Product not found" }`.
  - The `/delay/<ms>` (max 8000), `/fail/<400-599>` and `/empty` switches go before `/api`, and `/empty` affects only the list.
  - A static deployment of dist/ has no API.
- `VITE_API_BASE` (src/features/products/api/api-base.ts) is the one base URL for the list and one-product requests. It may be empty, start with `/`, or be an http(s) URL. Vite reads it when the dev server starts or at build time.
- src/features/products/api/products-resource.ts loads both requests with the unchanged Day 3 `fetchJson`, `parseProductsResponse` and `mapApiProduct`. One product is validated as a one-item list.
  - The promises are cached, so React's `use()` gets a stable promise and there are no duplicate requests.
  - A failed request stays cached until its retry function runs. Never start a new request from render after a failure.
- The Products page uses Suspense and two Error Boundaries. The summary and the results each have one, keyed together by `attempt`.
  - The search, filters and sort stay outside the boundaries.
  - The protected Day 3 `loadProducts` is not used, because it cannot take a base URL.
- ProductDetailsPage uses an Error Boundary keyed by product ID around Suspense.
  - `ApiError` 404 shows the not-found view. Other errors show Try again, which calls `retryProduct`.
  - Finish changes use the cached product.

### Demo checkout and forms

- Registration and contact remain non-sending demos with native validation, as before.
- Forms that use react-hook-form have one Zod schema each through @hookform/resolvers. They do not transmit or store data, and do not take payment details. Do not invent delivery services, fees or prices.
- The demo checkout (`/?page=checkout`, src/features/checkout) is a lazy page, linked from the cart when it has items.
  - Fields: full name, email, street address, city, postal code and a required demo confirmation. Every rule is in checkout-schema.ts.
  - The order summary reads only useCartContext. An empty cart shows a message and a Products link.
  - Success shows a focused confirmation, keeps the cart and discards the values.
  - Keep `aria-invalid` with `aria-describedby` on each field and focus on the first invalid field.
  - Keep ref callbacks that move focus stable at module level. An inline ref callback runs again on every render and steals focus.

### Styles, Tailwind and shadcn/ui

- Keep tokens in src/styles/tokens.css and active styles in src/styles/main.css. Use mobile-first min-width breakpoints at 768px and 1280px, no !important and no max-width layout queries. Avoid overflow at 360, 768 and 1280px.
- Tailwind CSS v4 is used only for shadcn/ui components.
  - main.css imports only theme.css and utilities.css in cascade layers, with no preflight. Utilities are generated only from src/components/ui (`source(none)` and `@source`).
  - RAHA rules stay unlayered, so they win.
  - shadcn colour names in tokens.css point to existing RAHA tokens. Do not add new colours, dark-mode styles, `!` utilities or `max-*` variants.
  - After a style setup change, compare computed styles of the existing pages with a baseline.
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
3. **The user's own manual verification after fixes.** This is not observation of the bugs before they were fixed.
   - React DevTools inspections, as recorded in README.
   - Trying `VITE_API_BASE` with `/delay/3000`, `/fail/500` and `/empty`.
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
7. **Before testing an API state, check the environment, the server and the URL together.** (The user's own mistake in the delay test setup.) Follow these steps in order:
   1. Set `VITE_API_BASE` in the terminal that will start the server, and print it to confirm the value.
   2. Start a new dev server from that same terminal. A server that is already running keeps the value it started with, and refreshing the browser does not change it.
   3. Read the port Vite prints. If the port is busy, choose a free one with `--port`.
   4. Open the URL with exactly that port.
   5. In the Network tab, confirm the request path starts with the prefix, for example `/delay/3000/api/products`.

   If the expected state does not appear, check these setup steps before suspecting the app code.
