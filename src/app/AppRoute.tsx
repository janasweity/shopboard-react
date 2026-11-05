import type { Route } from './route.types.ts'
import { products } from '../data.ts'
import { handleRouteClick } from './navigation.ts'
import HomePage from '../features/home/HomePage.tsx'
import StatusMessage from '../components/StatusMessage.tsx'
import NotFoundPage from '../pages/NotFoundPage.tsx'

interface Props {
  readonly route: Route
}

export default function AppRoute({ route }: Props) {
  if (route.page === 'home') return <HomePage products={products} />
  if (
    route.page === 'not-found' ||
    (route.page === 'product' &&
      !products.some((product) => product.id === route.productId))
  )
    return <NotFoundPage />
  const heading =
    route.page === 'products'
      ? 'Find your everyday favourites.'
      : route.page === 'product'
        ? 'A closer look, coming soon.'
        : route.page === 'inspiration'
          ? 'Room Inspiration'
          : 'Thoughtful design. Everyday possibilities.'
  return (
    <section className="page-intro">
      <p className="eyebrow">RAHA / HOME &amp; LIVING</p>
      <h1>{heading}</h1>
      <StatusMessage
        kind="empty"
        message="There is more to come. This preview currently includes our Home collection and room slider."
      />
      <a href="/" className="text-link" onClick={handleRouteClick}>
        Explore Home {'\u2197'}
      </a>
    </section>
  )
}
