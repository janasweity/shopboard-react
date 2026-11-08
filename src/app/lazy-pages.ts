import { lazy } from 'react'

// Each page is a separate chunk that is downloaded the first time it opens.
// The lazy components stay fixed at module level. React.lazy keeps a failed
// import and throws the same error again, so the page Error Boundary in App
// recovers by reloading the document, which downloads the file again.
export const HomePage = lazy(() => import('../features/home/HomePage.tsx'))
export const ProductsPage = lazy(
  () => import('../features/products/pages/ProductsPage.tsx'),
)
export const ProductDetailsPage = lazy(
  () => import('../features/products/pages/ProductDetailsPage.tsx'),
)
export const InspirationPage = lazy(
  () => import('../features/rooms/InspirationPage.tsx'),
)
export const AboutPage = lazy(() => import('../features/about/AboutPage.tsx'))
export const CheckoutPage = lazy(
  () => import('../features/checkout/CheckoutPage.tsx'),
)
export const NotFoundPage = lazy(() => import('../pages/NotFoundPage.tsx'))
