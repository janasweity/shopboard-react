'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import CartDialog from '../cart/CartDialog.tsx'
import CartProvider from '../cart/CartProvider.tsx'
import CartStatus from '../cart/CartStatus.tsx'
import EntranceOverlay from '../entrance/EntranceOverlay.tsx'
import { EntranceContext } from '../entrance/entrance-motion.ts'
import { useEntrance } from '../entrance/useEntrance.ts'
import SiteFooter from './SiteFooter.tsx'
import SiteHeader from './SiteHeader.tsx'
import { useRouteFocus } from './useRouteFocus.ts'

interface Props {
  // The current page, rendered by the App Router.
  readonly children: ReactNode
}

// The shared layout around every page. The header, footer, cart and intro are
// client components; the pages inside can be Server Components.
export default function AppShell({ children }: Props) {
  const pathname = usePathname()
  const entrance = useEntrance(pathname)
  const [cartOpen, setCartOpen] = useState(false)
  useRouteFocus()

  return (
    <EntranceContext value={entrance.startedAt}>
      <CartProvider page={pathname}>
        {/* Above the viewport (twice its own height) until it has focus. */}
        <a
          className="fixed top-4 left-4 z-200 -translate-y-2/1 bg-bg px-4 py-3.25 text-ink focus:translate-y-0"
          href="#main-content"
        >
          Skip to main content
        </a>
        <div className="mx-auto w-full max-w-400" id="top">
          <SiteHeader onOpenCart={() => setCartOpen(true)} />
          {/* Focused by the skip link and after a route change, without a
              ring: the focus moves to the page, not to a control. */}
          <main
            id="main-content"
            tabIndex={-1}
            className="px-gutter focus:outline-none"
          >
            <div id="page-view" className="*:min-w-0">
              {children}
            </div>
            <CartStatus />
          </main>
          <SiteFooter year={2026} />
        </div>
        <CartDialog open={cartOpen} onClose={() => setCartOpen(false)} />
        {entrance.startedAt === null ? null : (
          <EntranceOverlay
            overlayRef={entrance.overlayRef}
            skipRef={entrance.skipRef}
            onSkip={entrance.skip}
          />
        )}
      </CartProvider>
    </EntranceContext>
  )
}
