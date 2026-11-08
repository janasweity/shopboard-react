# RAHA course React rules

## Requirements and workflow

The user's attached RAHA React Architecture and Migration Planning requirements resolve the earlier uncertainty about tool names, skills, delivery filenames and stages. The original is read-only; the verified React root is C:/Users/morjm/OneDrive/Desktop/shopboard-react/shopboard-react.

Stages 3-5 (API catalogue, cart, product details, forms, rooms, about, entrance) are implemented and browser-verified. DESIGN.md is not a confirmed requirement in the course text. MIGRATION_PLAN.md was removed with the user's approval. Create commits only after the user approves them. Do not configure a remote, push, deploy or upload. Recompare protected modules after any pre-commit hook; do not change them.

Architecture source of truth: README.md describes the implemented component tree, props and state ownership. The implemented README architecture is the reference. Do not add parallel cart modules such as CartSummary or NotificationRegion.

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
- Tailwind CSS v4 is used only for shadcn/ui components.
  - main.css imports only tailwindcss/theme.css and utilities.css in cascade layers. Never add preflight, and keep utilities generated only from src/components/ui (and later the checkout feature) through source(none) and @source.
  - RAHA rules stay unlayered, so they win.
  - shadcn colour names are defined in tokens.css and point to existing RAHA tokens. Do not add new colours, dark-mode styles, `!` utilities or `max-*` variants.
  - After any style setup change, compare computed styles of the existing pages with a baseline.
- shadcn/ui files in src/components/ui are project code and follow every project rule. Add only components a feature uses.
  - Review everything the shadcn CLI writes before keeping it: package.json, imports, list keys and TypeScript.
  - Its first run imported `cn` from an unrelated npm package and installed it. It also produced an index list key.
  - Use the RAHA Button, not a shadcn Button. shadcn files import with the `@/` alias and explicit extensions; RAHA files keep relative imports.
- Forms use react-hook-form with one Zod schema per form through @hookform/resolvers. They do not transmit or store data, and do not take payment details. Do not invent delivery services, fees or prices.
- The demo checkout (`/?page=checkout`, src/features/checkout) is a lazy page.
  - Fields: full name, email, street address, city, postal code and a required demo confirmation. Every rule is in checkout-schema.ts.
  - The order summary reads only useCartContext.
  - Success shows a focused confirmation, keeps the cart and discards the values.
  - Keep `aria-invalid` with `aria-describedby` on each field, focus on the first invalid field, and RAHA classes for the look.
  - Keep ref callbacks that move focus stable (module-level). An inline ref callback runs again on every render and steals focus.
- Preserve entrance skip/Escape/session/replay behavior and reduced motion; clean up timers, frames, media-query listeners and route listeners. The entrance may play on the first page of a session and stops on navigation. Content arrival motion (hero image, h1, search field, staggered cards) uses the original classes and timings through EntranceContext and useEntranceMotion. It applies only to content mounted before the intro started.
- Shared cart state uses a React Context provider, not Zustand. The preserved src/state.ts stays the only owner of cart entries and raha-cart storage.
  - src/features/cart/cart-store.ts gives a cached snapshot and change notifications.
  - Only CartProvider (src/features/cart/CartProvider.tsx) calls useCart, which derives lines, count and subtotal.
  - CartProvider shares the cart, the page-scoped add announcement and the actions add, change and clear through CartContext (src/features/cart/cart-context.ts).
- Components read the cart only with useCartContext and change it only through those Context actions. Never import cart-store.ts or state.ts mutations in components, copy cart entries into Context or component state, or pass cart callbacks through components that do not use them.

## Day 3 reuse and conflict policy

Preserve types, API, pure logic and state modules at their original paths with their dependency closure. Only necessary import type corrections are allowed in protected copies. React rendering, events, routing and integration belong in new files; do not copy old DOM templates/initializers into the React UI. Any proposed exception requires explanation and explicit approval before the protected change; approval alone does not certify course compliance.

Stage 1 reported TS1294 for the original ApiError parameter-property syntax before changing configuration. The planned target-only adjustment sets erasableSyntaxOnly=false in tsconfig.app.json while strict remains true; the protected API client is byte-identical to its original. The products endpoint is Vite middleware, so deployed static assets require a functioning API route/backend.

## Course setup and submission

- Stage 0 created a separate React repository at the verified target root; no parent Git repository was inherited. Stage 0 files are saved in b8fccdf; Stage 1 in e50b287; Stage 2 in 07d4702; Stages 3-5 in 49fd304.
- Require successful production build and lint with zero warnings, Prettier, Husky, lint-staged, strict typing without prohibited shortcuts, and no React warnings in the Console.
- Both required skills are installed as real copies under .claude/skills: vercel-react-best-practices and vercel-composition-patterns. Source hashes are in skills-lock.json. These installed skill files are tracked in Stage 0 commit b8fccdf. Do not commit without the user's approval.
- Require at least six reusable TSX components, each in its own file with a typed Props interface and actual reuse.
- Final README.md must include the actual App-rooted tree, exact files, props, state owners, commands and API hosting limitations. Verify tree and ownership with React DevTools Components.
- Deliver debug-lab-log.md. DESIGN.md is not mentioned in the course text the user provided, so it is not a confirmed course requirement. It was only part of our own plan. The log must cover the five course bugs from shopboard-api.vercel.app/debug-lab: what was seen, the component, how it was found, the cause and the fix, plus AI disclosure. The user performed the debug lab and wrote an Arabic draft of the log. At the user's request, Claude checked that draft against the lab source, added three clarifications (bugs 1-3) and translated it into English as debug-lab-log.md. Bugs 1-4 were observed by the user in the running lab. Bug 5 (CartRow mutates item.qty, then App calls setCart with the same array) showed no visible problem in the user's test: quantity, total and DevTools props matched. It was identified through Claude's source review. Never describe bug 5 as visually observed. The fixes are suggestions and were not applied to the lab. The log's AI disclosure names ChatGPT and Claude. Do not invent findings or change the log's content without the user's request. Do not create DESIGN.md on the user's behalf unless asked.
- Final repository must be clean with current documents and no unused templates, backups, screenshots, prompts or AI planning files. The unused Vite starter files (App.css, index.css, src/assets, public/icons.svg, public/favicon.svg) were removed with the user's approval. MIGRATION_PLAN.md was removed with the user's approval after the plan review. The image-generation prompts in public/images/inspiration/README.md were removed; the source and AI-use disclosure for those images remains. Retain AGENTS.md and CLAUDE.md.

## Rules based on observed mistakes — pending personal learning

Required: at least three rules derived from mistakes the user actually observes during React work. Rules 1-3 come from debug-lab bugs the user reviewed. They are course-lab bugs, not mistakes in the user's own RAHA code. Rule 4 comes from a real bug in the RAHA code, found by an automated check, not by the user personally. Do not claim more than the evidence shows. Add further rules only after a real observation, recorded with the user.

1. **Use stable data IDs as list keys, never the array index.** Evidence: the user saw a debug-lab bug where ProductList used `key={index}`. After sorting by price, the saved heart moved from Leather Tote Bag to Wool Scarf, because the `saved` state in ProductCard followed the position, not the product. Rule: key list items by `product.id` or another stable unique data value.
2. **Copy an array before sorting it.** Evidence: the user saw a debug-lab bug where ProductList called `products.sort(...)` on the shared PRODUCTS array. After switching back to Featured, the original order did not return and Wool Scarf stayed first. Rule: sort a copy (`[...items].sort(...)` or `toSorted`) and never sort props or state in place.
3. **Update props and state immutably, through the owner.** Evidence: in the debug-lab bug 5, CartRow set `item.qty` directly, then App called `setCart(cart)` with the same array. This showed no visible problem in the user's test. It was found through Claude's source review, not visual observation. Rule: a child requests the change through a typed callback, and the owner sets a new array and a new item object, for example `setCart((prev) => prev.map(...))`.
4. **Do not reset state with a `key` on a component that renders focusable children.** Evidence: this is a real bug in the RAHA code. ProductDetailsPage rendered `<ProductGallery key={variant.id}>` with VariantSelector inside it as children. Choosing a finish remounted the gallery, replaced the clicked swatch button and moved keyboard focus to the body. It was found by Claude's automated Playwright focus check on 2026-11-08, and the same result was reproduced on the earlier commit. The user did not test it personally. The fix removed the `key`. ProductGallery stores the chosen view with a product-and-finish key and resets it during render when that key changes. Rule: when state must reset on a prop change, reset only that state (derive it, or adjust it during render). Use a `key` remount only when nothing inside holds focus or other state that must survive. After such a change, check keyboard focus.
