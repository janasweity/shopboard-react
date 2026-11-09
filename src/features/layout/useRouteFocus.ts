import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// After a page change, moves keyboard focus to the main area, or to the hash
// target when the link has one. Next.js already handles scrolling. Changing
// only the search or the finish keeps the pathname, so typing and choosing a
// finish never lose focus.
export function useRouteFocus(): void {
  const pathname = usePathname()
  // The first render (and StrictMode's repeated mount effect) sees the same
  // pathname, so focus is not moved on the initial load.
  const previous = useRef(pathname)
  useEffect(() => {
    if (previous.current === pathname) return
    let id = location.hash.slice(1)
    try {
      id = decodeURIComponent(id)
    } catch {
      /* Invalid encoded hashes use their literal value. */
    }
    const focusTarget = (): boolean => {
      const target = id ? document.getElementById(id) : null
      if (!target) return false
      target.tabIndex = -1
      target.focus({ preventScroll: true })
      return true
    }
    // The page may still show loading.tsx when the pathname changes, so a hash
    // target is focused as soon as it appears (for up to 10 seconds).
    const observer = new MutationObserver(() => {
      if (focusTarget()) observer.disconnect()
    })
    const timer = window.setTimeout(() => observer.disconnect(), 10000)
    const frame = requestAnimationFrame(() => {
      // Updated only when focus moves, so a repeated effect run gives the
      // same result (CLAUDE.md rule 5).
      previous.current = pathname
      document.getElementById('main-content')?.focus({ preventScroll: true })
      if (id && !focusTarget()) {
        observer.observe(document.body, { childList: true, subtree: true })
      }
    })
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      observer.disconnect()
    }
  }, [pathname])
}
