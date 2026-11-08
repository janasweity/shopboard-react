import { useEffect, useRef, useSyncExternalStore } from 'react'
import { canonicalizeUrl, readRoute } from './navigation.ts'
import { getLocationSnapshot, subscribeLocation } from './useRoute.ts'

// Moves focus and scroll after a route change. It is called inside the page
// Suspense boundary, so it runs only after a lazily loaded page is on screen
// and hash targets such as #returns exist.
export function useRouteFocus(): void {
  const href = useSyncExternalStore(subscribeLocation, getLocationSnapshot)
  const previousHref = useRef(href)
  useEffect(() => {
    const url = canonicalizeUrl(href)
    const previous = new URL(previousHref.current)
    const previousRoute = readRoute(previousHref.current)
    const nextRoute = readRoute(href)
    const changed = previousHref.current !== href
    // Updating catalogue controls or a product finish must not steal focus or
    // scroll the page.
    const sameView =
      (previousRoute.page === 'products' && nextRoute.page === 'products') ||
      (previousRoute.page === 'product' &&
        nextRoute.page === 'product' &&
        previousRoute.productId === nextRoute.productId)
    if (changed && sameView && previous.hash === url.hash) {
      previousHref.current = href
      return
    }
    const frame = requestAnimationFrame(() => {
      // Updated only when the focus move runs. StrictMode re-runs effects when
      // Suspense reveals a page, and the cleanup cancels the first frame.
      previousHref.current = href
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
}
