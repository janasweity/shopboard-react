import { useEffect, useRef, useSyncExternalStore } from 'react'
import { canonicalizeUrl, navigationEvent, readRoute } from './navigation.ts'

function subscribe(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange)
  window.addEventListener('hashchange', onChange)
  window.addEventListener(navigationEvent, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener('hashchange', onChange)
    window.removeEventListener(navigationEvent, onChange)
  }
}

const getSnapshot = () => window.location.href

export function useRoute() {
  const href = useSyncExternalStore(subscribe, getSnapshot)
  const previousHref = useRef(href)
  useEffect(() => {
    const url = canonicalizeUrl(href)
    if (url.href !== location.href) history.replaceState(null, '', url)
    const previous = new URL(previousHref.current)
    const previousRoute = readRoute(previousHref.current)
    const nextRoute = readRoute(href)
    const changed = previousHref.current !== href
    previousHref.current = href
    // Updating catalogue controls or a product finish must not steal focus or
    // scroll the page.
    const sameView =
      (previousRoute.page === 'products' && nextRoute.page === 'products') ||
      (previousRoute.page === 'product' &&
        nextRoute.page === 'product' &&
        previousRoute.productId === nextRoute.productId)
    if (changed && sameView && previous.hash === url.hash) return
    const frame = requestAnimationFrame(() => {
      let anchorId = url.hash.slice(1)
      try {
        anchorId = decodeURIComponent(anchorId)
      } catch {
        /* Invalid encoded hashes use their literal value. */
      }
      const anchor = anchorId ? document.getElementById(anchorId) : null
      if (anchor) {
        anchor.tabIndex = -1
        anchor.focus({ preventScroll: true })
        anchor.scrollIntoView()
      } else if (changed) {
        document.getElementById('main-content')?.focus({ preventScroll: true })
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [href])
  return readRoute(href)
}
