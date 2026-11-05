# RAHA React

RAHA's Stage 2 React foundation and Home preview. The original shopboard project remains read-only. Stages 0 and 1 are saved in b8fccdf and e50b287; Stage 2 changes are left uncommitted for review.

## Project root

Run commands from C:/Users/morjm/OneDrive/Desktop/shopboard-react/shopboard-react, where package.json lives. This directory has its own local Git repository, independent of parent directories and Day 3. Stages 0 and 1 are saved in b8fccdf and e50b287. No remote is configured; Stage 2 changes are left unstaged/uncommitted for review.

Use Node.js 22.22.1 or newer (also required by the installed lint-staged version) and npm. Stage 0 was verified with Node 26.13.0 and npm 11.20.0. On PowerShell use npm.cmd if execution policy blocks npm.ps1.

## Commands

```sh
npm ci
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
npm run format:check
npm run format
```

Build includes TypeScript and Vite. Typecheck checks both app and Vite configuration without emitting application JavaScript. Lint rejects warnings as well as errors, including prohibited TypeScript shortcuts. Format checks formatting; format applies it. Formatting and lint skip third-party skill packages to preserve their upstream content.

## Pre-commit checks

The prepare script installs Husky's repository-local hooks during npm install/npm ci. .husky/pre-commit runs npm run lint-staged: staged JavaScript/TypeScript files are formatted then linted with zero warnings; staged JSON/CSS/HTML/Markdown/YAML files are formatted. No test runner or tests have been added in Stage 0.

No files were staged and no commit was made to demonstrate the hook. The hook was invoked directly and reached lint-staged successfully; with no staged files it had no file tasks to run. Its no-initial-commit backup warning is expected. Full staged-file execution will occur when an initial commit is explicitly approved.

## Project-local skills

Both required skills are installed as real copied files, including their rules and supporting documents:

- .claude/skills/vercel-react-best-practices/
- .claude/skills/vercel-composition-patterns/

Source: [Vercel agent-skills](https://github.com/vercel-labs/agent-skills). skills-lock.json records source paths, content hashes and copy mode. All 90 skill files are tracked in Stage 0 commit b8fccdf. Installation alone does not claim the skills' migration reviews were completed.

## Migration documentation

AGENTS.md contains Codex instructions; CLAUDE.md contains course rules. MIGRATION_PLAN.md is temporary planning documentation with the proposed component tree, props/state ownership and Stage 0 record. It must be removed before final submission after approved cleanup. The current implemented tree is below; keep it current in later stages. DESIGN.md, React DevTools verification, debug-lab-log.md and personal learning rules remain pending.

## Stage 0 verification

Build, lint (zero warnings), typecheck and format:check passed. Both skills contain 90 physical files in total, none ignored by Git and none symlinks. Stage 0 is saved in commit b8fccdf; no remote was configured.

## Stage 1 module reuse

Copied 23 TypeScript files with original paths: shared API client; product/API types, serializer, decoder/client and selection logic; cart types/validation/totals; cart persistence; room-area and session helpers; catalogue data dependencies and pure gallery selection. MIGRATION_PLAN.md lists every exact path and responsibility. All copies are byte-identical to the original; no import type changes were needed.

The copied ApiError uses a constructor parameter property. After reporting TS1294, the planned target configuration adjustment disabled erasableSyntaxOnly in tsconfig.app.json while keeping strict enabled. This preserves the protected client without rewriting it. Typecheck, lint, formatting and build pass.

Stage 1 was saved in e50b287. API fetching/middleware remain unimplemented. The Stage 2 comparison after the pre-commit hook confirms all 23 copies are still byte-identical; no import type corrections or other differences were found.

## Stage 2 preview

Run npm run dev -- --host 127.0.0.1 --port 5173 --strictPort, then open http://127.0.0.1:5173/. You should see RAHA's original warm neutral styling, shared header/footer, living-room hero, six featured product cards, a manual three-scene room slider and the registration section presentation. Cart controls are disabled; registration has no inputs yet. Products, details, inspiration and about routes retain their URLs and explicitly show that their content is not available in this preview. API loading is Stage 3; cart/details are Stage 4 and forms/other interactions Stage 5.

Original style tokens and photography were copied unchanged. main.css includes a small marked React-specific addition. The existing Vite starter assets/CSS are unreferenced and retained until approved cleanup. No packages were installed for Stage 2.

## Implemented component tree

```text
App
|-- SiteHeader
|-- main / AppRoute
|   |-- HomePage (Home route)
|   |   |-- Hero
|   |   |-- FeaturedProducts
|   |   |   '-- ProductGrid -> ProductCard -> Button
|   |   |-- RoomSlider -> Button, StatusMessage
|   |   '-- Registration section (native presentation markup)
|   |-- StatusMessage (known deferred routes)
|   '-- NotFoundPage -> StatusMessage (unknown route/product)
'-- SiteFooter
```

FormField is implemented as a reusable primitive for the later forms; it is not mounted as a pretend form in this stage. CartProvider and all other later-stage components are absent, not hidden implementations.

| File under src/                              | Props interface / responsibility                             | State ownership                                           |
| -------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| App.tsx                                      | No external props; shell and document title                  | useRoute owns URL subscription, no duplicated page state  |
| app/AppRoute.tsx                             | route: Route; selects Home/deferred/not-found view           | Derived from route                                        |
| features/layout/SiteHeader.tsx               | route: Route; navigation and unavailable cart affordance     | Active link derived from route                            |
| features/layout/SiteFooter.tsx               | year: number; service and anchor links                       | None                                                      |
| features/home/HomePage.tsx                   | products: readonly Product[]; Home composition               | None                                                      |
| features/home/Hero.tsx                       | image: string, alt: string; original hero                    | None                                                      |
| features/home/FeaturedProducts.tsx           | products: readonly Product[]; filters original six IDs       | Derived, no mirrored array                                |
| features/home/RoomSlider.tsx                 | slides: readonly source slide type[]; manual controls/scene  | Local activeId; image/copy/announcement derived           |
| features/products/components/ProductGrid.tsx | products: readonly Product[]; stable product.id keys         | None                                                      |
| features/products/components/ProductCard.tsx | product: Product; article/image/name/price/finish count      | None; no fake cart callback                               |
| components/Button.tsx                        | Native ButtonHTMLAttributes plus tone; default type=button   | None; caller owns callbacks                               |
| components/FormField.tsx                     | id, label, hint?, error?, children; label/help/error wrapper | None; caller supplies matching control id/description IDs |
| components/StatusMessage.tsx                 | kind, message, className?, onRetry?, onReset?; live feedback | None; caller owns actions                                 |
| pages/NotFoundPage.tsx                       | heading?: string; honest missing-content recovery            | None                                                      |

Navigation lives in app/navigation.ts; app/route.types.ts defines the route union; app/useRoute.ts owns history listeners and focus cleanup. Real anchor onClick callbacks respect modifiers/external links; native same-page anchors remain native. New React components do not initialize old DOM UI or import the mutable cart store.

## Stage 2 checks

Protected-copy audit: 23/23 match original bytes after e50b287 and remain unchanged by Stage 2. Browser checks passed at 360, 768 and 1280px, including eight loaded images, six featured IDs, one h1, zero horizontal overflow, and zero automated axe WCAG A/AA violations. Manual browser automation verified navigation, keyboard focus and all slider states; Console and HTTP checks found no errors/warnings. This is not a claim of complete accessibility, React DevTools review, Lighthouse score or course-lab completion.

Used the installed Vercel React/composition skills for derived state, stable event subscriptions/IDs and children composition; no Next.js-specific features were introduced. Screenshots and test execution used existing local browser tools without adding test packages or files to the original.

Final Stage 2 command checks passed: npm run typecheck, npm run lint (zero warnings), npm run format:check, npm run build and git diff --check. Final preservation audit: 23 protected files unchanged, 459 copied public files matching original bytes and tokens.css unchanged. No files are staged or committed for Stage 2.
