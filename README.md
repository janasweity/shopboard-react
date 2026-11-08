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

## Form libraries and shadcn/ui

They are used by the demo checkout (see "Demo checkout").

| Package                                              | Purpose                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `react-hook-form`, `zod`, `@hookform/resolvers`      | Form state, one validation schema, and the bridge between them |
| `tailwindcss`, `@tailwindcss/vite` (dev)             | Tailwind CSS v4, which shadcn/ui components are styled with    |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Used by the shadcn/ui components and `cn`                      |
| `radix-ui`                                           | Accessible primitives under the shadcn Label and Separator     |

shadcn/ui files:

- `components.json`: the shadcn CLI settings. Its CSS file is `src/styles/main.css`.
- `src/lib/utils.ts`: `cn()`, which joins class names and resolves conflicting Tailwind classes.
- `src/components/ui/`: only `field.tsx`, `input.tsx` and `label.tsx`, plus `separator.tsx`, which `field.tsx` uses. They were added with `npx shadcn@latest add field input label`. No shadcn Button was added: the RAHA `Button` stays the only button.
  - Changes from the CLI output, made to follow the project rules:
    - Imports use `@/lib/utils.ts` and `.tsx` extensions. The CLI had imported `cn` from an unrelated npm package called `cn` and installed it; that package was removed.
    - `FieldError` keys its list by the error message instead of the array index and uses `===`.
    - An unused `"use client"` line was removed.
    - Prettier formatted the files.
- `@/` points to `src/`. It is set in `tsconfig.json`, `tsconfig.app.json` (`paths`) and `vite.config.ts` (`resolve.alias`). The shadcn files use it; RAHA files keep relative imports.

How RAHA's design is kept:

- `main.css` imports only Tailwind's `theme.css` and `utilities.css`. Preflight, Tailwind's global reset, is not imported, so RAHA's base styles for headings, buttons, links and forms are not reset.
- Utilities are generated only from `src/components/ui` (`source(none)` and `@source`). Tailwind output sits in cascade layers, so the unlayered RAHA rules always win when both style the same element. For example, RAHA's `input` rule keeps the field look.
- shadcn colour names (`--background`, `--primary`, `--border`, `--ring` and so on) are defined in `tokens.css` and point to existing RAHA tokens. No new colours were added. `--destructive` uses the RAHA ink colour until the form design chooses an error style.
- `dark:` classes apply only inside a `.dark` element, which RAHA never uses, so the operating system's dark mode cannot restyle components.
- Tailwind's `md` (768px) and `xl` (1280px) match RAHA's breakpoints. Do not use `max-*` variants or `!` (important) utilities.

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
    │   │   │   ├── ErrorBoundary → Suspense (fallback: "Explore our considered collection.")
    │   │   │   │   └── CatalogueSummary   src/features/products/components/CatalogueSummary.tsx
    │   │   │   ├── CatalogueControls      src/features/products/components/CatalogueControls.tsx
    │   │   │   │   ├── FormField
    │   │   │   │   └── Button
    │   │   │   └── ErrorBoundary          (error: StatusMessage with Try again)
    │   │   │       └── Suspense           (fallback: StatusMessage "Loading products...")
    │   │   │           └── CatalogueResults  src/features/products/components/CatalogueResults.tsx
    │   │   │               ├── StatusMessage  (empty, no-match or result count)
    │   │   │               └── EntranceContext (null) → ProductGrid → ProductCard → Button
    │   │   ├── ProductDetailsPage         src/features/products/pages/ProductDetailsPage.tsx
    │   │   │   └── ErrorBoundary          src/components/ErrorBoundary.tsx  (keyed by product ID)
    │   │   │       ├── error: NotFoundPage for 404, or StatusMessage with Try again
    │   │   │       └── Suspense (fallback: StatusMessage "Loading product...")
    │   │   │           └── ProductDetails src/features/products/components/ProductDetails.tsx
    │   │   │               ├── ProductGallery   src/features/products/components/ProductGallery.tsx
    │   │   │               │   └── VariantSelector  src/features/products/components/VariantSelector.tsx
    │   │   │               └── Button
    │   │   ├── InspirationPage            src/features/rooms/InspirationPage.tsx
    │   │   │   ├── RoomSection (×3)       src/features/rooms/RoomSection.tsx
    │   │   │   └── RoomCalculator         src/features/rooms/RoomCalculator.tsx
    │   │   │       ├── FormField
    │   │   │       └── Button
    │   │   ├── AboutPage                  src/features/about/AboutPage.tsx
    │   │   │   └── ContactForm            src/features/about/ContactForm.tsx
    │   │   │       ├── FormField
    │   │   │       └── Button
    │   │   ├── CheckoutPage               src/features/checkout/CheckoutPage.tsx
    │   │   │   ├── StatusMessage + link to Products (empty cart)
    │   │   │   ├── CheckoutForm           src/features/checkout/CheckoutForm.tsx  (or the confirmation + Button)
    │   │   │   │   ├── FieldGroup, Field, FieldLabel, FieldDescription, FieldError  src/components/ui/field.tsx
    │   │   │   │   ├── Input (×5)         src/components/ui/input.tsx
    │   │   │   │   └── Button
    │   │   │   └── OrderSummary           src/features/checkout/OrderSummary.tsx
    │   │   └── NotFoundPage               src/pages/NotFoundPage.tsx
    │   │       └── StatusMessage
    │   └── CartStatus (live region)       src/features/cart/CartStatus.tsx
    ├── SiteFooter                         src/features/layout/SiteFooter.tsx
    ├── CartDialog                         src/features/cart/CartDialog.tsx
    │   ├── CartLineItem (one per line)    src/features/cart/CartLineItem.tsx
    │   │   └── QuantityControl            src/features/cart/QuantityControl.tsx
    │   ├── link "Review demo order" (when the cart has items)
    │   └── Button
    └── EntranceOverlay (while playing)    src/features/entrance/EntranceOverlay.tsx
```

App wraps everything in `EntranceContext` (`src/features/entrance/entrance-motion.ts`). Hero, ProductCard, CatalogueControls and every page heading read it through `useEntranceMotion`.

Inside it, `CartProvider` shares the cart through `CartContext` (`src/features/cart/cart-context.ts`). SiteHeader, ProductCard, ProductDetails, CartDialog, CartStatus, CheckoutPage and OrderSummary read it with `useCartContext`. Components between App and these consumers no longer receive cart props.

Why a Context provider:

- It reuses the existing cart source. The Day 3 `src/state.ts` keeps the entries, saves and restores `raha-cart`, validates saved data and falls back to memory. `cart-store.ts` gives React a snapshot and change notifications.
- It removes prop drilling. The cart, its actions and the page-scoped add announcement reach the components that use them directly.
- It needs no extra library.
- Zustand is a possible alternative and could also be used without duplicating the cart state. It is not needed for the current requirements.
- Trade-off: every Context consumer re-renders when the cart value changes, including each ProductCard. Cart changes come only from user clicks, so this is acceptable here.

## Lazy-loaded pages

The lazy pages are declared once, at module level, in `src/app/lazy-pages.ts` with `React.lazy` and a dynamic `import()`: HomePage, ProductsPage, ProductDetailsPage, InspirationPage, AboutPage, CheckoutPage and NotFoundPage. AppRoute imports them. Vite builds each page into its own JavaScript file, and the browser downloads it the first time that page opens.

In App, a `Suspense` boundary wraps only AppRoute. While a page file downloads, it shows `StatusMessage` with "Loading page...". SiteHeader, SiteFooter, the cart dialog and CartStatus stay on screen and usable.

An `ErrorBoundary` wraps that `Suspense` boundary, so a page file that cannot download breaks only the page area.

- It shows the h1 "This page could not be loaded." and StatusMessage with Try again. The header, footer, cart and other pages keep working.
- `React.lazy` keeps a failed import and throws the same error on every later render. Resetting the boundary alone would show the error again, so Try again calls `window.location.reload()`. The new document downloads the page file again. The cart is restored from `raha-cart`, while unsaved input on the page is lost.
- The boundary has `resetKey={page}`, so opening another page clears the error and moves focus to main. Returning to the page that failed in the same visit shows the error again until Try again.
- Recreating the lazy component at run time instead of reloading was tried. Oxlint's `react/static-components` rule rejects it, because a component chosen during render resets its state, so the rule was kept and reloading is used.

Two parts of the app wait for the page:

- `useRouteFocus` (`src/app/useRouteFocus.ts`) runs inside AppRoute, so it moves focus and scrolls only after the page is on screen. Hash links such as `/?page=about#returns` therefore find their target on a page that was not loaded yet.
- The entrance intro starts once the first page is shown. AppRoute calls `onReady`, which sets `pageReady` in App, and `useEntrance` waits for it. The page content is then mounted before the intro starts, so the original arrival motion still applies to it.
  - Catalogue cards never animate, as in the original. CatalogueResults wraps them in `EntranceContext` with the value `null`.
  - The product details h1 animates only when `/api/products/:id` answers before the page is first shown. React briefly waits before showing a Suspense fallback, so a fast local answer arrives in time, while a slow one (tested with 1500 ms) does not.

## Product details from the API

ProductDetailsPage gets only `productId` and `colorId` from the route. It does not search the local catalogue, and it never requests the full list to show one product.

- `src/features/products/api/products-resource.ts` requests `GET /api/products/:id` with the Day 3 `fetchJson`, unchanged, and the shared base URL (see "API base URL and test switches").
  - The response is checked at run time with the Day 3 `parseProductsResponse`, which receives the product as a one-item list. It is then converted with `mapApiProduct` (cents to dollars).
  - A response for a different ID is rejected.
  - The promise is cached by ID, because `use()` needs the same promise on every render. A failed request stays cached until Try again, so React does not start a new request each time it renders the error.
- `ProductDetails` calls `use(readProduct(productId))`.
  - While the request is open, the `Suspense` boundary shows "Loading product...".
  - Only the details area waits. The header, footer and cart stay usable.
  - Changing the finish only updates the URL and uses the cached product, with no new request.
- `ErrorBoundary` (`src/components/ErrorBoundary.tsx`) wraps the details. It is a class component, because React has no hook for catching render errors. It is keyed by the product ID, so a new product starts without an old error.
  - `ApiError` with status `404`: NotFoundPage with "We couldn't find that product." and no Try again.
  - Any other error (server error, network error, invalid data): the heading "We could not load this product." and StatusMessage with Try again.
  - Try again forgets the failed request, renders the details again and moves focus to the details region, because the button itself disappears.
- In development, an intentional failure logs two Console errors:
  - The browser's "Failed to load resource" line for the 404 or 500 response.
  - React's report that the Error Boundary caught an `ApiError`.

  Both come from the forced failure; the success, delay and product-change runs log nothing.

- The cart's add action still validates products against the static catalogue, and the page title still comes from it. Both use the same IDs as the API.

## Catalogue loading

The Products page loads the list with Suspense and an Error Boundary. The h1, search, category and collection filters and sort sit outside the boundaries. They stay usable, and keep focus, while results load or fail. The header, footer and cart stay usable too.

- `readCatalogue()` in `products-resource.ts` requests `GET /api/products` once and caches the promise.
  - Search, filter and sort only change the URL selection. They re-render `CatalogueResults` with the cached list. The visible list is still derived with the Day 3 `selectProducts`, on a copied array.
  - Leaving and returning to Products uses the cached list, with no new request.
  - The Day 3 `loadProducts` always requests `/api/products` and cannot take a base URL. So the list is loaded with the same Day 3 `fetchJson`, `parseProductsResponse` and `mapApiProduct`, unchanged.
- `CatalogueResults` shows "The catalogue is empty..." for an empty list, "No products match..." with Reset for no match, or "N of M products". `CatalogueSummary` shows "N considered pieces..." in the page intro.
- Two boundaries are used, because the controls sit between the intro and the results. ProductsPage keeps an `attempt` counter as their `key`.
  - Try again calls `retryCatalogue()`, increases `attempt` so both boundaries remount, and moves focus to `#catalogue-results`.
  - While loading or after a failure, the summary shows "Explore our considered collection.".

## API base URL and test switches

`src/features/products/api/api-base.ts` reads `VITE_API_BASE` once. Both the catalogue request and the one-product request are built from it.

- It may be empty, a path that starts with `/`, or an `http(s)` URL of a server with the same API. A trailing `/` is removed. Any other value throws an error when a products page loads.
- Vite reads `VITE_` variables when the server starts or when `npm run build` runs. Restart `npm run dev`, or build again before `npm run preview`, after changing it.

To try each state without editing code, set the variable for one run.

PowerShell:

```powershell
$env:VITE_API_BASE = '/delay/3000'; npm run dev   # loading for 3 s
$env:VITE_API_BASE = '/fail/500'; npm run dev     # error with Try again
$env:VITE_API_BASE = '/empty'; npm run dev        # empty catalogue; one product still loads
Remove-Item Env:VITE_API_BASE; npm run dev        # normal
```

Git Bash: add `MSYS_NO_PATHCONV=1`. Otherwise Git Bash rewrites a value that starts with `/` into a Windows path such as `C:/Program Files/Git/delay/3000`, and the app rejects it.

```sh
MSYS_NO_PATHCONV=1 VITE_API_BASE=/delay/3000 npm run dev
```

Or put `VITE_API_BASE=/fail/500` in `.env.development.local`. Git ignores `*.local` files. Delete the line or the file to go back to normal.

The switches can also be combined, for example `VITE_API_BASE=/delay/2000/fail/503`. A product that does not exist, for example `/?page=product&id=no-such-product`, shows the 404 view with any base.

`VariantSelector` is written inside `ProductDetails` and passed to `ProductGallery` as `children`, so it renders between the main photo and the thumbnails. `NotFoundPage` is used both for unknown routes and for unknown product IDs.

## Demo checkout

`/?page=checkout` is a lazy page inside the shared layout. The cart dialog shows a "Review demo order" link when the cart has items; it closes the dialog and opens the page.

- **Empty cart:** StatusMessage "Your cart is empty, so there is nothing to review yet." and a link to Products.
- **Form** (`CheckoutForm`): built with react-hook-form, the `zodResolver` from `@hookform/resolvers`, and the shadcn `Field`, `FieldLabel`, `FieldDescription`, `FieldError` and `Input`. The submit button is the RAHA `Button`.
  - The fields are full name, email address, street address, city, postal code, and a required checkbox confirming the order is a demo. There is no payment, delivery service or fee.
  - Every rule and message is in one schema, `src/features/checkout/checkout-schema.ts`. Values are trimmed, and the email is checked with `z.email`. The postal code accepts 3 to 10 letters, numbers, spaces or hyphens.
  - `mode: 'onTouched'`: an error appears after a field is left or on submit, and then updates while typing. On submit, react-hook-form focuses the first invalid field.
  - Each invalid field gets `aria-invalid="true"` and an `aria-describedby` pointing to its `FieldError` message, which has `role="alert"`.
  - `noValidate` turns off the browser's own messages, so only the Zod messages are shown.
- **Success:** the form is replaced by "Demo order confirmed." The heading receives focus, and a status says that nothing was sent, saved or charged.
  - The entered values are not passed on, sent or stored. CheckoutPage keeps only `confirmed`. The cart is kept.
  - "Start a new demo order" shows an empty form and focuses the full name field.
- **Order summary** (`OrderSummary`): reads lines, count and subtotal from `useCartContext`. Nothing is copied into state. It says that no delivery, fees, taxes or payment are added.
- **Styling:** the form uses RAHA classes in `main.css` (`.checkout-*`). The unlayered RAHA input rule gives the fields the same look as the contact form. The panel colour, radius and 768px two-column layout follow the About contact section.
  - The checkbox is a native input, sized and coloured with `accent-color`. No shadcn Checkbox was added, so no icon package is needed.
- The checkout page file is about 157 kB before gzip, because it bundles react-hook-form and Zod. It loads only when the checkout opens.

## Routes

All routes use the query string on `/`, inside the shared layout. Every page is loaded lazily.

| URL                                                       | Page                                                 |
| --------------------------------------------------------- | ---------------------------------------------------- |
| `/`                                                       | HomePage                                             |
| `/?page=products` (`q`, `category`, `collection`, `sort`) | ProductsPage                                         |
| `/?page=product&id=…` (`color`)                           | ProductDetailsPage; an unknown ID shows the 404 view |
| `/?page=inspiration`                                      | InspirationPage                                      |
| `/?page=about`                                            | AboutPage                                            |
| `/?page=checkout`                                         | CheckoutPage                                         |
| anything else                                             | NotFoundPage                                         |

Older category and collection URLs are rewritten to Products filters, and retired product IDs redirect to their category.

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
| CatalogueSummary    | none; reads the list with `use(readCatalogue())`                                                                                                            |
| CatalogueResults    | `selection: ProductSelection`, `onReset: () => void`; reads the list with `use(readCatalogue())`                                                            |
| CatalogueControls   | `selection: ProductSelection`, `onChange: (selection: ProductSelection) => void`, `onReset: () => void`                                                     |
| ProductGrid         | `products: readonly Product[]`                                                                                                                              |
| ProductCard         | `product: Product`, `position: number` (grid position, used only to stagger the intro motion); reads `add` from `useCartContext`                            |
| ProductDetailsPage  | `productId: string`, `colorId: string \| null`                                                                                                              |
| ErrorBoundary       | `children: ReactNode`, `fallback: (error: unknown, retry: () => void) => ReactNode`, `onRetry?: () => void`                                                 |
| ProductDetails      | `productId: string`, `colorId: string \| null`; reads the product with `use(readProduct(productId))` and `add` from `useCartContext`                        |
| ProductGallery      | `product: Product`, `variant: ProductVariant`, `children: ReactNode`                                                                                        |
| VariantSelector     | `variants: readonly ProductVariant[]`, `selected: ProductVariant`, `onSelect: (variantId: string) => void`                                                  |
| InspirationPage     | none                                                                                                                                                        |
| RoomSection         | `room: InspirationRoom`, `position: number`                                                                                                                 |
| RoomCalculator      | none                                                                                                                                                        |
| AboutPage           | none                                                                                                                                                        |
| CheckoutPage        | none; reads `quantity` from `useCartContext`                                                                                                                |
| CheckoutForm        | `onConfirmed: () => void` (called after valid input; values are not passed)                                                                                 |
| OrderSummary        | none; reads `items`, `quantity` and `subtotal` from `useCartContext`                                                                                        |
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
| Catalogue request                     | Promise cache in `src/features/products/api/products-resource.ts` (one promise)                                                           | `readCatalogue()` starts or reuses the request. Suspense shows loading, and the ErrorBoundary shows the error. `retryCatalogue()` (Try again) forgets a failed request. The list is not copied into React state.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Catalogue retry attempt               | ProductsPage (`attempt`)                                                                                                                  | Try again increases it. It is the `key` of both catalogue boundaries, so they remount together.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| One product request                   | Promise cache in `src/features/products/api/products-resource.ts` (one promise per product ID)                                            | `readProduct(id)` starts or reuses the request. Suspense shows loading, and ErrorBoundary shows 404 or the error. `retryProduct(id)` (Try again) forgets a failed request. The product is not copied into React state.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Product details error                 | ErrorBoundary in ProductDetailsPage (`failed`, `error`)                                                                                   | Set when loading fails. Try again clears it, and a new product ID remounts the boundary.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Cart entries and `raha-cart` storage  | Day 3 `src/state.ts`                                                                                                                      | Components call only the Context actions `add`, `change` and `clear` from `CartProvider`. They use `src/features/cart/cart-store.ts` (`addToCart`, `changeCart`, `emptyCart`), which keeps a cached snapshot and notifies subscribers. The Context holds no copy of the entries.                                                                                                                                                                                                                                                                                                                                                                                                               |
| Cart lines, count, subtotal           | Derived in `useCart` (`src/features/cart/useCart.ts`), called only by `CartProvider`                                                      | `calculateCart(snapshot)`. Shared through `CartContext` with SiteHeader (count) and CartDialog; never stored as separate state.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| First page shown                      | App (`pageReady`)                                                                                                                         | Set to `true` by `AppRoute.onReady` after the first lazily loaded page is on screen. It is used only to start the entrance intro.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Cart open/closed                      | App (`cartOpen`)                                                                                                                          | `SiteHeader.onOpenCart` opens it; `CartDialog.onClose` closes it (close button, Continue, Escape).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Cart add announcement                 | CartProvider (`announcement`)                                                                                                             | Set by the Context `add` action and shown by `CartStatus`. It stores the page where it was set, so it disappears on navigation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Cart keyboard focus after an action   | CartDialog (`pendingFocus` ref)                                                                                                           | After an increase/decrease/remove/clear, focus moves to the same control, or to Close/Continue.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Selected finish                       | URL `color`                                                                                                                               | `ProductDetails` derives the variant with `getVariant`; `VariantSelector.onSelect` updates the URL.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Gallery view                          | ProductGallery (`chosen`: `finishKey` and `viewId`)                                                                                       | Thumbnail clicks set it. `finishKey` is the product ID plus the finish ID. When the finish or product changes, ProductGallery resets it to the product photo during render, without an effect or a `key` remount. The finish buttons are therefore not replaced and keep keyboard focus.                                                                                                                                                                                                                                                                                                                                                                                                       |
| Active room slide                     | RoomSlider (`activeId`)                                                                                                                   | Slide buttons.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Registration open, status, form reset | RegistrationSection (`open`, `status`, `formKey`)                                                                                         | A valid submit closes the non-modal dialog and shows the demo status. The form key changes, so the inputs are cleared. Reopen shows an empty form.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Contact status, form reset            | ContactForm (`status`, `formKey`)                                                                                                         | A valid submit shows the demo message and clears the form. Nothing is sent.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Checkout field values and errors      | react-hook-form inside CheckoutForm (`useForm` with `zodResolver`)                                                                        | Typing and leaving fields update them. On success the form unmounts, so the values are discarded; they are never sent or stored.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Checkout confirmed                    | CheckoutPage (`confirmed`)                                                                                                                | A valid submit sets it to `true`, and "Start a new demo order" sets it back to `false`. Only this flag is kept, not the entered values.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
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

The Products page loads the list with the Day 3 `fetchJson`, `parseProductsResponse` and `mapApiProduct`, which validate the payload and convert cents to dollars (see "Catalogue loading"). Product details use `GET /api/products/:id` (see "Product details from the API"). There is no static fallback: a failed request shows the error state with Try again. Both requests use `VITE_API_BASE`, so the switches can be tried in the UI (see "API base URL and test switches").

Home, details, cart validation and inspiration use the same static catalogue as the API, so product and finish IDs always agree.

Hosting limitations:

- The API, including `/api/products/:id` and the `/delay`, `/fail` and `/empty` switches, exists only in `npm run dev` and `npm run preview`. It is Vite middleware, not part of `dist/`.
- A static deployment of `dist/` alone has no `/api` routes. It needs a real server route or backend that serves the same contract and switches. Without one, the Products page shows its error state.
- `VITE_API_BASE` is fixed into the build by `npm run build`. A deployment can point it at a real backend URL, but that backend must allow the site's origin (CORS) and serve the RAHA contract.
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

- On 2026-11-08, after product details moved to `GET /api/products/:id`, the four commands passed again. A product-details run passed 40/40 on both the dev server and the production preview. Delay and failure were simulated by rewriting the request to the `/delay/3000` and `/fail/500` switches. It covered:
  - Success: one `/api/products/arc-sofa` request and no list request. Finish change with no new request and focus kept, the gallery, add to cart and refresh.
  - Delay: "Loading product..." for about 3 s, with the header, footer and cart usable.
  - Failure: the error heading with Try again, and no repeated requests. Try again made exactly one new request, showed the details and focused the details region.
  - 404: the not-found view without Try again.
  - Product change and Back/Forward: one request per product. A slow answer for an earlier product does not replace the newer one.
  - No horizontal overflow at 360px for details and the error state.

  The success, delay and product-change parts logged no Console warnings or errors. The intentional 500 and 404 parts logged only the two expected errors described in "Product details from the API". The focus (17/17), lazy-loading (27/27), cart (21/21) and API (24/24) runs passed again.

- On 2026-11-08, after the catalogue moved to Suspense and `VITE_API_BASE` was added, the four commands passed again. These runs passed on both the dev server and the production preview:
  - Catalogue (38/38):
    - One list request, StrictMode included, and no new request for search, filter, sort or revisiting.
    - Case-insensitive search with focus kept, no-match with Reset, category filter and price sort.
    - Delay: loading, with search and cart usable. Results use the search typed while loading, and focus stays in the field.
    - Failure: the error message with Try again, the summary fallback, working controls and no repeated requests. Try again made exactly one new request and focused the results.
    - The empty catalogue, and no overflow at 360px.
  - The product details (40/40), focus (17/17), lazy-loading (27/27), cart (21/21) and API (24/24) runs.
  - Each value was set at server start: `VITE_API_BASE=/delay/3000` (6/6), `/fail/500` (5/5) and `/empty` (5/5), plus no value (4/4). The list and product requests used the prefix, with one list request. A preview of a build made with `/fail/500` passed 5/5, and the normal build does not contain the prefix.

  The success, delay and empty runs logged no Console warnings or errors. The intentional catalogue failure logged the browser's 500 line and React's caught-error report once for each of the two boundaries.

- The first catalogue lazy-loading run showed API cards animating. The cause was a fast response arriving before the first page was shown. The fix was `EntranceContext` with `null` around the catalogue grid, as described above.
- The user also tried the switches manually with `VITE_API_BASE`. They saw:
  - A 3-second delay.
  - A 500 error, then Try again.
  - The empty catalogue.

  After removing the setting, the products came back.

- On 2026-11-08, after the form libraries, Tailwind and shadcn/ui were set up, the four commands passed again.
  - A computed-style snapshot recorded about 40 CSS properties and the position and size of every element. It covered Home, Products, a product page, Room Inspiration, About and the 404 page at 360, 768 and 1280px, which is 18 pages and 4,524 elements.
  - On the production preview, the snapshot showed 0 differences from the same snapshot taken before the setup. Two snapshots taken before the setup also matched each other exactly.
  - On the dev server, the only difference was Vite's development `<script>` element.
  - The built CSS keeps all RAHA rules unchanged. It adds Tailwind theme variables and about 190 utilities from `src/components/ui`, and no preflight.
  - The catalogue (38/38), product details (40/40), lazy-loading (27/27), cart (21/21) and focus (17/17) runs passed again.
  - At that time the shadcn components were not used on any page yet; the demo checkout now uses Field and Input.

- On 2026-11-08, after the demo checkout was built, the four commands passed again. A checkout run passed 50/50 on both the dev server and the production preview, with no Console warnings or errors. It covered:
  - Empty cart: the message, the Products link and no form. There is no "Review demo order" link in an empty cart.
  - Opening checkout with the keyboard from the cart: the dialog closes and focus moves to main. The summary matches the cart subtotal and lines.
  - The fields have the same computed look as the contact form fields.
  - Empty submit: all six fields are marked `aria-invalid` and linked to their messages, and focus moves to the first field. A later invalid email takes focus as the first invalid field.
  - Errors clear while typing. Tab, Space and Enter work.
  - Success: the confirmation heading is focused, and there is no network request or storage change. The entered values are not in storage, the cart count is unchanged, and the summary remains.
  - "Start a new demo order" shows an empty form with focus on its first field. After refresh, the cart is kept and the form is empty.
  - No overflow at 360, 768 and 1280px, with one column below 768px and two from 768px.
- The style snapshot of the existing pages showed differences only on the product page at 360 and 768px. They were heights and positions caused by the longer, corrected footnote text; no colours, fonts or spacing changed.
- The catalogue (38/38), product details (40/40), lazy-loading (27/27), cart (21/21), focus (17/17) and API (24/24) runs passed again.
- The user also tested the checkout manually:
  - Submitting the empty form showed messages under the fields and moved focus to the first field.
  - Filling it with demo data showed "Demo order confirmed".
  - Afterwards, the products and quantities were still in the cart.

- On 2026-11-08, before the page Error Boundary was added, a review found that a failed page file download made the whole app blank, with an empty `#root`. After the fix, the four commands passed. A page-failure run passed 19/19 on both the production preview and the dev server. The About page file was blocked with Playwright, and the run covered:
  - A failure while navigating: the error heading and Try again appear, while the header, footer and cart stay, and the cart opens. After unblocking, Try again requested the file again, showed About on the same URL and kept the cart.
  - A failure, then opening Products and Room Inspiration: both load, and focus moves to main. Returning to About after unblocking showed the error, and Try again then loaded it.
  - A failure on a direct load: the error appears with the layout, and Try again recovers.
  - A file that still fails: Try again shows the error again, the layout stays, and there are no repeated requests.

  The lazy-loading (27/27), cart (21/21), catalogue (38/38), product details (40/40), checkout (50/50) and focus (17/17) runs passed again on both servers.

- On 2026-11-08, the pre-commit hook was tested in a temporary clone outside the project, with the same Husky, lint-staged and Oxlint settings and versions.
  - A staged file with `export const sample: any = 1` was rejected by `oxlint --deny-warnings` with `typescript(no-explicit-any)`. `HEAD` did not change, so no commit was created.
  - The same line with `unknown` was accepted in the temporary clone.
  - The clone was deleted; the project's `main` and history were not changed.

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
