import { Suspense, useEffect, useState } from 'react'
import AppRoute from './app/AppRoute.tsx'
import StatusMessage from './components/StatusMessage.tsx'
import { useRoute } from './app/useRoute.ts'
import { products } from './data.ts'
import SiteHeader from './features/layout/SiteHeader.tsx'
import SiteFooter from './features/layout/SiteFooter.tsx'
import CartDialog from './features/cart/CartDialog.tsx'
import CartProvider from './features/cart/CartProvider.tsx'
import CartStatus from './features/cart/CartStatus.tsx'
import EntranceOverlay from './features/entrance/EntranceOverlay.tsx'
import { useEntrance } from './features/entrance/useEntrance.ts'
import { EntranceContext } from './features/entrance/entrance-motion.ts'

const titles = {
  home: 'Make room for living',
  products: 'Products',
  product: 'Product details',
  inspiration: 'Room Inspiration',
  about: 'About & Contact',
  'not-found': 'Page not found',
}

export default function App() {
  const route = useRoute()
  const page = route.page
  const productId = route.page === 'product' ? route.productId : null
  // True once the first lazily loaded page is on screen.
  const [pageReady, setPageReady] = useState(false)
  const entrance = useEntrance(page, pageReady)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    const product = products.find((item) => item.id === productId)
    document.title = (product ? product.name : titles[page]) + ' | RAHA'
  }, [page, productId])

  return (
    <EntranceContext value={entrance.startedAt}>
      <CartProvider page={page}>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <div className="page-content" id="top">
          <SiteHeader route={route} onOpenCart={() => setCartOpen(true)} />
          <main id="main-content" tabIndex={-1}>
            <div id="page-view">
              {/* Only the page waits; header, footer and cart stay usable. */}
              <Suspense
                fallback={
                  <StatusMessage kind="loading" message="Loading page..." />
                }
              >
                <AppRoute route={route} onReady={setPageReady} />
              </Suspense>
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
