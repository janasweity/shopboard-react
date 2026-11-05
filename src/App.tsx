import { useEffect, useState } from 'react'
import AppRoute from './app/AppRoute.tsx'
import { useRoute } from './app/useRoute.ts'
import { products } from './data.ts'
import SiteHeader from './features/layout/SiteHeader.tsx'
import SiteFooter from './features/layout/SiteFooter.tsx'
import CartDialog from './features/cart/CartDialog.tsx'
import { addToCart, getCartSnapshot } from './features/cart/cart-store.ts'
import { useCart } from './features/cart/useCart.ts'
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
  const { quantity } = useCart()
  const entrance = useEntrance(page)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartStatus, setCartStatus] = useState({ page, message: '' })
  // Feedback belongs to the page where it was given; it clears on navigation.
  const statusMessage = cartStatus.page === page ? cartStatus.message : ''

  useEffect(() => {
    const product = products.find((item) => item.id === productId)
    document.title = (product ? product.name : titles[page]) + ' | RAHA'
  }, [page, productId])

  function handleAdd(productId: string, variantId: string): void {
    const product = products.find((item) => item.id === productId)
    const variant = product?.variants.find((option) => option.id === variantId)
    if (!product || !variant?.available) return
    addToCart(productId, variantId)
    const total = getCartSnapshot().reduce(
      (sum, item) => sum + item.quantity,
      0,
    )
    setCartStatus({
      page,
      message: `${product.name} | ${variant.name} added to your local cart. ${total} items in total.`,
    })
  }

  return (
    <EntranceContext value={entrance.startedAt}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="page-content" id="top">
        <SiteHeader
          route={route}
          cartCount={quantity}
          onOpenCart={() => setCartOpen(true)}
        />
        <main id="main-content" tabIndex={-1}>
          <div id="page-view">
            <AppRoute route={route} onAdd={handleAdd} />
          </div>
          <p className="cart-status" role="status" aria-live="polite">
            {statusMessage}
          </p>
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
    </EntranceContext>
  )
}
