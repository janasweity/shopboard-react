# RAHA React migration plan (temporary)

Status: Stage 0 saved in commit b8fccdf. Stage 1 copied and verified; changes remain unstaged/uncommitted for review. Stages 2-6 are not authorized. This temporary plan must be removed before final submission after approved cleanup.
Inspection date: 2026-11-05 (Europe/Istanbul).

## Stage 1 execution record

- Verified the target root, independent Git repository and clean starting commit b8fccdf. The two skills contain 90 tracked files in that commit. The original project status remains its pre-existing untracked docs/ directory.
- Copied exactly 23 TypeScript files at their original relative paths. Recursive inspection of relative import/export references found no missing file dependencies beyond the planned set. No original files were edited.
- All 23 copies match source bytes and SHA-256 hashes. No import type corrections or other copied-file changes were necessary.
- Initial typecheck and build failed with TS1294 at src/shared/api/api-client.ts:3 because erasableSyntaxOnly=true rejects the original constructor parameter property. Reported the conflict before applying the target-only configuration adjustment already listed in Stage 1: erasableSyntaxOnly=false in tsconfig.app.json. strict remains true; no copied module was changed. The node config retains erasableSyntaxOnly=true.
- After the configuration change, typecheck and build passed. Lint passed with zero warnings and format:check passed. Final comparisons/checks are recorded at handoff; no runtime/UI behavior validation is claimed.
- The React entry, App component, styles and assets are unchanged. No old DOM UI, page templates, middleware, React components, store adapters or API hosting integration were copied or implemented. Copying API modules does not expose /api/products in this target; that integration is Stage 3.
- No installation, staging, commit, remote change, push, deletion, deployment or upload. Stop before Stage 2.

### Explicit approval of the TypeScript compatibility setting

The user explicitly approved erasableSyntaxOnly=false in tsconfig.app.json after reviewing the TS1294 cause and the configuration change. The earlier Stage 1 approval referenced the plan but did not separately approve this option; this follow-up provides that explicit approval.

Reason: src/shared/api/api-client.ts:3 declares public readonly status as a constructor parameter property. It requires a runtime assignment and cannot be handled by type erasure alone, so erasableSyntaxOnly=true reports TS1294. Disabling this restriction preserves the original ApiError implementation byte-for-byte and avoids changes beyond the permitted import type corrections. strict remains true. Vite 8 uses Oxc to transform the parameter property into ordinary JavaScript, including this.status = status, before browser execution; this was verified with an in-memory transformation. The node TypeScript configuration is unchanged.

This approval covers only the documented compatibility setting. This follow-up changes only MIGRATION_PLAN.md; no additional implementation, configuration, installation or Git changes are authorized or performed. Stop here and await further instructions.

### Copied files and responsibilities

| Files (all relative to the React root)     | Responsibility                                                                                 |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| src/shared/api/api-client.ts               | HTTP status/content-type handling and decoded JSON requests                                    |
| src/modules/products/products.types.ts     | Product, finish, catalogue selection, room and gallery domain types                            |
| src/modules/products/products.api.types.ts | API envelope/product/variant types with integer cent prices                                    |
| src/modules/products/products.api.ts       | Catalogue serializer converting dollar prices to integer cents                                 |
| src/modules/products/products.client.ts    | Runtime validation, cents-to-dollars mapping and loadProducts                                  |
| src/modules/products/products.logic.ts     | Combined case-insensitive search, category/collection filtering and non-mutating price sorting |
| src/modules/cart/cart.types.ts             | Cart entries/actions and derived line/summary types                                            |
| src/modules/cart/cart.logic.ts             | Product/finish identity, saved-cart validation and totals                                      |
| src/modules/rooms/rooms.logic.ts           | Pure floor-area calculation                                                                    |
| src/modules/state/session.ts               | Once-per-tab entrance-session marker                                                           |
| src/state.ts                               | Cart mutation, restore/save under raha-cart and session re-export                              |
| src/data.ts                                | Original public catalogue exports, required by cart logic                                      |
| src/data/catalog.ts                        | Combined product catalogue, categories, collections and helper exports                         |
| src/data/retained-products.ts              | Retained catalogue records                                                                     |
| src/data/curated-products.ts               | Curated catalogue records                                                                      |
| src/data/expanded-products.ts              | Expanded catalogue records                                                                     |
| src/data/additional-variants.ts            | Additional product finishes/variants                                                           |
| src/data/kitchen.ts                        | Kitchen product/collection/room data                                                           |
| src/data/page-imagery.ts                   | Original image URLs and descriptive metadata used by data modules                              |
| src/data/product-gallery-images.ts         | Product-specific alternate gallery image metadata                                              |
| src/data/inspiration.ts                    | Room scenes and exact product/finish links                                                     |
| src/data/hero-slides.ts                    | Original manual slider data                                                                    |
| src/product-gallery.ts                     | Pure selection of images appropriate to a product/finish                                       |

No image assets or styling were copied in Stage 1; existing image URLs remain data references for a later asset stage. Dormant shop-room.ts was not copied.

## Stage 0 execution record (historical; saved in b8fccdf)

This record supersedes the historical missing-setup observations in the initial inspection and compliance audit below.

- Verified the nested package.json root and confirmed both the target and its parent were outside Git before initialization. Created a standalone .git on branch main; no remotes, staged files or commits.
- Enabled strict in both app/node TypeScript configs; added typecheck, format, format:check, lint-staged and prepare scripts. Oxlint uses --deny-warnings and rejects explicit any, assertions, non-null assertions and TypeScript error suppression.
- Installed Prettier 3.9.10, Husky 9.1.7 and lint-staged 17.6.0. npm resolved @vitejs/plugin-react 6.2.1 and Oxlint 1.91.0 within existing dependency ranges; package-lock.json records the resolution. Node is 26.13.0 and npm is 11.20.0 in this environment.
- Added .prettierrc.json, .prettierignore, lint-staged.config.js, .husky/pre-commit and .gitattributes. Husky's repository-local core.hooksPath is .husky/_. Generated hook shims are ignored, while the actual pre-commit file is eligible for tracking.
- Added an explicit missing-root guard in src/main.tsx to satisfy the no-non-null-assertion rule; no UI components or behavior were migrated. Retained erasableSyntaxOnly=true; the possible Day 3 client conflict is deferred to Stage 1.
- Installed both skill packages from vercel-labs/agent-skills using Vercel's official skills CLI in copy mode because the skill-installer Python helper could not run in this environment. Complete physical packages live under .claude/skills, with hashes/source paths in skills-lock.json. Vendored skills are excluded only from project lint/format checks, not Git. Installation is not a claim that migration skill reviews or coursework were completed.
- Resolved setup ownership differences by aligning only the new .git directory owner with the project owner. No global Git safe.directory change was made. Sandbox commands use an exact, command-scoped exception when necessary.
- Final verification passed: npm run build, npm run lint (zero warnings), npm run typecheck and npm run format:check. A direct git hook run pre-commit invoked lint-staged successfully with no staged files. Its expected no-initial-commit backup warning does not indicate a lint/build failure; actual staged-file processing remains for a later approved commit.
- Tracking audit found 76 files in vercel-react-best-practices and 14 in vercel-composition-patterns: all 90 are physical files, zero symlinks and zero Git-ignored files. The index remains empty. Independent root and local hook path were verified; no remotes or commits exist.
- Original project remains read-only; no Day 3 files copied, UI migration, deletion, remote configuration, staging, commit, push, deployment or upload. Required skill commits remain intentionally pending the user's review.

## 1. Inspection and evidence (historical planning baseline)

| Project                                                                 | Observed baseline                                                                                                                   | Git status                                                                                 |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Original: C:/Users/morjm/OneDrive/Desktop/shopboard                     | Vite, vanilla TypeScript, 60-product catalogue, local API middleware, feature modules, Playwright tests, design and debugging notes | `git status --short` reports only `?? docs/`; preserve this user-owned untracked directory |
| Target: C:/Users/morjm/OneDrive/Desktop/shopboard-react/shopboard-react | Unmodified-looking React/Vite starter UI, existing node_modules and lockfile; no RAHA modules yet                                   | Git reports `fatal: not a git repository`; no clean/dirty claim is possible                |

Read original AGENTS.md, CLAUDE.md, README.md, DESIGN.md, notes.md, debugging-log.md, data exports, product/cart/room types and logic, state.ts, session helper, API client/decoder/serializer, navigation implementation, and Vite middleware. Inventoried original feature UI modules, public photography, and tests. Read target App/main, package.json, TypeScript and Oxlint configuration, and README. This was a source inspection, not a running visual comparison or test execution.

Target scripts are dev, build (`tsc -b && vite build`), lint (Oxlint), and preview. React/React DOM are declared ^19.3.1, Vite ^8.3.6, TypeScript ~7.0.2. Read-only node_modules manifest inspection confirms React 19.3.1, React DOM 19.3.1, Vite 8.3.6 and TypeScript 7.0.2 locally. This does not establish a successful build or lint run. The app TypeScript config does not explicitly enable strict mode; enabling it is a future configuration task. Formatting, separate typecheck, and browser test scripts are absent.

The original rules prohibiting frameworks, requiring map/join rendering, and delegated DOM events belong to the vanilla project. The user's explicit React migration supersedes them in the target. Preserve their user-visible outcomes with JSX and React events.

The supplied detailed requirements are now the planning authority. They explicitly require vercel-react-best-practices and vercel-composition-patterns, Prettier/Husky/lint-staged, debug-lab-log.md, three rules based on personally observed mistakes, and final cleanup. The previous provisional web-design-guidelines suggestion is superseded. Only the exact five course debug-lab bug descriptions remain unavailable; do not invent them. No skills were installed or executed, and nothing was built or published during planning.

### Root, copy and tracking audit

- The actual root is C:/Users/morjm/OneDrive/Desktop/shopboard-react/shopboard-react, verified by package.json, vite.config.ts, src/main.tsx and src/App.tsx. Its parent has no package.json; it contains the target, a separate shopboard_react directory and a package-lock.json. Do not modify those sibling/parent files.
- Target source/public inventory contains only the starter UI/assets: src/App.tsx, src/main.tsx, src/App.css, src/index.css, src/assets/hero.png, react.svg, vite.svg, public/icons.svg and public/favicon.svg. No Day 3 modules, data, state or API client have been copied yet. Do not infer a copy count or source commit.
- No target Git repository exists. Starter tracking is therefore unavailable, not "tracked" or "untracked" within a new repository. A new repository separate from Day 3 is pending approved setup.
- Target has no .claude/skills or .husky directory and no declared Prettier, Husky or lint-staged setup. Oxlint exists, but the lint script does not currently enforce zero warnings. Neither app nor node TypeScript config explicitly enables strict. main.tsx contains a non-null assertion to replace with a runtime root check during implementation.
- The original cart is a native modal dialog in index.html. Registration is a non-modal dialog in the Home registration section. Cart/form/slider notifications are polite live regions; there is no confirmed toast system to migrate.
- Room calculator and inspiration product links are active. src/data/shop-room.ts, hotspot handlers and related CSS exist, but current pages.ts/index.html render no hotspot scene/panel. Preserve active features; do not reactivate dormant hotspot UI without approval.
- This update rechecked Git and inspected active UI behavior in index.html, pages.ts, cart/forms/rooms/products UI modules and entrance/slider modules. No browser checks have been run.

## 2. Proposed structure and reuse boundary

Preserve protected modules at their original relative paths so runtime imports remain unchanged. New React UI is feature-based alongside this compatibility layer. Every reusable TSX component gets its own file and a typed Props interface; .ts files own non-JSX logic/types/hooks.

```text
shopboard-react/shopboard-react/          # verified package.json root
  AGENTS.md
  CLAUDE.md
  MIGRATION_PLAN.md                      # temporary; remove before submission
  README.md                             # final actual tree, props/state and commands
  DESIGN.md                             # final design rationale
  debug-lab-log.md                       # pending actual five course exercises
  .claude/skills/
    vercel-react-best-practices/          # install/commit only in approved step
    vercel-composition-patterns/
  .husky/pre-commit
  .prettierrc.json
  .prettierignore
  lint-staged.config.js
  src/
    main.tsx
    App.tsx
    app/{AppRoute.tsx,route.types.ts,navigation.ts,useRoute.ts}
    components/{Button.tsx,FormField.tsx,StatusMessage.tsx}
    features/
      layout/{SiteHeader.tsx,SiteFooter.tsx}
      home/{HomePage.tsx,Hero.tsx,FeaturedProducts.tsx,RoomSlider.tsx}
      products/
        components/{ProductCard.tsx,ProductGrid.tsx,CatalogueControls.tsx,
                    ProductGallery.tsx,VariantSelector.tsx}
        pages/{ProductsPage.tsx,ProductDetailsPage.tsx}
        hooks/useProducts.ts
      cart/{CartProvider.tsx,CartDialog.tsx,CartLineItem.tsx,
            CartSummary.tsx,QuantityControl.tsx,cart-adapter.ts,
            cart.context.ts,useCart.ts}
      forms/{RegistrationSection.tsx,RegistrationForm.tsx,ContactForm.tsx}
      rooms/{InspirationPage.tsx,RoomCard.tsx,RoomCalculator.tsx}
      about/AboutContactPage.tsx
      notifications/NotificationRegion.tsx
      interactions/{EntranceOverlay.tsx,useEntrance.ts}
    pages/NotFoundPage.tsx
    shared/api/api-client.ts              # protected original path
    modules/
      products/{products.types.ts,products.api.types.ts,products.api.ts,
                products.client.ts,products.logic.ts}
      cart/{cart.types.ts,cart.logic.ts}
      rooms/rooms.logic.ts
      state/session.ts
    state.ts                              # protected persistence
    data.ts
    data/                                 # original data dependency closure
    product-gallery.ts
    styles/{tokens.css,main.css}
  public/{raha.svg,images/}                # original assets, stable URLs
  tooling/products-api.ts                 # new Vite middleware integration
  tests/react-migration.spec.ts           # behavioral browser checks
  playwright.config.ts
```

Braces group exact filenames, not extra directories. If required, src/features/home/slide-title.ts is a new pure formatting helper for the source slide title tokens, not a component or a protected-file edit. Paths are proposed files, not files already created. Avoid extra SearchField/FilterSelect/SortSelect/navigation wrappers: keep native controls together in CatalogueControls and navigation inside SiteHeader. No CartPage route and no new hotspot UI are proposed.

### Reuse inventory

| Source                                                                       | Decision                                                                                                                |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| shared/api/api-client.ts                                                     | Copy unchanged: fetchJson, ApiError, content-type/status validation                                                     |
| modules/products/products.client.ts                                          | Copy unchanged: decoder, duplicate-ID checks, loadProducts, cents-to-dollars mapping                                    |
| products.types.ts, products.api.types.ts, products.api.ts, products.logic.ts | Copy unchanged; keep transport and UI types separate; reuse selectProducts and serializer                               |
| modules/cart/cart.types.ts, cart.logic.ts                                    | Copy unchanged; preserve product/variant keys, normalization, availability validation, totals                           |
| state.ts and modules/state/session.ts                                        | Copy unchanged; wrap existing mutation exports externally; preserve raha-cart and entrance session semantics            |
| modules/rooms/rooms.logic.ts                                                 | Reuse calculateRoomArea; validate positive finite inputs in the new form                                                |
| data.ts, data/*, product-gallery.ts, public/images                           | Copy required dependency closure and imagery without changing IDs, variants, or image paths; validate asset references  |
| pages.ts, ui.ts, old main.ts, shared/ui DOM helpers and *.ui.ts              | Inspect for behavior only; rebuild UI with React, do not initialize old DOM code                                        |
| styles/tokens.css, styles/main.css                                           | Reuse visual foundation; review selector compatibility against React markup                                             |
| vite.config.js products middleware                                           | Port integration into target Vite config alongside its React plugin after approval; do not change protected API modules |
| tests/*                                                                      | Reuse behavioral scenarios; adapt browser tests to React markup rather than copying DOM implementation assertions       |

Record a source-to-target manifest and file comparisons before UI work. Any differences in protected files must be limited to type-only import syntax. Preserve runtime imports exactly. Do not bring old project AGENTS.md/CLAUDE.md over the target instructions.

## 3. Complete component tree rooted at App

The route alternatives below are mutually exclusive. CartDialog remains available across all routes. RoomSlider renders slide-specific markup directly; it does not render RoomCard. RoomCard is the inspiration scene with matching ProductCard links.

```text
App
└── CartProvider
    ├── EntranceOverlay → Button
    ├── SiteHeader
    ├── main / AppRoute
    │   ├── HomePage
    │   │   ├── Hero
    │   │   ├── FeaturedProducts → ProductGrid → ProductCard → Button
    │   │   ├── RoomSlider → Button, StatusMessage
    │   │   └── RegistrationSection
    │   │       └── RegistrationForm → FormField, Button, StatusMessage
    │   ├── ProductsPage
    │   │   ├── CatalogueControls → FormField, Button
    │   │   ├── StatusMessage
    │   │   └── ProductGrid → ProductCard → Button
    │   ├── ProductDetailsPage
    │   │   ├── ProductGallery → Button
    │   │   ├── VariantSelector
    │   │   └── Button, StatusMessage, NotFoundPage (invalid product)
    │   ├── InspirationPage
    │   │   ├── RoomCard → ProductCard
    │   │   └── RoomCalculator → FormField, Button, StatusMessage
    │   ├── AboutContactPage
    │   │   └── ContactForm → FormField, Button, StatusMessage
    │   └── NotFoundPage → StatusMessage
    ├── NotificationRegion → StatusMessage
    ├── SiteFooter
    └── CartDialog
        ├── CartLineItem → QuantityControl → Button
        │               └── Button
        ├── CartSummary
        └── Button, StatusMessage
```

## 4. Component contracts and responsibility registry

Every row defines the exact file, parent/children, responsibility, source behavior replaced, state and callbacks. Each contract below is an interface named Props local to that TSX file (identical interface names in separate modules do not conflict). Contract names here are component names for lookup, not extra shared prop files. Readonly applies to data inputs; callbacks emit intent upward. No-input components have the contract `interface Props { readonly children?: never }` and no callbacks; do not add artificial state to them.

Type references: Product, ProductVariant, ProductSelection, CartLine, CartSummary and InspirationRoom use original types. Route is a new discriminated route value in src/app/route.types.ts with page, productId/color, query/category/sort and hash derived from URL. AddHandler is `(productId: string, variantId: string) => void`. ReactNode and ButtonHTMLAttributes come from type-only React imports; native control callback types use inferred or imported React event types. No any/assertions/non-null assertions are permitted in new code.

### Exact typed Props interfaces

```ts
// Each declaration is the interface Props in the named component file.
// App, SiteFooter, Hero, RoomCalculator, ContactForm, NotFoundPage:
interface Props {
  readonly children?: never
}
// CartProvider:
interface Props {
  readonly children: ReactNode
}
// SiteHeader:
interface Props {
  readonly route: Route
  onOpenCart: () => void
}
// AppRoute:
interface Props {
  readonly route: Route
  onAdd: AddHandler
}
// HomePage, FeaturedProducts, InspirationPage:
interface Props {
  onAdd: AddHandler
}
// RoomSlider: static slide data imported directly, active slide is local.
interface Props {
  readonly children?: never
}
// ProductCard: variantId is supplied only for existing room/finish links.
interface Props {
  readonly product: Product
  readonly variantId?: string
  readonly showAdd?: boolean
  onAdd: AddHandler
}
// ProductGrid:
interface Props {
  readonly products: readonly Product[]
  onAdd: AddHandler
}
// CatalogueControls:
interface Props {
  readonly selection: ProductSelection
  readonly resultCount: number
  onChange: (selection: ProductSelection) => void
  onReset: () => void
}
// ProductsPage:
interface Props {
  readonly route: Route
  onAdd: AddHandler
}
// ProductDetailsPage:
interface Props {
  readonly productId: string | null
  readonly colorId: string | null
  onAdd: AddHandler
}
// ProductGallery: selected view resets when product/variant changes.
interface Props {
  readonly product: Product
  readonly variant: ProductVariant
}
// VariantSelector:
interface Props {
  readonly variants: readonly ProductVariant[]
  readonly selectedId: string
  onChange: (variantId: string) => void
}
// CartDialog:
interface Props {
  readonly open: boolean
  onClose: () => void
}
// CartLineItem:
interface Props {
  readonly line: CartLine
  onIncrease: () => void
  onDecrease: () => void
  onRemove: () => void
}
// QuantityControl:
interface Props {
  readonly quantity: number
  readonly itemLabel: string
  onIncrease: () => void
  onDecrease: () => void
}
// CartSummary (import the original type locally as CartSummaryData):
interface Props {
  readonly summary: CartSummaryData
}
// RegistrationSection:
interface Props {
  readonly children?: never
}
// RegistrationForm: parent controls non-modal open/close and feedback.
interface Props {
  readonly open: boolean
  onValidated: () => void
}
// RoomCard:
interface Props {
  readonly room: InspirationRoom
  onAdd: AddHandler
}
// AboutContactPage:
interface Props {
  readonly children?: never
}
// NotificationRegion:
interface Props {
  readonly message: string
}
// EntranceOverlay: hook owns lifetime; component renders only while visible.
interface Props {
  readonly visible: boolean
  onSkip: () => void
}
// Button:
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly tone?: 'primary' | 'secondary'
}
// FormField: one accessible label/hint/error wrapper for all native controls.
interface Props {
  readonly id: string
  readonly label: string
  readonly hint?: string
  readonly error?: string
  readonly children: ReactNode
}
// StatusMessage:
interface Props {
  readonly kind: 'loading' | 'error' | 'empty' | 'no-match' | 'success'
  readonly message: string
  onRetry?: () => void
  onReset?: () => void
}
```

FormField callers give the native child control the matching id and aria-describedby IDs; no cloneElement or assertions are needed. FormField supports input/select/textarea without a complex prop union. Button defaults to type=button unless explicitly given type=submit. StatusMessage uses native action buttons directly, avoiding component dependency cycles.

### Exact files, relationships, ownership and replacements

All paths below are relative to src/. Children not listed are native semantic elements. Callback names refer to the interfaces above.

| Component file                                     | Responsibility and original behavior replaced                                                       | Parent → children                                                  | State owner and callbacks                                                                                                                                                        |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App.tsx                                            | Compose shell, global cart visibility and polite cart feedback; replace main.ts/ui.ts orchestration | main.tsx → CartProvider and shell children from tree               | Owns cart-open/message, uses useRoute/useEntrance; typed onAdd calls adapter then announces; onOpenCart/onClose clear or set UI state                                            |
| features/cart/CartProvider.tsx                     | Expose shared stable cart snapshot/actions; replace manual cart rerenders                           | App → all shell children                                           | useSyncExternalStore snapshot; original state.ts owns mutable cart/storage; children prop only                                                                                   |
| features/layout/SiteHeader.tsx                     | Brand, navigation, active links, cart count/toggle from original index.html                         | App → native links/button                                          | Reads useCart derived quantity; route/onOpenCart; no duplicated count                                                                                                            |
| features/layout/SiteFooter.tsx                     | Existing service, planning, registration and top links                                              | App → native footer links                                          | No state/inputs/callbacks                                                                                                                                                        |
| app/AppRoute.tsx                                   | Select active page and props; replace getPage HTML dispatch                                         | App → one route page                                               | No local route copy; route/onAdd forwarded                                                                                                                                       |
| features/home/HomePage.tsx                         | Home section order from pages.ts plus registration                                                  | AppRoute → Hero, FeaturedProducts, RoomSlider, RegistrationSection | No independent state; onAdd forwarded                                                                                                                                            |
| features/home/Hero.tsx                             | Existing hero image/copy/CTA, one Home h1                                                           | HomePage → native figure/link                                      | No state/inputs/callbacks                                                                                                                                                        |
| features/home/FeaturedProducts.tsx                 | Original six featured IDs and section heading                                                       | HomePage → ProductGrid                                             | Derives featured data, onAdd forwarded                                                                                                                                           |
| features/home/RoomSlider.tsx                       | Manual living/Burgundy & Butter Cream/kitchen copy/image/CTA selection                              | HomePage → Button, StatusMessage                                   | Owns active slide ID; derives announcement; local button callbacks; no external callbacks or autoplay                                                                            |
| features/products/components/ProductCard.tsx       | Reusable article for original catalogue card and finish-specific inspiration links                  | ProductGrid or RoomCard → Button                                   | No selection state; product/variantId; add uses original default finish unless an explicit room finish is supplied; showAdd=false on inspiration to preserve links-only behavior |
| features/products/components/ProductGrid.tsx       | Shared keyed article list from original card mapping                                                | FeaturedProducts or ProductsPage → ProductCard                     | No state; products/onAdd; product.id keys                                                                                                                                        |
| features/products/components/CatalogueControls.tsx | Existing search/clear/category/collection/price-sort/reset controls                                 | ProductsPage → FormField, Button                                   | Controlled selection from parent; onChange/onReset; native input/select handlers                                                                                                 |
| features/products/pages/ProductsPage.tsx           | API catalogue, counts and status matrix                                                             | AppRoute → CatalogueControls, ProductGrid, StatusMessage           | useProducts owns request state; controls derive from route, updates URL via navigation helper; onAdd forwarded                                                                   |
| features/products/pages/ProductDetailsPage.tsx     | Details/specifications/availability and finish URL from pages.ts/gallery UI                         | AppRoute → ProductGallery, VariantSelector, Button, StatusMessage  | Product/color route drives selected finish; onChange updates color URL; onAdd uses selected available finish                                                                     |
| features/products/components/ProductGallery.tsx    | Main image, captions, thumbnail selection and original-finish links                                 | ProductDetailsPage → Button                                        | Owns view ID, reset on product/variant; local thumbnail callback only                                                                                                            |
| features/products/components/VariantSelector.tsx   | Original finish controls, names/swatches/availability                                               | ProductDetailsPage → native radio group                            | Controlled selectedId; onChange; no extra selected state                                                                                                                         |
| features/cart/CartDialog.tsx                       | Original modal cart, clear/close/continue, empty state and list                                     | App → CartLineItem, CartSummary, Button, StatusMessage             | open from App; useCart snapshot/actions; onClose; refs for dialog/focus, no second cart state                                                                                    |
| features/cart/CartLineItem.tsx                     | Original list row image/name/finish/line price/removal                                              | CartDialog → QuantityControl, Button                               | No state; line plus onIncrease/onDecrease/onRemove                                                                                                                               |
| features/cart/QuantityControl.tsx                  | Accessible per-line increase/decrease and quantity display                                          | CartLineItem → Button                                              | Controlled quantity; callbacks upward; identity includes product and finish                                                                                                      |
| features/cart/CartSummary.tsx                      | Original subtotal/count display                                                                     | CartDialog → native text                                           | Derived summary prop only; no totals state                                                                                                                                       |
| features/forms/RegistrationSection.tsx             | Home registration copy, close/success/reopen/reset lifecycle                                        | HomePage → RegistrationForm                                        | Owns non-modal open flag and success message; onValidated closes and clears; reopen restores focus                                                                               |
| features/forms/RegistrationForm.tsx                | Required email/password native validation                                                           | RegistrationSection → FormField, Button, StatusMessage             | Owns transient fields only while open; onValidated; clear on close/unmount; no transmission/storage                                                                              |
| features/forms/ContactForm.tsx                     | Existing required name/email/topic/message demo                                                     | AboutContactPage → FormField, Button, StatusMessage                | Local field values/success, submit prevents sending then clears; no external callbacks                                                                                           |
| features/rooms/InspirationPage.tsx                 | Existing scene navigation and room-planning section                                                 | AppRoute → RoomCard, RoomCalculator                                | Static data; onAdd forwarded, no new shopping actions                                                                                                                            |
| features/rooms/RoomCard.tsx                        | Room story/photo and exact photographed-finish product links                                        | InspirationPage → ProductCard                                      | Static room prop, resolve validated product/finish; onAdd forwarded but showAdd=false                                                                                            |
| features/rooms/RoomCalculator.tsx                  | Existing width/length floor-area form/output                                                        | InspirationPage → FormField, Button, StatusMessage                 | Local raw strings/submitted valid dimensions; pure calculateRoomArea; native bounds 0.5–50, step 0.1; no external callbacks                                                      |
| features/about/AboutContactPage.tsx                | Original store story/support content/images                                                         | AppRoute → ContactForm                                             | No state/inputs/callbacks                                                                                                                                                        |
| features/notifications/NotificationRegion.tsx      | Existing cart-status live region; no new toast system                                               | App → StatusMessage                                                | Controlled message; no independent timers/state                                                                                                                                  |
| features/interactions/EntranceOverlay.tsx          | Existing RAHA entrance markup and skip control                                                      | App → Button                                                       | visible/onSkip from useEntrance in App; no session claims during render                                                                                                          |
| pages/NotFoundPage.tsx                             | Invalid route/product recovery links                                                                | AppRoute or details fallback → StatusMessage                       | No state/inputs/callbacks                                                                                                                                                        |
| components/Button.tsx                              | Shared styled native action control                                                                 | Forms/cards/cart/slider/entrance → native button                   | No state; inherited typed onClick/type/disabled/aria attributes                                                                                                                  |
| components/FormField.tsx                           | Linked labels, help/error descriptions                                                              | Controls/forms/calculator → caller's native control                | No state; id/label/hint/error/children, callbacks stay on child                                                                                                                  |
| components/StatusMessage.tsx                       | Accessible loading/error/retry/empty/no-match/success feedback                                      | Pages/forms/slider/notifications/cart → native action buttons      | No state; kind/message/onRetry/onReset                                                                                                                                           |

At least six genuinely reusable typed components: Button, FormField, StatusMessage, ProductCard, ProductGrid, and QuantityControl (repeated cart-line instances); additionally CartLineItem repeats per cart identity. Verify real reuse with multiple call sites or data-driven instances. Page wrappers do not count. Preserve card behavior: catalogue cards do not gain finish selectors; only details selects finishes, and inspiration cards remain links to exact finishes.

## 5. State ownership and React integration

Stable key policy: product.id for product lists, cartKey(productId, variantId) for cart rows, variant.id for finishes, view.id for gallery views, slide.id for slide controls, and room.id for scenes. Never use array indexes or generated values as identity.

| State                         | Owner and update model                                                                                                                                                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route/query parameters        | App useRoute hook; preserve existing `/?page=...`, id, color, category, collection, search/sort parameter conventions from source; Back/Forward, direct links, refresh, legacy aliases and retired products remain supported |
| Catalogue request             | ProductsPage/useProducts: discriminated loading/success/error state with products and retry trigger; fetch on Products entry and retry                                                                                       |
| Search/category/sort          | ProductsPage controls derive from URL route selection and emit typed URL updates; derive results through selectProducts; never duplicate selection in local state, mutate source, or store filtered arrays                   |
| Variant and gallery selection | Cards use the original default finish, or an explicit room finish without a picker. Details selected finish derives from product/color URL; ProductGallery owns its view ID and resets when product/variant changes          |
| Persistent cart               | Original state.ts owns mutable cart and storage; CartProvider holds a React snapshot exposed through useCart; header and all pages consume the same provider                                                                 |
| Forms                         | Each form owns transient inputs; RegistrationSection owns non-modal open/success/reopen state, ContactForm owns its demo feedback; native validity remains authoritative; clear credentials on close and never persist them  |
| Rooms                         | Calculator owns raw strings and last submitted valid dimensions; derive submitted area through calculateRoomArea; room content remains static data                                                                           |
| Slider/entrance               | Local interaction hooks own active slide/visibility; claim session in an effect, never during render; clean up animation callbacks/listeners                                                                                 |

Cart bridge: implement new cart-adapter.ts exposing getSnapshot, subscribe, and wrappers around addCartItem/changeCartItem/clearCart. Cache the immutable snapshot because original getCart returns a fresh array each call; useSyncExternalStore requires stable snapshots between notifications. Each wrapper invokes the original mutation, refreshes the cached snapshot, and notifies subscribers. All UI mutations must pass through the adapter. Do not mutate original exports or add a second persistence effect. Original module import restores storage before the adapter's first snapshot, and original mutation functions perform saves. Derive totals using calculateCart. This avoids startup empty saves, stale header badges, and duplicate storage ownership. Cross-tab synchronization is not present in the original and is not promised by this plan.

API hook: call unchanged loadProducts. Its fetchJson has no AbortSignal parameter. Use effect cleanup with an active flag/request generation to ignore responses after unmount or a newer retry; do not change the API signature to add cancellation. Clear stale error/status on retry. StrictMode may cause duplicate development requests; both must remain harmless and only the current result may update state.

## 6. Functional and design acceptance

- Preserve RAHA wordmark/tagline, soft-white #faf8f1 and warm-ivory #eee5d5 backgrounds, charcoal-brown #302923 text/buttons, original supporting tokens, serif headings and Helvetica/Arial body text. Match original section order, spacing, image crops, and controls through side-by-side browser review after approval.
- Home: living-room hero, six featured articles from data, manual room inspiration slider, registration demo. Retain distinct appropriate room imagery across sections.
- API catalogue: GET /api/products returns `{ items: [...] }`; transport product and variant prices are integer USD cents. loadProducts converts each exactly once to dollars. Home/details/cart retain source catalogue behavior; Products must genuinely load through the API, not silently fall back to static data on errors.
- API hosting: original endpoint is Vite dev/preview middleware, not part of dist. Preserve GET, JSON content type, no-store, and 405/Allow behavior. Before deployment choose and verify a host API/function or explicit backend/proxy serving the same contract; a static Vercel upload alone is insufficient. Deployment is not authorized by this planning task.
- Search/filter/sort: immediate case-insensitive trimmed product-name search; category and collection links; ascending/descending/default sorting; combine filters before sorting a copy; display count and reset; preserve URL conventions.
- Details: product/finish identity, matching image, price, availability, disabled unavailable actions, dimensions/materials/care, gallery thumbnails and original-finish gallery links. Invalid IDs show useful navigation rather than crashing.
- Full cart: same product+variant increments; other variants stay separate. Increase, decrease (one removes), remove, clear, count, line totals, subtotal and empty cart navigation. Reload preserves entries and quantities under raha-cart. Validate malformed JSON, obsolete IDs, unavailable variants, invalid quantities, duplicates and overflow through unchanged logic; blocked storage keeps in-memory functionality.
- Forms: registration required email/password minimum eight characters; native validation and accessible demo success. Contact remains non-sending. No real accounts, checkout, payment, network submission, or stored credentials.
- Inspiration: living-room, bedroom and kitchen scenes, matching product/finish links, manual slider, validated room area calculation.
- Status matrix: initial/request/retry loading; network/HTTP/non-JSON/malformed-payload errors with retry; successful zero-item API response distinct from filtered no-match; no-match reset; empty cart; product not found; unavailable finish; form validation and success. Announce routine changes politely; use alert for actionable errors without repeated announcements.
- Accessibility: English document language, skip link, header/nav/main/footer, one h1 per active page, article cards, logical headings, labels, alt text, visible focus and contrast. Prefer real links/buttons and native radio controls for finish selection. Keyboard-operable gallery/slider, named icon buttons, aria-current navigation, route title/focus updates, and cleanup of pending focus callbacks. Honor modified link clicks and browser navigation. The cart modal requires focus containment, Escape dismissal, close/continue focus return and recovery after row removal/clear. Keep registration non-modal with close/reset/reopen focus behavior.
- Mobile-first CSS at 360/768/1280px, no horizontal page overflow, readable controls, accurate swatches, reduced-motion and entrance skip/session/replay behavior.

## 7. Conflicts and decisions

| Constraint/conflict                                               | Resolution and approval boundary                                                                                                                                                                                                                                   |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Root in older attachment differs from actual root                 | Use the verified nested package.json directory, as the latest user request confirms; do not modify parent/sibling projects                                                                                                                                         |
| Feature-based UI vs protected original imports                    | New React feature folders alongside path-preserved modules/data; compare copied files and allow only necessary import type corrections                                                                                                                             |
| Cart state lacks subscriptions and getCart creates arrays         | External adapter caches immutable snapshots and notifies only after wrapped original mutations; no protected changes or second persistence owner                                                                                                                   |
| Existing state mutates its own Map                                | Preserve internal Day 3 behavior; never expose that Map as mutable React state. Readonly snapshots and typed callbacks enforce the new UI's no-mutation rule                                                                                                       |
| fetchJson has no AbortSignal                                      | Ignore stale results via effect cleanup/request identity; do not edit protected API to add cancellation                                                                                                                                                            |
| Protected ApiError uses constructor parameter properties          | Target erasableSyntaxOnly=true rejects this syntax. Propose erasableSyntaxOnly=false in app config while enabling strict in both app/node configs. Check the build transform supports it; if not, stop and explain any protected-file exception before applying it |
| Starter main.tsx uses a non-null assertion                        | Replace with an explicit root-element runtime guard during Stage 2; do not weaken the no-assertion rule                                                                                                                                                            |
| API catalogue vs cart validation against static source data       | Use the same original catalogue in API middleware/backend and preserved cart logic; verify IDs/variants/units agree. A divergent remote catalogue requires a separate course-compatible decision                                                                   |
| Vite middleware vs static production hosting                      | Development/preview integrate middleware in target; production needs a real /api/products route or backend/proxy. No deployment/upload now; hosting implementation requires approved scope                                                                         |
| Stored slider titles contain br/em HTML                           | Preserve original data; render a narrow supported line-break/emphasis representation as JSX using a new pure formatter if needed. No dangerouslySetInnerHTML or copied DOM string renderer                                                                         |
| Original hotspot handlers/data but no rendered hotspot UI         | Current tests also expect no .shop-the-room scene. Keep active inspiration links and calculator; do not reintroduce dormant features                                                                                                                               |
| New repository/skills committed vs documentation-only prohibition | Record setup as pending. Initialize/install/commit only within explicitly approved future scope; do not claim a clean/tracked repository now                                                                                                                       |
| Final plan removal vs no deletion now                             | Mark MIGRATION_PLAN.md temporary and required to be removed before submission; present exact cleanup list and get deletion approval in Stage 6                                                                                                                     |
| Five course debug bugs and personal mistake rules                 | Exact bug prompts are still missing; obtain them before the lab. Keep five exercises and three user-observed rules pending; no substitute tasks, invented logs or invented personal history                                                                        |

No protected source change beyond import type is currently proposed. Target configuration and new adapters are proposed separately and are not implemented by this documentation update.

## 8. Migration stages — Stage 0 through Stage 6

Stages 0 and 1 are approved; Stages 2?6 remain pending implementation approval. Each stage report must explain: **what changed, exact files/locations, why, visible behavior, validation results, and what the user should understand**. State failures/remaining risks honestly. Exact component paths and Props are in Section 4; references to those sets below mean those exact files, not arbitrary new abstractions.

### Stage 0 — Setup and Git audit

- **Create/change after approval:** package.json, package-lock.json, .gitignore, tsconfig.app.json, tsconfig.node.json, .oxlintrc.json, .prettierrc.json, .prettierignore, lint-staged.config.js, .husky/pre-commit. Create the separate target Git repository only in approved Git scope. Install required skill packages into .claude/skills/vercel-react-best-practices/ and .claude/skills/vercel-composition-patterns/; inspect their actual package files before recording the exact nested manifest. Commit skills only with explicit commit authorization.
- **Reuse unchanged:** existing React/Vite dependencies and plugin baseline unless a demonstrated setup issue requires an explained change; retain lockfile as baseline before approved package updates. Original project and its Git configuration stay unchanged.
- **Visible result:** starter UI still works; development checks and course tooling are ready. No RAHA UI claimed yet.
- **Validation/acceptance:** reverify nested root and both statuses; compare declared/installed versions; verify starter inventory/tracking after approved repo setup. Enable strict in app and node configs. Configure lint to fail on warnings, format/format:check and explicit typecheck; configure lint-staged to format/lint staged files and Husky to invoke it. Run build, lint (zero warnings), typecheck and format:check after approved configuration. Verify skill files are present, not ignored, and included in an authorized commit; no remote change/push implied.
- **Risks/dependencies:** Git writes/installs are currently prohibited. A current no-warning result has not been measured. Preserve user files outside target; skills' exact internal files are unknown until approved installation.
- **Understand/explain:** root vs parent, separate Day 3/React repositories, dependency ranges vs installed versions, strict typing, formatting vs lint, hooks and skill purpose. Explain each setup change, where and why.

### Stage 1 — Day 3 module reuse

- **Copy exact protected files unchanged:** src/shared/api/api-client.ts; src/modules/products/products.types.ts, products.api.types.ts, products.api.ts, products.client.ts, products.logic.ts; src/modules/cart/cart.types.ts, cart.logic.ts; src/modules/rooms/rooms.logic.ts; src/modules/state/session.ts; src/state.ts. Necessary import type corrections only, if comparisons/type diagnostics justify any; none are assumed necessary in advance.
- **Copy dependency/data files unchanged:** src/data.ts; src/data/catalog.ts, retained-products.ts, curated-products.ts, expanded-products.ts, additional-variants.ts, kitchen.ts, page-imagery.ts, product-gallery-images.ts, inspiration.ts, hero-slides.ts; src/product-gallery.ts. Existing data/shop-room.ts is dormant and is not required for active UI; do not introduce an import for it just to copy it.
- **Other files to change:** tsconfig.app.json only if the documented erasableSyntaxOnly compatibility setting is needed. Track copy comparisons temporarily in this plan; do not create a permanent AI planning artifact.
- **Visible result:** no RAHA UI yet; reusable catalogue/API/cart/room functions compile at their original paths. Day 3 modules currently copied: none; all listed copies remain pending.
- **Validation/acceptance:** compare each target copy against source, including runtime imports; list every type-only difference. Verify transitive imports resolve, strict typecheck and build pass, data IDs/finishes/prices remain intact. Check source status unchanged. Do not copy old main.ts, pages.ts, ui.ts, DOM helpers or *.ui.ts as UI.
- **Risks/dependencies:** ApiError syntax/config compatibility; data import closure; strict errors in protected code require a decision rather than prohibited edits. API route is not served until Stage 3.
- **Understand/explain:** types vs runtime values, import type, pure logic vs browser state, dependency paths, API cents vs UI dollars, and why React integration stays outside copied files.

### Stage 2 — React foundation and design

- **Create/change:** src/App.tsx, src/main.tsx, src/app/AppRoute.tsx, route.types.ts, navigation.ts, useRoute.ts; src/components/Button.tsx, FormField.tsx, StatusMessage.tsx; src/features/layout/SiteHeader.tsx, SiteFooter.tsx; src/features/home/HomePage.tsx, Hero.tsx, FeaturedProducts.tsx, RoomSlider.tsx; src/features/products/components/ProductCard.tsx, ProductGrid.tsx; src/pages/NotFoundPage.tsx; src/styles/tokens.css, main.css; index.html. Header cart count/dialog callbacks are connected in Stage 4, not falsely shown as working here.
- **Reuse unchanged:** original src/styles/tokens.css values and original src/styles/main.css as initial baseline, original src/data.ts/data and imagery URLs. Copy public/raha.svg and original public/images assets with no image transformation; validate the referenced asset closure. Styling adjustments belong only to target styles when React markup requires them.
- **Visible result:** RAHA shell and Home hero/six cards/slider layout replace the Vite demo; navigation, footer and responsive design match original. Forms/interactions are completed later.
- **Validation/acceptance:** runtime check for the root replaces the starter non-null assertion; strict types and stable keys; one h1 per active route; English metadata/favicon; keyboard routes/modified clicks/Back/Forward/title/focus/hash anchors; 360/768/1280 layout and contrast. Confirm original featured IDs: arc-sofa, gem-goblets, hammam-towels, flora-duvet, facet-glass-vase, cadence-lumbar. No arbitrary replacement products.
- **Starter cleanup plan:** remove obsolete imports/references from App.tsx/main.tsx/index.html as part of UI replacement. Candidate deletions after explicit cleanup approval: src/App.css, src/index.css, src/assets/hero.png, src/assets/react.svg, src/assets/vite.svg, public/icons.svg, public/favicon.svg, only after reference audit confirms each is unused. No deletion now; final Stage 6 verifies approved removals.
- **Risks/dependencies:** selector compatibility, markup headings and focus lifecycle; no injection of HTML-bearing slide titles. Build the shell incrementally without imports of future-stage files; integrate CartProvider/header cart controls in Stage 4 and forms/entrance in Stage 5. Do not show fake success for unfinished actions.
- **Understand/explain:** components vs DOM strings, own-file Props interfaces, reusable components, stable IDs, semantic JSX, shared tokens and why unused template content must leave the final submission.

### Stage 3 — API catalogue

- **Create/change:** tooling/products-api.ts, vite.config.ts; src/features/products/hooks/useProducts.ts; src/features/products/pages/ProductsPage.tsx; src/features/products/components/CatalogueControls.tsx; src/app/AppRoute.tsx, navigation.ts, useRoute.ts, route.types.ts; existing StatusMessage/ProductGrid/Card files only for required integration.
- **Reuse unchanged:** src/shared/api/api-client.ts; all protected products types/client/serializer/logic; source catalogue data. Preserve the React Vite plugin when adding middleware.
- **Visible result:** Products uses actual API data, immediate search, category/collection filtering, default/ascending/descending sorting, counts, clear/reset, URL persistence and all request states.
- **Development/server plan:** new tooling/products-api.ts adapts the original GET middleware and mounts at /api/products for both dev and preview. Match original port 5173/strict-port behavior, JSON envelope, no-store and 405 with Allow: GET. Restart Vite after config integration and verify JSON, not an HTML fallback. No server from the read-only original must be changed.
- **Deployment plan:** a real same-origin /api/products handler or backend/reverse proxy must use the original serializer/catalogue contract. A future host function can be designed once the hosting/runtime scope is approved; static dist alone cannot serve this API. Relative '/api/products' in the protected client must not be rewritten. No backend/deployment is performed now.
- **Validation/acceptance:** Network shows JSON and original cents; mapper produces dollars once. Exercise HTTP failure, offline, wrong content type, malformed payload/duplicate IDs, retry, slow request then navigation, success with empty items, successful results filtered to no-match and reset. Check q/category/collection/sort URL handling and sorted source immutability; only active request updates state. Types/build/lint remain passing.
- **Risks/dependencies:** middleware not packaged in dist; stale server/HTML fallback; duplicate StrictMode requests; unknown error messages narrowed without assertions; static source and API identity must agree.
- **Understand/explain:** loading/error/empty/no-match/success differences, unknown runtime validation vs compile-time types, price-unit mapping, derived results and effect cleanup.

### Stage 4 — Cart and product details

- **Create/change:** src/features/cart/CartProvider.tsx, CartDialog.tsx, CartLineItem.tsx, CartSummary.tsx, QuantityControl.tsx, cart-adapter.ts, cart.context.ts, useCart.ts; src/features/products/pages/ProductDetailsPage.tsx; src/features/products/components/ProductGallery.tsx, VariantSelector.tsx; src/features/notifications/NotificationRegion.tsx; src/App.tsx, src/app/AppRoute.tsx/navigation.ts/route.types.ts, src/features/layout/SiteHeader.tsx and ProductCard.tsx for integration.
- **Reuse unchanged:** src/state.ts, modules/state/session.ts, cart types/logic, product types, data and product-gallery.ts. No export/subscription/storage rewrite in protected code.
- **Visible result:** native modal cart opens from header across routes, with correct badge/variants/quantities/totals and all actions; reload retains cart. Details show selected finish/gallery/availability/specifications, and add produces original polite feedback.
- **Validation/acceptance:** same ID+finish increments, different finishes split; decrease-one removes, remove/clear reset totals/count; action focus remains useful after removal and clear; modal focus/close/Escape/continue return works. Restore before first snapshot with no empty startup save; test malformed/obsolete/unavailable/duplicate/invalid/overflow saved entries and denied storage. Check stable cached snapshots, no mutation, one storage owner and immediate shared React updates. Validate invalid product IDs, color deep links, out-of-stock disabling, gallery reset and original-finish links.
- **Risks/dependencies:** external store snapshots must stay stable between notifications. Original mutation functions return void, so announce success only after adapter confirms the intended valid change, not blindly after a rejected action. Direct calls bypassing adapter would leave stale React state; prohibit them.
- **Understand/explain:** cart identity, original store vs React snapshot, stable getSnapshot, typed upward callbacks, derived totals, persistence lifecycle, modal vs non-modal interaction.

### Stage 5 — Remaining interactions

- **Create/change:** src/features/forms/RegistrationSection.tsx, RegistrationForm.tsx, ContactForm.tsx; src/features/rooms/InspirationPage.tsx, RoomCard.tsx, RoomCalculator.tsx; src/features/about/AboutContactPage.tsx; src/features/interactions/EntranceOverlay.tsx, useEntrance.ts; src/features/home/RoomSlider.tsx; src/features/notifications/NotificationRegion.tsx; src/App.tsx, src/app/AppRoute.tsx and HomePage.tsx for integration. Create src/features/home/slide-title.ts only if needed to translate the original supported br/em title tokens into safe JSX data without changing original slide data.
- **Reuse unchanged:** original inspiration/hero-slide/page-imagery data, rooms.logic.ts, state/session.ts, source catalogue/gallery and photo assets. Slider slide IDs are living, burgundy and kitchen; inspiration scene IDs describe living room, bedroom and kitchen. Do not confuse the two data sets.
- **Visible result:** registration close/reset/reopen, contact demo success/reset, room scene/finish links, room-area calculation, manual slider announcements, cart status, and original entrance/skip/session/replay animations work.
- **Validation/acceptance:** native registration email/required/password minLength 8; contact required fields/message minLength 10; room dimensions 0.5–50m step 0.1 with finite validation; no data sent/stored. Match source link targets/finishes/images and calculator output. Verify entrance Skip/Escape/focus exit, once-per-session/replay, prefers-reduced-motion changes, navigation interruption and all listener/timer/frame cleanup. In StrictMode keep a session-claim ref outside effect cleanup so effect replay reuses the decision without claiming twice; cleanup must not strand the overlay or hide underlying content.
- **Risks/dependencies:** session side effects must occur outside rendering; development effect replay; existing title strings contain formatting markup; dialogs have distinct modal/non-modal behavior. Dormant room hotspots remain excluded.
- **Understand/explain:** local vs lifted form state, native validation, demo feedback vs backend actions, refs vs state, effect lifecycle and accessible motion.

### Stage 6 — Verification and submission

- **Create/change:** README.md, DESIGN.md, debug-lab-log.md, CLAUDE.md (actual observed mistake rules), AGENTS.md (current enduring guidance), tests/react-migration.spec.ts, playwright.config.ts; package.json/package-lock.json only for approved browser test dependencies/scripts. Update actual implementation files only to fix demonstrated failures, with per-step explanations and protected-file policy intact.
- **Reuse unchanged:** copied Day 3 modules and original test scenarios as behavior references. Do not claim the old tests were ported or passed without doing so; do not copy implementation-specific DOM assertions blindly.
- **Visible result:** complete responsive RAHA React UI, documented real architecture and learning evidence, working required tooling/skills, and final clean repository after authorized cleanup.
- **Validation/acceptance:** strict typecheck, format:check, build and lint with zero warnings; Console has no React warnings, key warnings, effect loops or errors. Browser coverage checks API status matrix, combined controls/URLs, details/variants, all cart actions/persistence/focus, forms/rooms, navigation, animations and 360/768/1280 layouts. Use React DevTools Components to inspect tree/Props/state ownership. Run both installed skills' reviews and document concrete fixes; do not claim use merely from directory presence. Verify Husky/lint-staged configuration and approved skill commit evidence.
- **Actual coursework:** obtain the five exact bug prompts, perform those exercises and record the real evidence in debug-lab-log.md. Ask the user to observe/confirm actual mistakes before adding at least three prevention rules to CLAUDE.md. Neither task is complete merely because documentation exists.
- **Final cleanup:** review references and list proposed unused templates/backups/screenshots/prompts/plans. Remove MIGRATION_PLAN.md before final submission and unused candidate starter files only after deletion approval. Do not retain this attachment or temporary AI copy manifests in submission. Verify required AGENTS.md, CLAUDE.md, README.md, DESIGN.md, debug-lab-log.md and both .claude/skills directories remain. Do not delete meaningful source assets just because they are absent from one page.
- **Git acceptance:** only after explicit authorization, commit intended implementation/course files (including skills); inspect status and ensure no unintended changes/artifacts remain. No remote changes, push, upload or deployment is implied. A clean final repository is pending; do not claim one now.
- **Risks/dependencies:** exact course debug prompts and personal observations still pending; final cleanup/commits need approved scope; hosting needs a genuine API server/runtime. No fabricated logs, scores or completed exercises.
- **Understand/explain:** trace every README node to a real file, explain props/state using DevTools, reproduce the five lab diagnoses, connect real mistakes to prevention rules, and explain the difference between local API middleware and deployment.

## 9. Course compliance audit and final submission checklist

| Requirement                                                | Actual status now                                               | Required evidence after approved implementation                                                                                       |
| ---------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| New React repository separate from Day 3                   | Missing; nested target is not a Git repository                  | Separate repository verified; starter tracking checked without assumptions                                                            |
| Vite React + strict TypeScript                             | Vite/React present; strict not explicit                         | strict enabled in app/node configs; no prohibited shortcuts                                                                           |
| Build and lint, zero warnings                              | Scripts exist; not run; lint does not enforce zero warnings yet | Real successful build/typecheck and lint with warning failures enabled                                                                |
| Prettier, Husky, lint-staged                               | No target setup/declarations found                              | Formatting checks and pre-commit staged-file wiring verified                                                                          |
| vercel-react-best-practices                                | Not installed under target .claude/skills                       | Installed, read/applied, review findings resolved and committed in authorized step                                                    |
| vercel-composition-patterns                                | Not installed under target .claude/skills                       | Installed, read/applied, review findings resolved and committed in authorized step                                                    |
| Six reusable own-file TSX components with Props interfaces | Contracts and reuse sites proposed in Section 4                 | Implemented interfaces, stable data keys and actual reuse verified                                                                    |
| Preserved Day 3 modules                                    | None copied yet                                                 | File comparisons show only necessary import type changes                                                                              |
| Products loaded through API                                | Original local route inspected; target route absent             | Actual JSON request/decoder/mapping and API hosting requirements verified                                                             |
| Combined search/filter/sort                                | Planned                                                         | Original q/category/collection/sort semantics and non-mutating results verified                                                       |
| Full persistent cart                                       | Planned; corrected to modal dialog                              | All actions, product+finish identity, focus, totals, reload/invalid storage verified                                                  |
| Loading/error/retry/empty/no-match/success                 | Explicit state matrix planned                                   | Every state exercised with honest evidence                                                                                            |
| Strict typing without shortcuts                            | New rules documented; starter root assertion remains            | No any, assertions, non-null assertions or suppression comments in new code; protected conflicts handled explicitly                   |
| No React Console warnings                                  | Not run                                                         | Browser Console inspection during routes/interactions shows none                                                                      |
| README tree, props/state                                   | Generic target README remains unchanged                         | Actual App-rooted tree with exact files/Props/state matches source                                                                    |
| React DevTools Components                                  | Verification pending                                            | Inspect actual components, Props, state and update ownership; record observations in README/log as appropriate, not final screenshots |
| debug-lab-log.md, five course bugs                         | Pending; exact five prompts missing                             | Complete the actual five exercises and record real reproduction/diagnosis/fix/retest/AI disclosure; no invented substitutions         |
| CLAUDE.md React rules and three real mistake rules         | React rules updated; personal learning pending                  | At least three prevention rules from mistakes actually observed by the user                                                           |
| English artifacts                                          | Planning docs in English                                        | English filenames/code/comments/docs/approved commit messages                                                                         |
| DESIGN.md                                                  | Original design reference inspected; target absent              | Document RAHA's preserved design, palette/typography/responsive/a11y rationale                                                        |
| Clean final repository                                     | Not yet a repository; no cleanup performed                      | Intended approved commits only; current docs; no unused templates/backups/screenshots/prompts/AI plans                                |
| Documentation lifecycle                                    | Plan marked temporary                                           | Keep AGENTS.md/CLAUDE.md; remove MIGRATION_PLAN.md before final submission after approved deletion                                    |

Submission checklist: AGENTS.md, CLAUDE.md with actual learning rules, README.md, DESIGN.md, debug-lab-log.md, both required skill packages under .claude/skills, working source/assets/config/tooling, approved repository history, and passing verification. Temporary plan and diagnostic artifacts are excluded from the final submission after authorized cleanup.

### Pending lab and personal learning

The attachment requires five course debug-lab bugs but does not enumerate them. Do not treat the earlier suggested investigation scenarios as course tasks; they are removed from this plan. Obtain the actual prompts before lab execution. Each completed entry should name the real course bug, reproduction, expected/actual result, diagnosis tool, root cause, exact fix location, retest and AI use. The original debugging-log.md has two earlier bugs and breakpoint practice; it is reference material, not completion of the new lab.

At least three mistake-based CLAUDE.md rules remain pending until the user actually observes mistakes. Do not seed fictional rules, relabel generic advice as personal experience, or claim the user completed a lab. These learning requirements can remain pending while independent approved implementation proceeds.

## 10. Planning review and stop boundary

Reviewed this revision against all numbered sections in the supplied detailed requirements: verified nested root and Git/copy audit; consistent React rules in both instruction files; full file/Props/state/callback/replacement registry; original API and protected modules; corrected cart/registration dialog behavior; source-confirmed active room features; Stage 0–6 file/result/check/risk/learning records; exact tool/skill names; final deliverables; and honest pending lab/personal learning status.

The original documentation-only boundary was superseded by Stage 0 approval and then Stage 1 approval. Stage 0 is committed as b8fccdf; Stage 1 copying, comparisons and checks are recorded above. No React UI implementation, original-project modification, staging, new commit, remote change, push, deletion, deployment or upload occurred in Stage 1.

Stop after Stage 1 and wait for the user's review before Stage 2. Any protected-file exception, Git/commit operation or deletion must have the applicable explicit authorization before it occurs. The unresolved exact lab prompts are a gate for the lab, not a reason to fabricate a result.
