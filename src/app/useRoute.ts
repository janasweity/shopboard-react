import { useEffect, useSyncExternalStore } from 'react'
import { canonicalizeUrl, navigationEvent, readRoute } from './navigation.ts'

export function subscribeLocation(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange)
  window.addEventListener('hashchange', onChange)
  window.addEventListener(navigationEvent, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener('hashchange', onChange)
    window.removeEventListener(navigationEvent, onChange)
  }
}

export const getLocationSnapshot = () => window.location.href

export function useRoute() {
  const href = useSyncExternalStore(subscribeLocation, getLocationSnapshot)
  useEffect(() => {
    const url = canonicalizeUrl(href)
    if (url.href !== location.href) history.replaceState(null, '', url)
  }, [href])
  return readRoute(href)
}
