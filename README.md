# RAHA React

RAHA is a concept furniture and home store. This repository is the React + TypeScript version of the Day 3 ShopBoard project, built with the Next.js App Router. The Day 3 repository is kept unchanged. Its typed product, cart, room and state modules are reused here unchanged, and the whole UI is built in React.

The products shown on the catalogue and product pages come from a separate products API in `products-api/`. The Next.js app requests it from Server Components; it never calls itself.

## Setup

Run all commands from the folder that contains package.json. You need Node.js 22.22.1 or newer and npm. In PowerShell, use `npm.cmd` if the execution policy blocks `npm.ps1`.

```sh
npm ci              # install exact dependencies; also installs the Husky hook
npm run api:build   # generate products-api/generated/products.json from src/data.ts
npm run api:start   # start the products API on http://127.0.0.1:4000
npm run dev         # start Next.js on http://localhost:5173 (second terminal)
npm run build       # production build (Next.js runs the TypeScript check)
npm run start       # serve the production build on http://localhost:4173
```

`RAHA_API_URL` must be the full URL of the products API, for example `http://127.0.0.1:4000`. Put `RAHA_API_URL=http://127.0.0.1:4000` in `.env.local` (Git ignores `*.local`), or set it in the terminal before `npm run dev` or `npm run start`. Without it, the catalogue and product pages show their error state.

In development, open `http://localhost:5173`. Next.js blocks its development resources, such as hot reload, for other origins like `127.0.0.1`.

## Verification commands

```sh
npm run typecheck     # next typegen, then strict TypeScript for the app, next.config.ts and products-api
npm run lint          # Oxlint, fails on any warning
npm run format:check  # Prettier check (npm run format applies it)
npm run build
```

Lint rejects `any`, type assertions, non-null assertions and error-suppression comments. Its `react/only-export-components` rule allows the Next.js file exports `metadata`, `generateMetadata`, `viewport` and `dynamic`. The pre-commit hook (`.husky/pre-commit`) runs lint-staged: staged JS/TS files are formatted and then linted, and staged JSON/CSS/HTML/Markdown/YAML files are formatted. Vendored skill files, `.next/` and `next-env.d.ts` are excluded from lint and formatting.

## Project skills

Both required skills are installed as real files and tracked in Git. `skills-lock.json` records their source and content hashes.

- `.claude/skills/vercel-react-best-practices/`
- `.claude/skills/vercel-composition-patterns/`

## Next.js setup

| Package or file                                 | Purpose                                                                                              |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `next` 16.4.5                                   | App Router, Server Components, routing, streaming and the production server                          |
| `server-only`                                   | Makes the build fail if the server API client is imported into a Client Component                    |
| `@tailwindcss/postcss` and `postcss.config.mjs` | Tailwind CSS v4 through PostCSS (replaces `@tailwindcss/vite`); see "Styles and design tokens"       |
| `next.config.ts`                                | Type-checks `tsconfig.app.json`, sets the Turbopack root, and serves `/favicon.ico` from `/raha.svg` |
| `src/proxy.ts`                                  | Next.js 16 proxy (formerly middleware): legacy redirects and API test switches                       |

React 19.3.1 and TypeScript 7.0.2 are unchanged. Next.js type-checks with the project's own `tsc` command, which works with TypeScript 7. `next dev` and `next typegen` add Next.js settings to `tsconfig.app.json` (`plugins`, `.next/types`, `allowJs`, `incremental`, `esModuleInterop`, `resolveJsonModule`); `strict` stays on. `next dev` also adds a block to AGENTS.md that points agents to the Next.js documentation in `node_modules/next/dist/docs/`.

Vite, its plugins, `index.html`, `src/main.tsx`, the Vite middleware and the hand-written router were removed.

## Form libraries and shadcn/ui

They are used by the demo checkout (see "Demo checkout").

| Package                                              | Purpose                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `react-hook-form`, `zod`, `@hookform/resolvers`      | Form state, one validation schema, and the bridge between them |
| `tailwindcss`, `@tailwindcss/postcss` (dev)          | Tailwind CSS v4, set up in `src/app/globals.css`               |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Used by the shadcn/ui components and `cn`                      |
| `radix-ui`                                           | Accessible primitives under the shadcn Label and Separator     |

shadcn/ui files:

- `components.json`: the shadcn CLI settings. `rsc` is `true`, and its CSS file is `src/app/globals.css`.
- `src/lib/utils.ts`: `cn()`, which joins class names and resolves conflicting Tailwind classes.
- `src/components/ui/`: only `field.tsx`, `input.tsx` and `label.tsx`, plus `separator.tsx`, which `field.tsx` uses. They were added with `npx shadcn@latest add field input label`. No shadcn Button was added.
  - Changes from the CLI output, made to follow the project rules:
    - Imports use `@/lib/utils.ts` and `.tsx` extensions. The CLI had imported `cn` from an unrelated npm package called `cn` and installed it; that package was removed.
    - `FieldError` keys its list by the error message instead of the array index and uses `===`.
- `input.tsx` was rewritten as RAHA's shared Input (see the next item).
  - An unused `"use client"` line was removed. They are imported only by Client Components.
  - Prettier formatted the files.
- `@/` points to `src/` (`paths` in `tsconfig.json` and `tsconfig.app.json`). The shadcn files use it; RAHA files keep relative imports.
- `src/components/ui/button.tsx` and `button-variants.ts`: the RAHA Button written with Tailwind and `cva` (not shadcn CLI output). `variant` is `primary` (default), `secondary` or `ghost`; `size` is `sm` (40px high, `text-2xs`), `md` (default, 44px, `text-xs`) or `lg` (48px, `text-sm`). It uses only Tailwind's scale and RAHA tokens, with no arbitrary values. Compared with the old `.button`, `md` is 2px lower (44px instead of 46px), 3.2px wider in padding and uses 12px text instead of 11.5px; `sm` matches Add to cart except 11px text instead of 10.9px. All other native button props pass through, and `type` defaults to `"button"`. `buttonVariants()` gives the same classes to a link. It is not used by any page yet: every page still uses `src/components/Button.tsx` (`tone`) and the `.button` rules in `globals.css`.
- `cn()` knows RAHA's radius names, so a `className` such as `rounded-panel` replaces the default radius.
- `src/components/ui/card.tsx` and `card-variants.ts`: RAHA's shared surface, taken from the panels the site already uses. `Card` renders a `div` with `CardProps` (every native div prop, plus `variant` and `padding`); a `section`, `figure` or `dialog` keeps its element and uses `className={cardVariants(...)}`. It holds no layout, headings or product and cart logic. It is not used by any page yet.
  - `variant`: `panel` (default; `bg-panel`, `rounded-panel`), used by the room planner, contact section, checkout form, order summary and gallery frame; `feature` (`bg-warm-greige`, a `line` border, `rounded-panel`), used by the Home registration section; `surface` (`bg-background`, a `line` border, `rounded-card`), used by the registration form.
  - `padding` (Tailwind's scale): `sm` `p-4`, `md` (default) `p-6`, `lg` `p-6 md:p-8 xl:p-12` and `xl` `px-5 py-8 md:p-10 xl:p-14`.
  - Compared with the current CSS at 360, 768 and 1280px, every one of these matches in padding, background, border, radius and colour, except the registration form below 768px: 24px padding instead of 20.8px (1.3rem is not on the scale).
- `src/components/ui/input.tsx`: RAHA's shared text field, with `InputProps` (every native input prop, including `ref`, so `register()` can be spread onto it) and `type` defaulting to `"text"`. It uses only Tailwind's scale and RAHA tokens: `min-h-11`, `p-3`, `rounded-field`, `border-input`, `bg-background` and `text-foreground`; the text inherits the surrounding font, and the placeholder keeps the browser grey from the base layer. `disabled` gives 50% opacity and a not-allowed cursor; `aria-invalid` gives a 2px `destructive` (ink) border. The focus ring is the global `:focus-visible` outline. The shadcn shadow, focus and error rings, `file:` and `selection:` styles, `dark:` classes and the fixed `h-9` height were removed.
  - The unlayered RAHA input rule in `globals.css` (for the fields not yet converted) skips `[data-slot='input']` inside `:where()`, so it no longer overrides the Input and keeps its specificity for the old fields. The earlier limit, where that rule's 1px border hid the Input's `aria-invalid` border outside the checkout, is removed, and the checkout no longer needs its own error rule for text fields. Only the native confirmation checkbox keeps `.checkout-form input[type='checkbox'][aria-invalid='true']`.

## Styles and design tokens

All CSS is in `src/app/globals.css`, which the root layout imports once. RAHA is moving to Tailwind step by step: Tailwind is set up for the whole project, and the existing component rules stay in the same file until each feature is converted.

- **Tailwind:** `@import 'tailwindcss' source(none)`, with `@source` for `src/components`, `src/features` and `src/app`. Preflight, Tailwind's reset, is included.
- **Tokens** (`@theme static`). Tailwind's default colours, fonts and radii are removed, so only RAHA values exist as utilities. `static` keeps every token as a CSS variable, because the component rules read them with `var()`.
  - Colours: the ten-shade palette (`soft-black`, `charcoal-brown`, `warm-slate`, `graphite-grey`, `stone-grey`, `warm-greige`, `taupe-brown`, `silver-mist`, `warm-ivory`, `soft-white`), the roles (`bg`, `ink`, `muted`, `primary`, `primary-dark`, `panel`, `line`, `sand`) and the shadcn names (`background`, `foreground`, `primary-foreground`, `muted-foreground`, `border`, `input`, `ring`, `destructive`), which point to RAHA colours. No new colours were added. `destructive` uses the RAHA ink colour.
  - Fonts: `font-body` and `font-heading`. Preflight gives `html` the body font through `--default-font-family`.
  - Text: `text-2xs` (11px), RAHA's compact control text. The small buttons and chips used 0.68rem to 0.72rem, below Tailwind's smallest step, `text-xs` (12px). Tailwind's own text scale is kept.
  - Radii: `thumb` 4px, `field` 5px, `md` 6px (also shadcn's `rounded-md`), `control` 8px, `card` 10px, `panel` 12px, `photo` 14px, `dialog` 15px, `feature` 18px, `chip` 30px, `pill` 100px and `circle` 50%. The intro's Skip button used 50px; it now uses `pill`, which looks the same because both are more than half its height. The two curved hero shapes keep their own values.
  - Spacing: `gutter`, 1.25rem, then 2.5rem from 768px and 5rem from 1280px.
- **Base layer** (`@layer base`): the page colour and font, headings, links, `em`, the button cursor and icon SVGs. Preflight already supplies box-sizing, zero margins, inherited form fonts and link colours, block images and `[hidden]`, so those RAHA rules were removed. The base layer also restores, with `revert`, browser defaults that preflight removes but RAHA relies on: the dialog margin (which centres the cart modal), button, legend and option padding, bold option-group labels and the browser's placeholder grey.
- **Outside the layers:** the focus ring and the component rules. They win over Tailwind classes, so the current look stays until a feature is converted; converting a feature removes its old rules. The focus ring stays there so it also wins over any `outline` class.
- `dark:` classes apply only inside a `.dark` element, which RAHA never uses. There is no dark mode yet.
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

The Day 3 `ApiError` class uses a constructor parameter property. That syntax is rejected by `erasableSyntaxOnly`, so `tsconfig.app.json` sets `erasableSyntaxOnly: false`; `strict` stays on. Next.js compiles it normally.

Day 3 data still contains old query-string links (`productURL()` and the hero-slide `href` values). React code uses `productPath()` and `toAppHref()` from `src/lib/routes.ts` instead, so links go straight to the new paths.

## Routes

The App Router lives in `src/app/`. The root layout keeps the shared header, footer, cart and intro around every page.

| URL                                                 | Page (file)                                      | Rendering                                                                          |
| --------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `/`                                                 | `src/app/page.tsx`, HomePage                     | Static; six featured pieces from the static catalogue                              |
| `/products` (`q`, `category`, `collection`, `sort`) | `src/app/products/page.tsx`, ProductsPage        | Dynamic; the list streams from the API                                             |
| `/products/[id]` (`color`)                          | `src/app/products/[id]/page.tsx`, ProductDetails | Dynamic; one product from the API, with its own loading, error and not-found files |
| `/inspiration`                                      | `src/app/inspiration/page.tsx`, InspirationPage  | Static                                                                             |
| `/about`                                            | `src/app/about/page.tsx`, AboutPage              | Static                                                                             |
| `/checkout`                                         | `src/app/checkout/page.tsx`, CheckoutPage        | Static shell; the cart is read in the browser                                      |
| any other path                                      | `src/app/not-found.tsx`, NotFoundPage            | Status 404                                                                         |

Next.js splits each route into its own files and loads them when a route opens.

Redirects (`src/proxy.ts`, status 307, with `redirectPath()` from `src/lib/routes.ts`):

- Old query-string URLs keep working: `/?page=products&…` goes to `/products?…`, `/?page=product&id=x&color=y` to `/products/x?color=y`, and `/?page=about`, `inspiration` and `checkout` to their paths.
- Old category and collection pages (for example `/?page=living-room`) and category aliases go to the matching Products filter.
- Retired product IDs, as an old URL or as `/products/<id>`, go to their category in Products.

Page titles use `metadata` and `generateMetadata` (product name), with the template `%s | RAHA`.

## Component tree

Every component lives in its own `.tsx` file. Arrows show what a component renders. Plain HTML elements are not listed. Server Components have no marker; Client Component boundaries are marked `(client)`, and everything they render runs in the browser too.

```text
RootLayout                                 src/app/layout.tsx  (html, body, global CSS, metadata)
└── AppShell (client)                      src/features/layout/AppShell.tsx
    └── EntranceContext → CartProvider     src/features/cart/CartProvider.tsx
        ├── SiteHeader                     src/features/layout/SiteHeader.tsx
        ├── main
        │   ├── page (one of the routes below, inside src/app/error.tsx for page errors)
        │   └── CartStatus (live region)   src/features/cart/CartStatus.tsx
        ├── SiteFooter                     src/features/layout/SiteFooter.tsx
        ├── CartDialog                     src/features/cart/CartDialog.tsx
        │   ├── CartLineItem (one per line) src/features/cart/CartLineItem.tsx
        │   │   └── QuantityControl        src/features/cart/QuantityControl.tsx
        │   ├── Link "Review demo order" (when the cart has items)
        │   └── Button
        └── EntranceOverlay (while playing) src/features/entrance/EntranceOverlay.tsx

/                src/app/page.tsx
└── HomePage                               src/features/home/HomePage.tsx
    ├── Hero (client)                      src/features/home/Hero.tsx
    ├── FeaturedProducts                   src/features/home/FeaturedProducts.tsx
    │   └── ProductGrid                    src/features/products/components/ProductGrid.tsx
    │       └── ProductCard (client)       src/features/products/components/ProductCard.tsx
    │           └── Button                 src/components/Button.tsx
    ├── RoomSlider (client)                src/features/home/RoomSlider.tsx
    │   ├── Button
    │   └── StatusMessage                  src/components/StatusMessage.tsx
    └── RegistrationSection (client)       src/features/forms/RegistrationSection.tsx
        ├── FormField                      src/components/FormField.tsx
        └── Button

/products        src/app/products/page.tsx  (starts getProducts(), not awaited)
└── ProductsPage (client)                  src/features/products/pages/ProductsPage.tsx
    ├── ErrorBoundary → Suspense ("Explore our considered collection.")
    │   └── CatalogueSummary               src/features/products/components/CatalogueSummary.tsx
    ├── CatalogueControls                  src/features/products/components/CatalogueControls.tsx
    │   ├── FormField
    │   └── Button
    └── ErrorBoundary (error: StatusMessage with Try again)   src/components/ErrorBoundary.tsx
        └── Suspense (StatusMessage "Loading products...")
            └── CatalogueResults           src/features/products/components/CatalogueResults.tsx
                ├── StatusMessage (empty, no-match or result count)
                └── EntranceContext (null) → ProductGrid → ProductCard → Button

/products/[id]   src/app/products/[id]/page.tsx  (awaits getProduct(id))
├── loading.tsx: StatusMessage "Loading product..."
├── error.tsx (client): heading and StatusMessage with Try again (retry())
├── not-found.tsx: NotFoundPage "We couldn't find that product."
└── ProductDetails (client)                src/features/products/components/ProductDetails.tsx
    ├── ProductGallery                     src/features/products/components/ProductGallery.tsx
    │   └── VariantSelector                src/features/products/components/VariantSelector.tsx
    └── Button

/inspiration     src/app/inspiration/page.tsx
└── InspirationPage (client)               src/features/rooms/InspirationPage.tsx
    ├── RoomSection (×3)                   src/features/rooms/RoomSection.tsx
    └── RoomCalculator                     src/features/rooms/RoomCalculator.tsx
        ├── FormField
        └── Button

/about           src/app/about/page.tsx
└── AboutPage (client)                     src/features/about/AboutPage.tsx
    └── ContactForm                        src/features/about/ContactForm.tsx
        ├── FormField
        └── Button

/checkout        src/app/checkout/page.tsx
└── CheckoutPage (client)                  src/features/checkout/CheckoutPage.tsx
    ├── StatusMessage + Link to Products (empty cart)
    ├── CheckoutForm                       src/features/checkout/CheckoutForm.tsx  (or the confirmation + Button)
    │   ├── FieldGroup, Field, FieldLabel, FieldDescription, FieldError  src/components/ui/field.tsx
    │   ├── Input (×5)                     src/components/ui/input.tsx
    │   └── Button
    └── OrderSummary                       src/features/checkout/OrderSummary.tsx

not found        src/app/not-found.tsx
└── NotFoundPage (client)                  src/features/not-found/NotFoundPage.tsx
    └── StatusMessage
```

AppShell provides `EntranceContext` (`src/features/entrance/entrance-motion.ts`). Hero, ProductCard, CatalogueControls and every page heading read it through `useEntranceMotion`.

Inside it, `CartProvider` shares the cart through `CartContext` (`src/features/cart/cart-context.ts`). SiteHeader, ProductCard, ProductDetails, CartDialog, CartStatus, CheckoutPage and OrderSummary read it with `useCartContext`. Components between the layout and these consumers do not receive cart props.

Why a Context provider:

- It reuses the existing cart source. The Day 3 `src/state.ts` keeps the entries, saves and restores `raha-cart`, validates saved data and falls back to memory. `cart-store.ts` gives React a snapshot and change notifications.
- It removes prop drilling. The cart, its actions and the page-scoped add announcement reach the components that use them directly.
- It needs no extra library.
- Zustand is a possible alternative and could also be used without duplicating the cart state. It is not needed for the current requirements.
- Trade-off: every Context consumer re-renders when the cart value changes, including each ProductCard. Cart changes come only from user clicks, so this is acceptable here.

`VariantSelector` is written inside `ProductDetails` and passed to `ProductGallery` as `children`, so it renders between the main photo and the thumbnails.

## Server and Client Components

- `'use client'` is placed only where a Server Component imports a component that needs hooks, events or Context: AppShell, Hero, ProductCard, RoomSlider, RegistrationSection, ProductsPage, ProductDetails, InspirationPage, AboutPage, CheckoutPage, NotFoundPage, ErrorBoundary and the two `error.tsx` files. Everything those components import runs in the browser as well.
- The route files, HomePage, FeaturedProducts and ProductGrid are Server Components. Server Components pass only plain data (products, strings and promises) to Client Components.
- The cart is browser-only state. `useCart` gives `useSyncExternalStore` an empty server snapshot, so the server HTML and hydration show an empty cart (count 0); React then switches to the saved `raha-cart` without a hydration mismatch. The cart count therefore shows 0 for a moment after a refresh.
- The Day 3 `state.ts` reads `localStorage` when it is imported, including during the server render. Its own `try/catch` returns an empty cart there, so no Day 3 file needed a change, and the server never changes that cart. On Node.js 26, the server prints an experimental-feature warning when `localStorage` is touched without a storage file; it is a server log line, not a browser Console message.
- Search, filter and sort are read by `useProductSelection` (`useSyncExternalStore` on `location.search`, with the server's search for hydration) and written with `history.replaceState`. Reading them through `useSearchParams` dropped characters while typing, because it updates later than the controlled field.
- `useRouteFocus` (`src/features/layout/useRouteFocus.ts`) moves focus to main after a page change, or to the hash target once it appears (for example `/about#returns`). Changing only the search or the finish keeps the pathname, so focus stays where it is.
- The entrance intro starts in an effect after hydration. `useEntranceMotion` animates only content that was rendered on the server (it reads a hydration flag once, with `useSyncExternalStore`); content that mounts later, such as catalogue cards streamed from the API, appears normally. CatalogueResults also provides `EntranceContext` as `null`.

## Products API client and data loading

`src/lib/api/products.ts` is the shared products API client. It imports `server-only`, so it can be used only by Server Components.

- It requests `RAHA_API_URL + /api/products` and `RAHA_API_URL + /api/products/:id` with the Day 3 `fetchJson`, unchanged. The list is checked with the Day 3 `parseProductsResponse`; one product is checked as a one-item list. `mapApiProduct` converts cents to dollars.
- `getProducts()` and `getProduct(id)` are wrapped in React `cache()`, so a page and its `generateMetadata` share one request.
- `getProduct` returns `null` for a 404, and the page calls `notFound()`. Other errors (server error, network error, invalid data, a different ID) are thrown.
- `RAHA_API_URL` is read on the server at request time and must be a full `http(s)` URL. It is not sent to the browser.

Catalogue (`/products`):

- The page is `force-dynamic`. It starts `getProducts()` without awaiting it and passes the promise, a new `requestId` and the server's URL search to ProductsPage.
- CatalogueSummary and CatalogueResults read the promise with `use()` inside Suspense and two Error Boundaries. The h1, search, filters and sort sit outside the boundaries, so they keep working and keep focus while results load or fail.
- Search, filter and sort derive the visible list with the Day 3 `selectProducts` on a copied array, and never start a server request.
- Try again calls `router.refresh()` in a transition. The server renders the page again with a new request and `requestId`; both boundaries use `requestId` as `resetKey`, so they clear their errors together. While the refresh runs, the error area shows "Loading products...". Focus moves to `#catalogue-results`.
- Empty and no-match states: "The catalogue is empty. Please check back soon." and "No products match these selections…" with Reset.

Product details (`/products/[id]`):

- The page awaits `getProduct(id)`. `loading.tsx` shows "Loading product..." while it waits; the header, footer and cart stay usable.
- `error.tsx` shows "We could not load this product." with Try again, which calls Next.js `retry()` to fetch and render the page again. Focus moves to main.
- `not-found.tsx` shows "We couldn't find that product." without Try again. Because the response is streamed, the HTTP status of this view is 200 with a `noindex` robots tag; unknown routes outside `/products/[id]` return 404.
- The finish is read from `?color=` with `useSearchParams` and changed with `history.replaceState`, so it never requests the product again. The cart's add action still validates products against the static catalogue, with the same IDs as the API.

Pages: `src/app/error.tsx` catches errors in any other page and shows "This page could not be loaded." with Try again (`retry()`), inside the layout.

## API test switches

The switches from the course API, `/delay/<ms>`, `/fail/<400-599>` and `/empty`, go at the start of a page URL. They can be combined.

| Example                         | Result                                                                     |
| ------------------------------- | -------------------------------------------------------------------------- |
| `/delay/3000/products/arc-sofa` | "Loading product..." for about 3 s, then the product                       |
| `/delay/3000/products`          | The page and controls at once; "Loading products..." for about 3 s         |
| `/fail/500/products`            | "We could not load the catalogue. Please try again." with working controls |
| `/fail/500/products/arc-sofa`   | "We could not load this product." with Try again                           |
| `/empty/products`               | "The catalogue is empty. Please check back soon."                          |

- `src/proxy.ts` removes the switches with `splitTestSwitches()` (`src/lib/api/test-switches.ts`), rewrites the request to the real path and passes the switches in the `x-raha-test-switches` request header. It deletes that header from every incoming request first, so only the proxy can set it.
- The API client checks the header again and puts the switches in front of `/api` in the API URL, so the delay, error or empty list really comes from the products API.
- The switches apply only to the URL they are on; links from that page go to normal URLs.
- They are on in development and off in production unless `RAHA_TEST_SWITCHES=1` is set (for example `RAHA_TEST_SWITCHES=1 npm run start`). When they are off, a switch URL shows the 404 page.
- In Git Bash, add `MSYS_NO_PATHCONV=1` before commands whose arguments start with `/`, or Git Bash rewrites them into Windows paths. This happens in shell commands, not in the browser address bar.

## Demo checkout

`/checkout` is a page inside the shared layout. The cart dialog shows a "Review demo order" link when the cart has items; it closes the dialog and opens the page.

- **Empty cart:** StatusMessage "Your cart is empty, so there is nothing to review yet." and a link to Products.
- **Form** (`CheckoutForm`): built with react-hook-form, the `zodResolver` from `@hookform/resolvers`, and the shadcn `Field`, `FieldLabel`, `FieldDescription`, `FieldError` and `Input`. The submit button is the RAHA `Button`.
  - The fields are full name, email address, street address, city, postal code, and a required checkbox confirming the order is a demo. There is no payment, delivery service or fee.
  - Every rule and message is in one schema, `src/features/checkout/checkout-schema.ts`. Values are trimmed, and the email is checked with `z.email`. The postal code accepts 3 to 10 letters, numbers, spaces or hyphens.
  - `mode: 'onTouched'`: an error appears after a field is left or on submit, and then updates while typing. On submit, react-hook-form focuses the first invalid field.
  - Each invalid field gets `aria-invalid="true"` and an `aria-describedby` pointing to its `FieldError` message, which has `role="alert"`.
  - `noValidate` turns off the browser's own messages, so only the Zod messages are shown.
- **Success:** the form is replaced by "Demo order confirmed." The heading receives focus, and a status says that nothing was sent, saved or charged. The entered values are not passed on, sent or stored; CheckoutPage keeps only `confirmed`. The cart is kept. "Start a new demo order" shows an empty form and focuses the full name field.
- **Order summary** (`OrderSummary`): reads lines, count and subtotal from `useCartContext`. Nothing is copied into state.
- **Styling:** RAHA classes in `globals.css` (`.checkout-*`). The unlayered RAHA input rule gives the fields the same look as the contact form. The checkbox is a native input styled with `accent-color`.

## Props

`AddHandler` is `(productId: string, variantId: string) => void`, exported from `src/features/cart/cart-store.ts`.

| Component                             | Props                                                                                                                                                       |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RootLayout                            | `children: ReactNode`                                                                                                                                       |
| AppShell                              | `children: ReactNode` (the current page); reads the pathname with `usePathname`                                                                             |
| SiteHeader                            | `onOpenCart: () => void`; reads `quantity` from `useCartContext` and the pathname with `usePathname`                                                        |
| HomePage                              | `products: readonly Product[]`                                                                                                                              |
| Hero                                  | `image: string`, `alt: string`                                                                                                                              |
| FeaturedProducts                      | `products: readonly Product[]`                                                                                                                              |
| RoomSlider                            | `slides: readonly (typeof heroSlides)[number][]`                                                                                                            |
| RegistrationSection                   | none                                                                                                                                                        |
| ProductsPage                          | `products: Promise<Product[]>`, `requestId: string`, `initialSearch: string`                                                                                |
| CatalogueSummary                      | `products: Promise<Product[]>`                                                                                                                              |
| CatalogueResults                      | `products: Promise<Product[]>`, `selection: ProductSelection`, `onReset: () => void`                                                                        |
| CatalogueControls                     | `selection: ProductSelection`, `onChange: (selection: ProductSelection) => void`, `onReset: () => void`                                                     |
| ProductGrid                           | `products: readonly Product[]`                                                                                                                              |
| ProductCard                           | `product: Product`, `position: number` (grid position, used only to stagger the intro motion); reads `add` from `useCartContext`                            |
| ProductDetails                        | `product: Product`; reads `?color=` with `useSearchParams` and `add` from `useCartContext`                                                                  |
| ProductGallery                        | `product: Product`, `variant: ProductVariant`, `children: ReactNode`                                                                                        |
| VariantSelector                       | `variants: readonly ProductVariant[]`, `selected: ProductVariant`, `onSelect: (variantId: string) => void`                                                  |
| ErrorBoundary                         | `children: ReactNode`, `fallback: (error: unknown, retry: () => void) => ReactNode`, `onRetry?: () => void`, `resetKey?: string`                            |
| PageError, ProductError (`error.tsx`) | `error: unknown`, `retry: () => void`                                                                                                                       |
| InspirationPage                       | none                                                                                                                                                        |
| RoomSection                           | `room: InspirationRoom`, `position: number`                                                                                                                 |
| RoomCalculator                        | none                                                                                                                                                        |
| AboutPage                             | none                                                                                                                                                        |
| ContactForm                           | none                                                                                                                                                        |
| CheckoutPage                          | none; reads `quantity` from `useCartContext`                                                                                                                |
| CheckoutForm                          | `onConfirmed: () => void` (called after valid input; values are not passed)                                                                                 |
| OrderSummary                          | none; reads `items`, `quantity` and `subtotal` from `useCartContext`                                                                                        |
| NotFoundPage                          | `heading?: string`                                                                                                                                          |
| SiteFooter                            | `year: number`                                                                                                                                              |
| CartProvider                          | `page: string` (the pathname the add announcement belongs to), `children: ReactNode`                                                                        |
| CartStatus                            | none; reads `status` from `useCartContext`                                                                                                                  |
| CartDialog                            | `open: boolean`, `onClose: () => void`; reads the cart and its actions from `useCartContext`                                                                |
| CartLineItem                          | `line: CartLine`, `onAction: (key: string, action: CartAction) => void`                                                                                     |
| QuantityControl                       | `quantity: number`, `itemLabel: string`, `finishName: string`, `cartKey: string`, `onDecrease: () => void`, `onIncrease: () => void`                        |
| EntranceOverlay                       | `overlayRef: RefObject<HTMLElement \| null>`, `skipRef: RefObject<HTMLButtonElement \| null>`, `onSkip: () => void`                                         |
| Button                                | all native `ButtonHTMLAttributes<HTMLButtonElement>` plus `tone?: 'primary' \| 'secondary'`; `type` defaults to `button`                                    |
| FormField                             | `id: string`, `label: string`, `hint?: string`, `error?: string`, `className?: string`, `children: ReactNode`                                               |
| StatusMessage                         | `kind: 'loading' \| 'error' \| 'empty' \| 'no-match' \| 'success'`, `message: string`, `className?: string`, `onRetry?: () => void`, `onReset?: () => void` |

Reusable components with more than one call site or many data-driven instances: Button, FormField, StatusMessage, ErrorBoundary, ProductGrid, ProductCard, CartLineItem, QuantityControl, RoomSection and NotFoundPage.

## State ownership

| State                                 | Owner                                                                | How it changes                                                                                                                                                                         |
| ------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Current page                          | The URL path, read with `usePathname`                                | `next/link` navigation. `useRouteFocus` moves focus after a change.                                                                                                                    |
| Search, category/collection, sort     | URL (`q`, `category`/`collection`, `sort`)                           | `useProductSelection` reads it; `replaceProductSelection` writes it with `history.replaceState` and an event. The visible list is derived with `selectProducts` and never stored.      |
| Catalogue list                        | The `getProducts()` promise from the products Server Component       | A new server render (first visit or Try again) creates it. It is read with `use()`; it is not copied into state.                                                                       |
| Catalogue error reset                 | ErrorBoundary (`failed`, `error`), reset by `requestId`              | Set when the list fails. A new server render brings a new `requestId`, which clears both catalogue boundaries.                                                                         |
| One product                           | The products/[id] Server Component (`getProduct`, cached per render) | Each visit or Try again (`retry()`). Passed to ProductDetails as a prop.                                                                                                               |
| Cart entries and `raha-cart` storage  | Day 3 `src/state.ts`                                                 | Components call only the Context actions `add`, `change` and `clear` from `CartProvider`. They use `cart-store.ts`, which keeps a cached snapshot and notifies subscribers.            |
| Cart lines, count, subtotal           | Derived in `useCart`, called only by `CartProvider`                  | `calculateCart(snapshot)`, with an empty server snapshot. Shared through `CartContext`; never stored as separate state.                                                                |
| Cart open/closed                      | AppShell (`cartOpen`)                                                | `SiteHeader.onOpenCart` opens it; `CartDialog.onClose` closes it (close button, Continue, Escape, the checkout link).                                                                  |
| Cart add announcement                 | CartProvider (`announcement`)                                        | Set by the Context `add` action and shown by `CartStatus`. It stores the pathname where it was set, so it disappears on navigation.                                                    |
| Cart keyboard focus after an action   | CartDialog (`pendingFocus` ref)                                      | After an increase/decrease/remove/clear, focus moves to the same control, or to Close/Continue.                                                                                        |
| Selected finish                       | URL `color`                                                          | `ProductDetails` derives the variant with `getVariant`; `VariantSelector.onSelect` calls `replaceProductColor`.                                                                        |
| Gallery view                          | ProductGallery (`chosen`: `finishKey` and `viewId`)                  | Thumbnail clicks set it. A new finish or product resets it to the product photo during render, without a `key` remount.                                                                |
| Active room slide                     | RoomSlider (`activeId`)                                              | Slide buttons.                                                                                                                                                                         |
| Registration open, status, form reset | RegistrationSection (`open`, `status`, `formKey`)                    | A valid submit closes the non-modal dialog and shows the demo status. The form key changes, so the inputs are cleared.                                                                 |
| Contact status, form reset            | ContactForm (`status`, `formKey`)                                    | A valid submit shows the demo message and clears the form. Nothing is sent.                                                                                                            |
| Checkout field values and errors      | react-hook-form inside CheckoutForm                                  | Typing and leaving fields update them. On success the form unmounts, so the values are discarded.                                                                                      |
| Checkout confirmed                    | CheckoutPage (`confirmed`)                                           | A valid submit sets it to `true`; "Start a new demo order" sets it back to `false`.                                                                                                    |
| Room dimensions and area              | RoomCalculator (`width`, `length`, `area`)                           | Controlled inputs; submit calls the Day 3 `calculateRoomArea`.                                                                                                                         |
| Entrance intro and content motion     | `useEntrance` in AppShell (`startedAt`, `claimed` ref)               | The Day 3 `claimEntranceSession` decides once per session (`?intro=replay` replays); reduced motion skips it. Skip, Escape, the 3750 ms timer, moving focus away or navigating end it. |

List keys always come from data: `product.id`, `line.key` (product + finish), `variant.id`, gallery `view.id`, `slide.id`, `room.id`, and category or collection IDs.

## Products API (`products-api/`)

A separate API for RAHA products. The Next.js app reads it through `RAHA_API_URL`. It is not deployed.

- It has its own `package.json` with no dependencies. Node.js 22.18 or newer runs its TypeScript files directly with type stripping.
- `npm run api:build` runs `scripts/generate-products.ts`, which reads `src/data.ts` with the unchanged Day 3 `serializeProducts` (prices in cents) and writes `products-api/generated/products.json`. That file is generated on every build and ignored by Git, so `src/data.ts` stays the only product source. It cannot import `products.client.ts`, because that file imports `api-client.ts`, whose `ApiError` uses a parameter property that type stripping does not support.
- `src/handle-request.ts` holds the request rules: `GET /api/products` returns `{ items }`; `GET /api/products/:id` returns one product or 404 with `{ "error": "Product not found" }`; `/delay/<ms>` (max 8000), `/fail/<400-599>` and `/empty` go before `/api`, and `/empty` affects only the list; other paths get 404 and other methods 405 with `Allow: GET`.
- `npm run api:start` serves it on `http://127.0.0.1:4000` (`PORT` changes the port). Without the generated file, it stops with a message to run the build first.
- `products-api/tsconfig.json` is referenced from the root `tsconfig.json`, so `npm run typecheck` checks it.

Hosting limitations:

- Neither the app nor the API is deployed. A deployment needs the API hosted first (planned: a separate Vercel project with Root Directory `products-api`), then `RAHA_API_URL` set for the app. The Vercel function adapter and `vercel.json` are not written yet.
- Vercel's documentation says a build can read files outside the Root Directory by default, and the default function limit with Fluid compute is 300 s, which covers the 8000 ms delay cap. Preview deployments behind Deployment Protection need a bypass for server-to-server requests.
- The test switches are off in production unless `RAHA_TEST_SWITCHES=1` is set.

## Verification status

### Tailwind globals and tokens (2026-11-11)

- `npm run typecheck`, `npm run lint` (0 warnings), `npm run format:check` and `npm run build` pass. All 23 reused Day 3 files are byte-identical to the originals.
- A computed-style snapshot recorded about 60 CSS properties, the placeholder colour, the focused element and the position and size of every element. It covered 16 states at 360, 768 and 1280px (48 snapshots, 11,640 elements): Home, Products, a product page, Room Inspiration, About, the 404 and unknown-product pages, the product and catalogue errors, the empty catalogue, the checkout empty, with a cart item, with errors and with a focused field, the focused search field and the open cart. It was compared with the same snapshot of the build before the change; two snapshots of that build matched each other exactly.
  - The first comparison found preflight changes, which the base layer now fixes: the cart dialog sat at the top left instead of the centre; buttons without their own padding lost the browser's padding (the cart button became 12px narrower); placeholders turned 50% ink instead of the browser grey; options and legends lost their small padding; option-group labels lost their bold weight; and the checkout fields changed from 15px to 16px text below 768px and 14px from 768px.
  - After the fixes, every element has the same position and size, and no colour, font, spacing, border or radius changed, at all three widths. The remaining differences render nothing: the `html` element's own font and line height (`body` still sets RAHA's), `tab-size`, `border-style: solid` on zero-width borders, `vertical-align: middle` on images and icons, `appearance: button` on buttons, and a transparent tap highlight on all elements instead of only on links and controls.
  - No horizontal overflow at 360, 768 and 1280px.
- Generated utilities: about 130, all from the shadcn components. No RAHA class name matches a Tailwind utility in the rendered pages.
- On the production server, the 109-check run passed twice in a row, and the checkout (50/50), cart (21/21) and focus (17/17) runs passed. Three earlier runs of the 109-check run stopped at one check that read the catalogue summary while React still held the streamed summary next to its fallback for a moment. In 10 loads, the summary and the cards became visible in the same frame every time. The check now waits until one summary remains.
- In development, all routes logged no Console warnings or errors (the 404 page logs its intended 404 response).
- Not checked: hover and active states (their rules were moved unchanged), browsers other than Chromium, and the intro with motion (only its start and Escape are covered by the 109-check run).
- After the shared Input rewrite (same day), the four commands passed. The same 48-snapshot comparison changed only the checkout with a cart item, with errors and with a focused field:
  - The text fields are 51.5px high instead of 44px (53.5px with the error border), the same height as the contact form fields. The old 44px came from the shadcn `h-9` class.
  - The faint shadcn shadow and its 3px focus and error rings are gone. The focus outline (3px, charcoal, 5px offset), the 1px stone-grey border, the 5px radius and the background are unchanged, and an invalid field still has a 2px ink border.
  - The form grows by about 37px (47px with errors), which moves the content below it; no other page changed.
  - The checkout (50/50) and focus (17/17) runs passed on the production server. A separate test page with the built CSS showed a disabled Input at 50% opacity with a not-allowed cursor, skipped by Tab.
- After the old input rule stopped applying to the Input (same day), the four commands passed. The 48-snapshot comparison with the build before showed 0 differences, including the checkout with errors (still 53.5px with the 2px border) and every old field. A separate test page with the built CSS showed, outside the checkout:
  - A normal Input with the same height, border, radius, colours, padding and font as an old field (51.5px).
  - `aria-invalid`: a 2px ink border (53.5px); an old field with `aria-invalid` is unchanged.
  - `disabled`: 50% opacity and a not-allowed cursor, skipped by Tab.
  - Keyboard focus: the 3px charcoal outline with a 5px offset, also on an invalid Input.
  - The checkout (50/50) and focus (17/17) runs passed again on the production server.

### Next.js App Router (2026-11-09)

- `npm run typecheck`, `npm run lint` (0 warnings), `npm run format:check` and `npm run build` pass. All 23 reused Day 3 files are byte-identical to the originals.
- A Playwright run passed 109/109 against the production server (`npm run start`, with `RAHA_TEST_SWITCHES=1`) and against the dev server (`npm run dev`, StrictMode), both reading the local products API. It covered:
  - Every route: title, one h1, the shared header, footer and cart, and no horizontal overflow at 360, 768 and 1280px. An unknown path returns 404.
  - Legacy URLs (`/?page=…`, old category pages, collections, a product with a finish, a hash) redirecting to the new paths.
  - The catalogue from the API (60 cards): search with focus kept and no lost characters, no-match with Reset, category filter and price sort, with no server request for any of them.
  - A product from the API: finish in the URL with focus kept, the gallery, add to cart, and the cart restored after a refresh.
  - An unknown product showing "We couldn't find that product." without Try again.
  - `/delay/3000`, `/fail/500` and `/empty` through page URLs, with the layout and the catalogue controls usable during loading and errors.
  - A real API outage: the list and the product show their errors, and after the API restarts, Try again loads the list (focus on the results) and the product.
  - The cart across pages, the add announcement clearing on navigation, focus on main after navigation, increase with focus kept, the "Review demo order" link, clear and Escape.
  - The intro on the first visit (hero class and six staggered cards), Escape, no replay in the same session, and the footer link focusing `#returns`.
- The earlier checkout (50/50), cart (21/21) and focus (17/17) runs passed against the production server with the selectors and links updated to the new paths.
- A computed-style snapshot of the six pages at 360, 768 and 1280px was compared with the snapshot taken on the Vite version. The only differences were elements that render nothing: Next.js's hidden metadata elements, its streamed `<title>`/`<meta>` on the product page, and the removed `#product-region` wrapper. Colours, fonts, spacing, sizes and positions matched on all 18 pages.
- Console: the normal pages, the catalogue, the product page and the cart logged no warnings or errors in development or production. The intentional `/fail/500` pages log React's report of the caught error: the `ApiError` text in development, and React error #441 in production, whose message React omits in production builds by design.
- Problems found and fixed during the migration:
  - Reading the catalogue selection with `useSearchParams` dropped typed characters ("Lamp" became "Lp"). It is now read synchronously with `useSyncExternalStore`.
  - The intro did not animate the Home content, because page content hydrated after the intro started. Motion now applies to server-rendered content.
  - A footer hash link focused main instead of `#returns` while the page was still loading. `useRouteFocus` now waits for the target.
  - A root `loading.tsx` streamed even static pages behind a hidden copy, which briefly showed two h1 elements and would hide content without JavaScript. It was removed; Products streams its own results, and `/products/[id]` keeps its `loading.tsx`.
  - After an error the browser requested `/favicon.ico` and got a 404; `next.config.ts` now serves `/raha.svg` there.
  - The layout's title template does not apply to the root page, so Home sets its full title.

### Before the Next.js migration (Vite version)

The entries below were recorded on the earlier Vite version, at its query-string URLs. The user's React DevTools inspections and manual checks in this section were made on that version and have not been repeated on Next.js.

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

- On 2026-11-09, the standalone products API was built and served locally on Node 26.
  - The build wrote 60 products, and Git ignores `products-api/generated/products.json`.
  - A request run passed 21/21. It covered:
    - The list (`{ items }`, 60 products, `no-store`), identical to the current Vite `/api/products` response.
    - One product equal to its list item, with the price in cents.
    - 404 for an unknown ID, a badly encoded ID and other paths.
    - Delay of about 3 s and the 8000 ms cap.
    - `/fail/500` and `/fail/503` on both endpoints, and 400 for a code outside 400-599.
    - `/empty` affecting only the list, a combined delay and fail, and 405 for POST.
  - Starting the server without the generated file stopped with the build message.

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
- The user's React DevTools inspections were made on the Vite version and cover only the components listed above. They have not been repeated on Next.js.
- The unknown-product view (`/products/[id]`) is sent with HTTP status 200 and a `noindex` robots tag, because the page streams before `notFound()` runs. Other unknown paths return 404.
- The cart count shows 0 for a moment after a refresh, until the browser cart is read after hydration.
- On Node.js 26, the server logs an experimental-feature warning when the Day 3 `state.ts` touches `localStorage` during the server render.
- The products API and the app are not deployed.
- Tailwind is set up, but no page has been converted yet: the components are still styled by the component rules in `globals.css`. There is no dark mode. `components/ui` has the shadcn Field and Label, the shared Input (used by the checkout), and the new Button and Card, which no page uses yet; there is no Badge or Modal.

## Project documents

- `debug-lab-log.md` records the five course debug-lab bugs with AI disclosure. Bug 5 (CartRow) showed no visible problem in the user's test and was identified through a source review. The fixes in the log are suggestions and were not applied to the lab.
- CLAUDE.md and AGENTS.md describe the current project and its rules. CLAUDE.md lists eight learning rules, each with its source: course-lab bugs, bugs found by automated checks, and one mistake the user reported.
