import { Suspense, useEffect, useState } from 'react'
import AppRoute from './app/AppRoute.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
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
  checkout: 'Demo checkout',
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

  // Opening another page after a page file failed clears the error. Focus
  // moves to the page area, as on a normal page change.
  function focusPage(): void {
    requestAnimationFrame(() =>
      document.getElementById('main-content')?.focus({ preventScroll: true }),
    )
  }

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
              {/* Only the page waits or fails; header, footer and cart stay
                  usable. A page file that cannot download shows this error,
                  and opening another page clears it. */}
              <ErrorBoundary
                resetKey={page}
                onRetry={focusPage}
                fallback={() => (
                  <section className="page-intro">
                    <p className="eyebrow">RAHA / PAGE</p>
                    <h1>This page could not be loaded.</h1>
                    {/* React.lazy keeps a failed import, so Try again reloads
                        the document to download the page file again. */}
                    <StatusMessage
                      kind="error"
                      message="Check your connection and try again. Try again reloads the page; your cart is kept. The menu and other pages still work."
                      onRetry={() => window.location.reload()}
                    />
                  </section>
                )}
              >
                <Suspense
                  fallback={
                    <StatusMessage kind="loading" message="Loading page..." />
                  }
                >
                  <AppRoute route={route} onReady={setPageReady} />
                </Suspense>
              </ErrorBoundary>
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
