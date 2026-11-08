import { lazy, useEffect } from 'react'
import type { Route } from './route.types.ts'
import { products } from '../data.ts'
import { useRouteFocus } from './useRouteFocus.ts'

// Each page is a separate chunk that is downloaded the first time it opens.
const HomePage = lazy(() => import('../features/home/HomePage.tsx'))
const ProductsPage = lazy(
  () => import('../features/products/pages/ProductsPage.tsx'),
)
const ProductDetailsPage = lazy(
  () => import('../features/products/pages/ProductDetailsPage.tsx'),
)
const InspirationPage = lazy(
  () => import('../features/rooms/InspirationPage.tsx'),
)
const AboutPage = lazy(() => import('../features/about/AboutPage.tsx'))
const CheckoutPage = lazy(() => import('../features/checkout/CheckoutPage.tsx'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.tsx'))

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
