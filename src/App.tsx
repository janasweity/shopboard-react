import { useEffect } from 'react'
import AppRoute from './app/AppRoute.tsx'
import { useRoute } from './app/useRoute.ts'
import SiteHeader from './features/layout/SiteHeader.tsx'
import SiteFooter from './features/layout/SiteFooter.tsx'

export default function App() {
  const route = useRoute()
  const page = route.page
  useEffect(() => {
    const title =
      page === 'home'
        ? 'Make room for living'
        : page === 'products'
          ? 'Products'
          : page === 'product'
            ? 'Product details'
            : page === 'inspiration'
              ? 'Room Inspiration'
              : page === 'about'
                ? 'About & Contact'
                : 'Page not found'
    document.title = title + ' | RAHA'
  }, [page])
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="page-content" id="top">
        <SiteHeader route={route} />
        <main id="main-content" tabIndex={-1}>
          <div id="page-view">
            <AppRoute route={route} />
          </div>
        </main>
        <SiteFooter year={2026} />
      </div>
    </>
  )
}
