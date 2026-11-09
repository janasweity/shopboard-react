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
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <div className="page-content" id="top">
          <SiteHeader onOpenCart={() => setCartOpen(true)} />
          <main id="main-content" tabIndex={-1}>
            <div id="page-view">{children}</div>
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
