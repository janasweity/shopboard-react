import { useEffect } from 'react'
import type { Route } from './route.types.ts'
import { products } from '../data.ts'
import {
  AboutPage,
  CheckoutPage,
  HomePage,
  InspirationPage,
  NotFoundPage,
  ProductDetailsPage,
  ProductsPage,
} from './lazy-pages.ts'
import { useRouteFocus } from './useRouteFocus.ts'

interface Props {
  readonly route: Route
  // Called once the first page is on screen, so the intro can start.
  onReady: (ready: boolean) => void
}

export default function AppRoute({ route, onReady }: Props) {
  useRouteFocus()
  // This component is inside the page Suspense boundary, so its effects run
  // only after the first lazily loaded page has been shown.
  useEffect(() => onReady(true), [onReady])

  switch (route.page) {
    case 'home':
      return <HomePage products={products} />
    case 'products':
      return <ProductsPage selection={route.selection} />
    case 'product':
      // The page loads this one product from GET /api/products/:id.
      return route.productId ? (
        <ProductDetailsPage
          productId={route.productId}
          colorId={route.colorId}
        />
      ) : (
        <NotFoundPage heading="We couldn't find that product." />
      )
    case 'inspiration':
      return <InspirationPage />
    case 'about':
      return <AboutPage />
    case 'checkout':
      return <CheckoutPage />
    case 'not-found':
      return <NotFoundPage />
  }
}
