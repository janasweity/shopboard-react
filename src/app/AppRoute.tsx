import type { Route } from './route.types.ts'
import { products } from '../data.ts'
import type { AddHandler } from '../features/cart/cart-store.ts'
import HomePage from '../features/home/HomePage.tsx'
import ProductsPage from '../features/products/pages/ProductsPage.tsx'
import ProductDetailsPage from '../features/products/pages/ProductDetailsPage.tsx'
import InspirationPage from '../features/rooms/InspirationPage.tsx'
import AboutPage from '../features/about/AboutPage.tsx'
import NotFoundPage from '../pages/NotFoundPage.tsx'

interface Props {
  readonly route: Route
  onAdd: AddHandler
}

export default function AppRoute({ route, onAdd }: Props) {
  switch (route.page) {
    case 'home':
      return <HomePage products={products} onAdd={onAdd} />
    case 'products':
      return <ProductsPage selection={route.selection} onAdd={onAdd} />
    case 'product': {
      const product = products.find((item) => item.id === route.productId)
      return product ? (
        <ProductDetailsPage
          product={product}
          colorId={route.colorId}
          onAdd={onAdd}
        />
      ) : (
        <NotFoundPage heading="We couldn't find that product." />
      )
    }
    case 'inspiration':
      return <InspirationPage />
    case 'about':
      return <AboutPage />
    case 'not-found':
      return <NotFoundPage />
  }
}
