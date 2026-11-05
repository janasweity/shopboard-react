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
App                                    src/App.tsx
├── SiteHeader                         src/features/layout/SiteHeader.tsx
├── main
│   ├── AppRoute                       src/app/AppRoute.tsx  (renders one page)
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
│   └── cart status (live region)
├── SiteFooter                         src/features/layout/SiteFooter.tsx
├── CartDialog                         src/features/cart/CartDialog.tsx
│   ├── CartLineItem (one per line)    src/features/cart/CartLineItem.tsx
│   │   └── QuantityControl            src/features/cart/QuantityControl.tsx
│   └── Button
└── EntranceOverlay (while playing)    src/features/entrance/EntranceOverlay.tsx
```

App wraps everything in `EntranceContext` (`src/features/entrance/entrance-motion.ts`). Hero, ProductCard, CatalogueControls and every page heading read it through `useEntranceMotion`.

`VariantSelector` is written inside `ProductDetailsPage` and passed to `ProductGallery` as `children`, so it renders between the main photo and the thumbnails. `NotFoundPage` is used both for unknown routes and for unknown product IDs.

## Props

`AddHandler` is `(productId: string, variantId: string) => void`, exported from `src/features/cart/cart-store.ts`. `Route` is the route union in `src/app/route.types.ts`.

| Component           | Props                                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App                 | none                                                                                                                                                        |
| SiteHeader          | `route: Route`, `cartCount: number`, `onOpenCart: () => void`                                                                                               |
| AppRoute            | `route: Route`, `onAdd: AddHandler`                                                                                                                         |
| HomePage            | `products: readonly Product[]`, `onAdd: AddHandler`                                                                                                         |
| Hero                | `image: string`, `alt: string`                                                                                                                              |
| FeaturedProducts    | `products: readonly Product[]`, `onAdd: AddHandler`                                                                                                         |
| RoomSlider          | `slides: readonly (typeof heroSlides)[number][]`                                                                                                            |
| RegistrationSection | none                                                                                                                                                        |
| ProductsPage        | `selection: ProductSelection`, `onAdd: AddHandler`                                                                                                          |
| CatalogueControls   | `selection: ProductSelection`, `onChange: (selection: ProductSelection) => void`, `onReset: () => void`                                                     |
| ProductGrid         | `products: readonly Product[]`, `onAdd: AddHandler`                                                                                                         |
| ProductCard         | `product: Product`, `position: number` (grid position, used only to stagger the intro motion), `onAdd: AddHandler`                                          |
| ProductDetailsPage  | `product: Product`, `colorId: string \| null`, `onAdd: AddHandler`                                                                                          |
| ProductGallery      | `product: Product`, `variant: ProductVariant`, `children: ReactNode`                                                                                        |
| VariantSelector     | `variants: readonly ProductVariant[]`, `selected: ProductVariant`, `onSelect: (variantId: string) => void`                                                  |
| InspirationPage     | none                                                                                                                                                        |
| RoomSection         | `room: InspirationRoom`, `position: number`                                                                                                                 |
| RoomCalculator      | none                                                                                                                                                        |
| AboutPage           | none                                                                                                                                                        |
| ContactForm         | none                                                                                                                                                        |
| NotFoundPage        | `heading?: string`                                                                                                                                          |
| SiteFooter          | `year: number`                                                                                                                                              |
| CartDialog          | `open: boolean`, `onClose: () => void`                                                                                                                      |
| CartLineItem        | `line: CartLine`, `onAction: (key: string, action: CartAction) => void`                                                                                     |
| QuantityControl     | `quantity: number`, `itemLabel: string`, `finishName: string`, `cartKey: string`, `onDecrease: () => void`, `onIncrease: () => void`                        |
| EntranceOverlay     | `overlayRef: RefObject<HTMLElement \| null>`, `skipRef: RefObject<HTMLButtonElement \| null>`, `onSkip: () => void`                                         |
| Button              | all native `ButtonHTMLAttributes<HTMLButtonElement>` plus `tone?: 'primary' \| 'secondary'`; `type` defaults to `button`                                    |
| FormField           | `id: string`, `label: string`, `hint?: string`, `error?: string`, `className?: string`, `children: ReactNode`                                               |
| StatusMessage       | `kind: 'loading' \| 'error' \| 'empty' \| 'no-match' \| 'success'`, `message: string`, `className?: string`, `onRetry?: () => void`, `onReset?: () => void` |

Reusable components with more than one call site or many data-driven instances: Button, FormField, StatusMessage, ProductGrid, ProductCard, CartLineItem, QuantityControl, RoomSection and NotFoundPage.

## State ownership

| State                                 | Owner                                                          | How it changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Current page and URL parameters       | Browser URL, read by `useRoute` (`src/app/useRoute.ts`) in App | Links call `handleRouteClick` (pushState). Search/filter/sort call `replaceProductSelection`, and finish choice calls `replaceProductColor` (both use replaceState). `useSyncExternalStore` re-renders on popstate, hashchange and the app's navigation event.                                                                                                                                                                                                                                                                                                                                                                    |
| Search, category/collection, sort     | URL (`q`, `category`/`collection`, `sort`)                     | `ProductsPage` gets `selection` from the route. The visible list is derived with `selectProducts` (copied array, no mutation) and is never stored in state.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Catalogue request                     | `useProducts` hook in ProductsPage                             | `loading` / `error` / `success` union state. `retry` sets loading and starts a new request; stale responses are ignored with a request counter.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Cart entries and `raha-cart` storage  | Day 3 `src/state.ts`                                           | Changed only through `src/features/cart/cart-store.ts` (`addToCart`, `changeCart`, `emptyCart`). The store keeps a cached snapshot and notifies subscribers.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Cart lines, count, subtotal           | Derived in `useCart` (`src/features/cart/useCart.ts`)          | `calculateCart(snapshot)`. Used by App (header count) and CartDialog; never stored as separate state.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Cart open/closed                      | App (`cartOpen`)                                               | `SiteHeader.onOpenCart` opens it; `CartDialog.onClose` closes it (close button, Continue, Escape).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Cart add announcement                 | App (`cartStatus`)                                             | Set by `handleAdd`. It belongs to the page where it was set, so it disappears on navigation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Cart keyboard focus after an action   | CartDialog (`pendingFocus` ref)                                | After an increase/decrease/remove/clear, focus moves to the same control, or to Close/Continue.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Selected finish                       | URL `color`                                                    | `ProductDetailsPage` derives the variant with `getVariant`; `VariantSelector.onSelect` updates the URL.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Gallery view                          | ProductGallery (`viewId`)                                      | Thumbnail clicks. The component is keyed by `variant.id`, so a new finish resets it to the product photo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Active room slide                     | RoomSlider (`activeId`)                                        | Slide buttons.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Registration open, status, form reset | RegistrationSection (`open`, `status`, `formKey`)              | A valid submit closes the non-modal dialog and shows the demo status. The form key changes, so the inputs are cleared. Reopen shows an empty form.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Contact status, form reset            | ContactForm (`status`, `formKey`)                              | A valid submit shows the demo message and clears the form. Nothing is sent.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Room dimensions and area              | RoomCalculator (`width`, `length`, `area`)                     | Controlled inputs; submit calls the Day 3 `calculateRoomArea`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Entrance intro and content motion     | `useEntrance` hook in App (`startedAt`, `claimed` ref)         | The Day 3 `claimEntranceSession` decides once per session (`?intro=replay` replays); reduced motion skips it. `startedAt` is shared through `EntranceContext`. `useEntranceMotion` adds `entrance-hero` (2100 ms), `entrance-copy` for the h1 (2350 ms), `entrance-search` (2450 ms) and `entrance-card` (2550 ms + 50 ms per card, up to 11), but only to content mounted before the intro started. Skip, Escape, the 3750 ms timer, switching to reduced motion, moving focus away or navigating set `startedAt` to null. That removes every class at once, so content shows immediately; Skip and Escape return focus to main. |

List keys always come from data: `product.id`, `line.key` (product + finish), `variant.id`, gallery `view.id`, `slide.id`, `room.id`, and category or collection IDs.

## Products API and hosting

`tooling/products-api.ts` adds `GET /api/products` to the Vite dev and preview servers. It serializes the same Day 3 catalogue with `serializeProducts` (prices in cents) and responds with `Content-Type: application/json`, `Cache-Control: no-store`, and `405` with `Allow: GET` for other methods. The Products page loads through the Day 3 `loadProducts` client, which validates the payload and converts cents to dollars. There is no static fallback: a failed request shows the error state with Try again.

Home, details, cart validation and inspiration use the same static catalogue as the API, so product and finish IDs always agree.

Limitation: the endpoint exists only in `npm run dev` and `npm run preview`. A static deployment of `dist/` alone has no `/api/products`, so it needs a real server route or backend that serves the same contract.

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
- React DevTools Components tab: the user inspected the Home page (HomePage), ProductsPage and ProductCard. The other components, and the full state ownership table above, have not yet been inspected in DevTools.

## Known gaps

- The dormant room-hotspot feature from Day 3 (`shop-room.ts`, `room-beacon` CSS) was not active in the original UI and is not migrated.
- The React DevTools inspection covers only the components listed under Verification status.

## Project status and documents

- Stages 3-5 (API catalogue, cart, product details, forms, rooms, about, entrance) are saved in commit 49fd304.
- `debug-lab-log.md` records the five course debug-lab bugs with AI disclosure. Bug 5 (CartRow) showed no visible problem in the user's test and was identified through a source review. The fixes in the log are suggestions and were not applied to the lab. The file is not committed yet.
- CLAUDE.md now lists three learning rules taken from the debug-lab bugs: stable data keys instead of the array index, copying an array before sorting it, and updating props and state without mutating them.
