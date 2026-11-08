# RAHA React

RAHA is a concept furniture and home store. This repository is the React + TypeScript version of the Day 3 ShopBoard project. The Day 3 repository is kept unchanged. Its typed product, cart, room and state modules are reused here unchanged, and the whole UI is rebuilt in React.

## Setup

Run all commands from the folder that contains package.json. You need Node.js 22.22.1 or newer and npm. In PowerShell, use `npm.cmd` if the execution policy blocks `npm.ps1`.

```sh
npm ci            # install exact dependencies; also installs the Husky hook
npm run dev       # start Vite with the local /api/products endpoint
npm run build     # type-check (tsc -b) and build for production
npm run preview   # serve the production build, also with /api/products
```

`npm run dev` uses port 5173 with `strictPort`. If that port is busy, choose another one, for example `npm run dev -- --port 5174`.

## Verification commands

```sh
npm run typecheck     # strict TypeScript for the app and the Vite config
npm run lint          # Oxlint, fails on any warning
npm run format:check  # Prettier check (npm run format applies it)
npm run build
```

Lint rejects `any`, type assertions, non-null assertions and error-suppression comments. The pre-commit hook (`.husky/pre-commit`) runs lint-staged: staged JS/TS files are formatted and then linted, and staged JSON/CSS/HTML/Markdown/YAML files are formatted. Vendored skill files are excluded from lint and formatting.

## Project skills

Both required skills are installed as real files and tracked in Git. `skills-lock.json` records their source and content hashes.

- `.claude/skills/vercel-react-best-practices/`
- `.claude/skills/vercel-composition-patterns/`

## Reused Day 3 modules

These 23 files are byte-identical copies of the Day 3 originals, at the same relative paths. No `import type` corrections were needed.

- `src/shared/api/api-client.ts`
- `src/modules/products/products.types.ts`, `products.api.types.ts`, `products.api.ts`, `products.client.ts`, `products.logic.ts`
- `src/modules/cart/cart.types.ts`, `cart.logic.ts`
- `src/modules/rooms/rooms.logic.ts`
- `src/modules/state/session.ts`
- `src/state.ts`
- `src/data.ts`, `src/data/*.ts` (catalogue data, imagery, inspiration rooms, hero slides)
- `src/product-gallery.ts`

The Day 3 `ApiError` class uses a constructor parameter property. That syntax is rejected by `erasableSyntaxOnly`, so `tsconfig.app.json` sets `erasableSyntaxOnly: false`; `strict` stays on.

## Component tree

Every component lives in its own `.tsx` file. Arrows show what a component renders. Plain HTML elements are not listed.

```text
App                                        src/App.tsx
└── CartProvider                           src/features/cart/CartProvider.tsx
    ├── SiteHeader                         src/features/layout/SiteHeader.tsx
    ├── main
    │   ├── Suspense (fallback: StatusMessage "Loading page...")
    │   │   AppRoute                       src/app/AppRoute.tsx  (renders one lazily loaded page)
    │   │   ├── HomePage                   src/features/home/HomePage.tsx
    │   │   │   ├── Hero                   src/features/home/Hero.tsx
    │   │   │   ├── FeaturedProducts       src/features/home/FeaturedProducts.tsx
    │   │   │   │   └── ProductGrid        src/features/products/components/ProductGrid.tsx
    │   │   │   │       └── ProductCard    src/features/products/components/ProductCard.tsx
    │   │   │   │           └── Button     src/components/Button.tsx
    │   │   │   ├── RoomSlider             src/features/home/RoomSlider.tsx
    │   │   │   │   ├── Button
    │   │   │   │   └── StatusMessage      src/components/StatusMessage.tsx
    │   │   │   └── RegistrationSection    src/features/forms/RegistrationSection.tsx
    │   │   │       ├── FormField          src/components/FormField.tsx
    │   │   │       └── Button
    │   │   ├── ProductsPage               src/features/products/pages/ProductsPage.tsx
    │   │   │   ├── CatalogueControls      src/features/products/components/CatalogueControls.tsx
    │   │   │   │   ├── FormField
    │   │   │   │   └── Button
    │   │   │   ├── StatusMessage
    │   │   │   └── ProductGrid → ProductCard → Button
    │   │   ├── ProductDetailsPage         src/features/products/pages/ProductDetailsPage.tsx
    │   │   │   ├── ProductGallery         src/features/products/components/ProductGallery.tsx
    │   │   │   │   └── VariantSelector    src/features/products/components/VariantSelector.tsx
    │   │   │   └── Button
    │   │   ├── InspirationPage            src/features/rooms/InspirationPage.tsx
    │   │   │   ├── RoomSection (×3)       src/features/rooms/RoomSection.tsx
    │   │   │   └── RoomCalculator         src/features/rooms/RoomCalculator.tsx
    │   │   │       ├── FormField
    │   │   │       └── Button
    │   │   ├── AboutPage                  src/features/about/AboutPage.tsx
    │   │   │   └── ContactForm            src/features/about/ContactForm.tsx
    │   │   │       ├── FormField
    │   │   │       └── Button
    │   │   └── NotFoundPage               src/pages/NotFoundPage.tsx
    │   │       └── StatusMessage
    │   └── CartStatus (live region)       src/features/cart/CartStatus.tsx
    ├── SiteFooter                         src/features/layout/SiteFooter.tsx
    ├── CartDialog                         src/features/cart/CartDialog.tsx
    │   ├── CartLineItem (one per line)    src/features/cart/CartLineItem.tsx
    │   │   └── QuantityControl            src/features/cart/QuantityControl.tsx
    │   └── Button
    └── EntranceOverlay (while playing)    src/features/entrance/EntranceOverlay.tsx
```

App wraps everything in `EntranceContext` (`src/features/entrance/entrance-motion.ts`). Hero, ProductCard, CatalogueControls and every page heading read it through `useEntranceMotion`.

Inside it, `CartProvider` shares the cart through `CartContext` (`src/features/cart/cart-context.ts`). SiteHeader, ProductCard, ProductDetailsPage, CartDialog and CartStatus read it with `useCartContext`. Components between App and these consumers no longer receive cart props.

## Lazy-loaded pages

AppRoute loads each page with `React.lazy` and a dynamic `import()`: HomePage, ProductsPage, ProductDetailsPage, InspirationPage, AboutPage and NotFoundPage. Vite builds each page into its own JavaScript file, and the browser downloads it the first time that page opens.

In App, a `Suspense` boundary wraps only AppRoute. While a page file downloads, it shows `StatusMessage` with "Loading page...". SiteHeader, SiteFooter, the cart dialog and CartStatus stay on screen and usable.

Two parts of the app wait for the page:

- `useRouteFocus` (`src/app/useRouteFocus.ts`) runs inside AppRoute, so it moves focus and scrolls only after the page is on screen. Hash links such as `/?page=about#returns` therefore find their target on a page that was not loaded yet.
- The entrance intro starts once the first page is shown. AppRoute calls `onReady`, which sets `pageReady` in App, and `useEntrance` waits for it. The page content is then mounted before the intro starts, so the original arrival motion still applies to it.

`VariantSelector` is written inside `ProductDetailsPage` and passed to `ProductGallery` as `children`, so it renders between the main photo and the thumbnails. `NotFoundPage` is used both for unknown routes and for unknown product IDs.

## Props

`AddHandler` is `(productId: string, variantId: string) => void`, exported from `src/features/cart/cart-store.ts`. `Route` is the route union in `src/app/route.types.ts`.

| Component           | Props                                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App                 | none                                                                                                                                                        |
| SiteHeader          | `route: Route`, `onOpenCart: () => void` (reads `quantity` from `useCartContext`)                                                                           |
| AppRoute            | `route: Route`, `onReady: (ready: boolean) => void` (called after the first page is shown)                                                                  |
| HomePage            | `products: readonly Product[]`                                                                                                                              |
| Hero                | `image: string`, `alt: string`                                                                                                                              |
| FeaturedProducts    | `products: readonly Product[]`                                                                                                                              |
| RoomSlider          | `slides: readonly (typeof heroSlides)[number][]`                                                                                                            |
| RegistrationSection | none                                                                                                                                                        |
| ProductsPage        | `selection: ProductSelection`                                                                                                                               |
| CatalogueControls   | `selection: ProductSelection`, `onChange: (selection: ProductSelection) => void`, `onReset: () => void`                                                     |
| ProductGrid         | `products: readonly Product[]`                                                                                                                              |
| ProductCard         | `product: Product`, `position: number` (grid position, used only to stagger the intro motion); reads `add` from `useCartContext`                            |
| ProductDetailsPage  | `product: Product`, `colorId: string \| null`; reads `add` from `useCartContext`                                                                            |
| ProductGallery      | `product: Product`, `variant: ProductVariant`, `children: ReactNode`                                                                                        |
| VariantSelector     | `variants: readonly ProductVariant[]`, `selected: ProductVariant`, `onSelect: (variantId: string) => void`                                                  |
| InspirationPage     | none                                                                                                                                                        |
| RoomSection         | `room: InspirationRoom`, `position: number`                                                                                                                 |
| RoomCalculator      | none                                                                                                                                                        |
| AboutPage           | none                                                                                                                                                        |
| ContactForm         | none                                                                                                                                                        |
| NotFoundPage        | `heading?: string`                                                                                                                                          |
| SiteFooter          | `year: number`                                                                                                                                              |
| CartProvider        | `page: Route['page']`, `children: ReactNode`                                                                                                                |
| CartStatus          | none; reads `status` from `useCartContext`                                                                                                                  |
| CartDialog          | `open: boolean`, `onClose: () => void`; reads the cart and its actions from `useCartContext`                                                                |
| CartLineItem        | `line: CartLine`, `onAction: (key: string, action: CartAction) => void`                                                                                     |
| QuantityControl     | `quantity: number`, `itemLabel: string`, `finishName: string`, `cartKey: string`, `onDecrease: () => void`, `onIncrease: () => void`                        |
| EntranceOverlay     | `overlayRef: RefObject<HTMLElement \| null>`, `skipRef: RefObject<HTMLButtonElement \| null>`, `onSkip: () => void`                                         |
| Button              | all native `ButtonHTMLAttributes<HTMLButtonElement>` plus `tone?: 'primary' \| 'secondary'`; `type` defaults to `button`                                    |
| FormField           | `id: string`, `label: string`, `hint?: string`, `error?: string`, `className?: string`, `children: ReactNode`                                               |
| StatusMessage       | `kind: 'loading' \| 'error' \| 'empty' \| 'no-match' \| 'success'`, `message: string`, `className?: string`, `onRetry?: () => void`, `onReset?: () => void` |

Reusable components with more than one call site or many data-driven instances: Button, FormField, StatusMessage, ProductGrid, ProductCard, CartLineItem, QuantityControl, RoomSection and NotFoundPage.

## State ownership

| State                                 | Owner                                                                                                                                     | How it changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Current page and URL parameters       | Browser URL, read by `useRoute` (`src/app/useRoute.ts`) in App; `useRouteFocus` in AppRoute handles focus and scroll after a route change | Links call `handleRouteClick` (pushState). Search/filter/sort call `replaceProductSelection`, and finish choice calls `replaceProductColor` (both use replaceState). `useSyncExternalStore` re-renders on popstate, hashchange and the app's navigation event.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Search, category/collection, sort     | URL (`q`, `category`/`collection`, `sort`)                                                                                                | `ProductsPage` gets `selection` from the route. The visible list is derived with `selectProducts` (copied array, no mutation) and is never stored in state.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Catalogue request                     | `useProducts` hook in ProductsPage                                                                                                        | `loading` / `error` / `success` union state. `retry` sets loading and starts a new request; stale responses are ignored with a request counter.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Cart entries and `raha-cart` storage  | Day 3 `src/state.ts`                                                                                                                      | Components call only the Context actions `add`, `change` and `clear` from `CartProvider`. They use `src/features/cart/cart-store.ts` (`addToCart`, `changeCart`, `emptyCart`), which keeps a cached snapshot and notifies subscribers. The Context holds no copy of the entries.                                                                                                                                                                                                                                                                                                                                                                                                               |
| Cart lines, count, subtotal           | Derived in `useCart` (`src/features/cart/useCart.ts`), called only by `CartProvider`                                                      | `calculateCart(snapshot)`. Shared through `CartContext` with SiteHeader (count) and CartDialog; never stored as separate state.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| First page shown                      | App (`pageReady`)                                                                                                                         | Set to `true` by `AppRoute.onReady` after the first lazily loaded page is on screen. It is used only to start the entrance intro.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Cart open/closed                      | App (`cartOpen`)                                                                                                                          | `SiteHeader.onOpenCart` opens it; `CartDialog.onClose` closes it (close button, Continue, Escape).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Cart add announcement                 | CartProvider (`announcement`)                                                                                                             | Set by the Context `add` action and shown by `CartStatus`. It stores the page where it was set, so it disappears on navigation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Cart keyboard focus after an action   | CartDialog (`pendingFocus` ref)                                                                                                           | After an increase/decrease/remove/clear, focus moves to the same control, or to Close/Continue.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Selected finish                       | URL `color`                                                                                                                               | `ProductDetailsPage` derives the variant with `getVariant`; `VariantSelector.onSelect` updates the URL.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Gallery view                          | ProductGallery (`chosen`: `finishKey` and `viewId`)                                                                                       | Thumbnail clicks set it. `finishKey` is the product ID plus the finish ID. When the finish or product changes, ProductGallery resets it to the product photo during render, without an effect or a `key` remount. The finish buttons are therefore not replaced and keep keyboard focus.                                                                                                                                                                                                                                                                                                                                                                                                       |
| Active room slide                     | RoomSlider (`activeId`)                                                                                                                   | Slide buttons.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Registration open, status, form reset | RegistrationSection (`open`, `status`, `formKey`)                                                                                         | A valid submit closes the non-modal dialog and shows the demo status. The form key changes, so the inputs are cleared. Reopen shows an empty form.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Contact status, form reset            | ContactForm (`status`, `formKey`)                                                                                                         | A valid submit shows the demo message and clears the form. Nothing is sent.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Room dimensions and area              | RoomCalculator (`width`, `length`, `area`)                                                                                                | Controlled inputs; submit calls the Day 3 `calculateRoomArea`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Entrance intro and content motion     | `useEntrance` hook in App (`startedAt`, `claimed` ref), started after App `pageReady` is true                                             | The intro waits until the first lazily loaded page is shown. The Day 3 `claimEntranceSession` decides once per session (`?intro=replay` replays); reduced motion skips it. `startedAt` is shared through `EntranceContext`. `useEntranceMotion` adds `entrance-hero` (2100 ms), `entrance-copy` for the h1 (2350 ms), `entrance-search` (2450 ms) and `entrance-card` (2550 ms + 50 ms per card, up to 11), but only to content mounted before the intro started. Skip, Escape, the 3750 ms timer, switching to reduced motion, moving focus away or navigating set `startedAt` to null. That removes every class at once, so content shows immediately; Skip and Escape return focus to main. |

List keys always come from data: `product.id`, `line.key` (product + finish), `variant.id`, gallery `view.id`, `slide.id`, `room.id`, and category or collection IDs.

## Products API and hosting

`tooling/products-api.ts` adds a products API to the Vite dev and preview servers. It serializes the RAHA catalogue from `src/data.ts` with the Day 3 `serializeProducts`, so prices are in cents. Every response has `Content-Type: application/json` and `Cache-Control: no-store`. Methods other than GET get `405` with `Allow: GET`.

| Request                 | Response                                                                                                                                                                                |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/products`     | `200` with `{ "items": [ApiProduct, ...] }`. This is the original list contract and is unchanged.                                                                                       |
| `GET /api/products/:id` | `200` with one `ApiProduct`, the same object as in the list. RAHA IDs are text, for example `/api/products/arc-sofa`. An unknown ID gets `404` with `{ "error": "Product not found" }`. |

Test switches go at the start of the path, before `/api`, as in the course API. They work for both endpoints and can be combined, for example `/delay/2000/fail/503/api/products`:

| Switch                     | Effect                                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| `/delay/3000/api/products` | Waits 3000 ms, then answers normally. The delay is capped at 8000 ms.                               |
| `/fail/500/api/products`   | Answers `500` with `{ "error": "Simulated error 500" }`. Codes 400-599 work; others get `400`.      |
| `/empty/api/products`      | Returns `{ "items": [] }`. It affects only the list; `/empty/api/products/:id` returns the product. |

The Products page loads through the Day 3 `loadProducts` client, which always requests `/api/products`, validates the payload and converts cents to dollars. There is no static fallback: a failed request shows the error state with Try again. The single-product endpoint and the switches can be requested directly; the UI does not use them yet.

Home, details, cart validation and inspiration use the same static catalogue as the API, so product and finish IDs always agree.

Hosting limitations:

- The API, including `/api/products/:id` and the `/delay`, `/fail` and `/empty` switches, exists only in `npm run dev` and `npm run preview`. It is Vite middleware, not part of `dist/`.
- A static deployment of `dist/` alone has no `/api` routes. It needs a real server route or backend that serves the same contract and switches. Without one, the Products page shows its error state.
- This API serves RAHA products. It is not the course API at `shopboard-api.vercel.app`, which has 12 fixed products with numeric IDs and a different shape.

## Verification status

Last run on 2026-11-06:

- `npm run typecheck`, `npm run lint` (0 warnings), `npm run format:check` and `npm run build` all pass.
- All 23 reused Day 3 files are byte-identical to the originals.
- A Playwright browser run against the dev server passed 66/66 checks (exit status 0). It covered:
  - The API, search, category and collection filters, both sort directions, the default order after sorting, no-match and reset, and URL restore.
  - Loading, error with Try again, and empty states.
  - Every cart action, persistence after refresh, and rejected malformed or invalid saved data.
  - Modal focus and Escape.
  - Details, finish URL and gallery.
  - Registration, contact and calculator validation.
  - Entrance session, replay, skip and reduced motion.
  - Back/Forward.
  - No horizontal overflow at 360, 768 and 1280px on every route.
- No unexpected console warnings, page errors or failed resources appeared. The only failures were requests the tests broke on purpose: one POST returning 405, and two aborted GET `/api/products` requests (two because StrictMode runs effects twice in development).
- A separate entrance run passed 26/26 checks (exit status 0) with no console warnings, page errors or failed resources. It covered:
  - The original classes and delays on the hero image, the h1 on every page type, the search field and the staggered featured cards.
  - Catalogue cards loaded later from the API are not animated, as in the original.
  - Escape, Skip and the timer remove all classes, show content at full opacity and restore focus.
  - Navigation stops the intro, and no timer is left running.
  - Reduced motion, both from the start and switched on mid-intro, disables the motion.
  - There is no replay within the same session.
- On 2026-11-08, after the cart moved to `CartProvider`, the four commands above passed again. A Playwright cart run passed 21/21 checks with no console warnings or errors. It covered:
  - Add from Home, Products and a details page.
  - The header count, the add announcement and its removal on navigation.
  - Restore after refresh.
  - Increase, decrease, remove and clear, with focus recovery.
  - Escape closing the dialog.
- On 2026-11-08, after pages became lazy-loaded, the four commands passed again. `npm run build` wrote a separate file for each page: HomePage, ProductsPage, ProductDetailsPage, InspirationPage, AboutPage and NotFoundPage. Playwright runs against the production preview and against the dev server (StrictMode) passed with no console warnings or errors:
  - Lazy loading (27/27):
    - Home downloads only the HomePage file, and other page files download on first navigation.
    - "Loading page..." shows while a page downloads, and the header, footer and cart stay usable.
    - Focus moves to main after navigation.
    - Hash links such as `/?page=about#returns` reach their target, after navigation and on a direct load.
    - The intro still adds its arrival classes to the first page, but not to catalogue cards loaded from the API.
    - Escape, the once-per-session rule and the 404 page still work.
  - The cart run again (21/21).
  - A focus run (8/9). Typing in search and choosing a finish do not move focus to main, real navigation does, and Back/Forward work. The failed check was the finish focus loss fixed below.
- On 2026-11-08, after the finish focus fix, the four commands passed again. On the dev server and the production preview, these Playwright runs passed with no console warnings or errors:
  - The focus run (17/17). Choosing a finish by click or keyboard keeps focus on that swatch. A new finish shows the product photo, and returning to an earlier finish does not bring back its old view.
  - The lazy-loading run (27/27).
  - The cart run (21/21).
- On 2026-11-08, after the API gained `/api/products/:id` and the test switches, an API run passed 24/24 on both the dev server and the production preview. It covered:
  - The unchanged list contract.
  - One product by ID matching its list item, and `404` for an unknown or badly encoded ID.
  - Delay timing, including the 8000 ms cap.
  - `/fail/500` and `/fail/503` on both endpoints, and `400` for a code outside 400-599.
  - `/empty` affecting only the list, and a combined delay and fail.
  - `405` for POST, app pages still served as HTML, and a switch without `/api` not being treated as the API.

  The lazy-loading run (27/27) and the cart run (21/21) passed again on the preview.

- React DevTools Components tab (inspected before the cart moved to `CartProvider`; App no longer calls `useCart`, so CartProvider now shows the Cart hook): the user inspected these components:
  - App, with the custom hooks Route, Cart and Entrance. In the code, these are `useRoute` (the current page from the URL), `useCart` (derived cart lines, count and subtotal) and `useEntrance` (the intro state).
  - The Home page (HomePage), ProductsPage and ProductCard.
  - RoomSlider. It receives `slides` from HomePage. Its `activeId` state started as `"living"` and changed when another room was selected.
  - RegistrationSection. It showed three local state hooks with the values `true`, `""` and `0`, and two refs. In the code, these are, in order:
    - `open` (`true`): the demo form is shown. A valid submit sets it to `false`, and Reopen sets it back to `true`.
    - `status` (`""`): the demo message, empty until a valid submit. Reopen clears it again.
    - `formKey` (`0`): the form key. Each valid submit increases it by one, which remounts the form and clears its fields.
    - `reopenButton`: after a valid submit, focus moves to the Reopen button.
    - `emailInput`: after Reopen, focus moves to the email field.
  - CartDialog and its child components.
  - ProductDetailsPage with ProductGallery and VariantSelector. ProductGallery showed its `viewId` state as `"detail"`. At that time, `viewId` started as `"product"` and changed when a gallery thumbnail was selected. It is now stored as `chosen.viewId`.
  - InspirationPage with RoomSection and RoomCalculator. RoomCalculator showed three local state hooks with the values `"4"`, `"3"` and `12`. In the code, these are, in order:
    - `width` (`"4"`) and `length` (`"3"`): the controlled input values, stored as text.
    - `area` (`12`): the result of the Day 3 `calculateRoomArea` after a valid submit. It is `null` until then.
  - NotFoundPage with StatusMessage.
  - AboutPage with ContactForm. ContactForm showed two local state hooks with the values `""` and `0`. In the code, these are, in order:
    - `status`: the demo message, empty until a valid submit.
    - `formKey`: the form key. Each valid submit increases it by one, which remounts the form and clears its fields.
- EntranceOverlay could not be captured in DevTools. It is rendered only while the intro is playing.
- Components not listed above, and the rest of the state ownership table, have not been inspected in DevTools.

## Known gaps

- The dormant room-hotspot feature from Day 3 (`shop-room.ts`, `room-beacon` CSS) was not active in the original UI and is not migrated.
- The React DevTools inspection covers only the components listed under Verification status.

## Project documents

- `debug-lab-log.md` records the five course debug-lab bugs with AI disclosure. Bug 5 (CartRow) showed no visible problem in the user's test and was identified through a source review. The fixes in the log are suggestions and were not applied to the lab.
- CLAUDE.md now lists three learning rules taken from the debug-lab bugs: stable data keys instead of the array index, copying an array before sorting it, and updating props and state without mutating them.
