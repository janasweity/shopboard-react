import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { claimEntranceSession } from '../../state.ts'

const durationMs = 3750

function readReplay(): boolean {
  const url = new URL(window.location.href)
  if (url.searchParams.get('intro') !== 'replay') return false
  url.searchParams.delete('intro')
  history.replaceState(null, '', url)
  return true
}

// React removes the intro from the DOM before effect cleanup runs, so whether
// focus was inside it is recorded at the moment it is dismissed.
function stopIntro(
  overlay: RefObject<HTMLElement | null>,
  restoreFocus: RefObject<boolean>,
  setStartedAt: (value: null) => void,
): void {
  restoreFocus.current =
    overlay.current?.contains(document.activeElement) === true
  setStartedAt(null)
}

// The intro starts only when the first page is ready. Pages are loaded lazily,
// and arrival motion applies only to content mounted before the intro starts.
export function useEntrance(page: string, pageReady: boolean) {
  const [startedAt, setStartedAt] = useState<number | null>(null)
  // StrictMode replays effects; the ref keeps one session decision.
  const claimed = useRef<boolean | null>(null)
  const overlayRef = useRef<HTMLElement>(null)
  const skipRef = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef(false)
  const shownPage = useRef(page)
  const playing = startedAt !== null

  useEffect(() => {
    if (!pageReady) return
    if (claimed.current === null) {
      claimed.current = claimEntranceSession(readReplay())
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!claimed.current || reducedMotion.matches) return
    setStartedAt(performance.now())
    const stop = () => stopIntro(overlayRef, restoreFocus, setStartedAt)
    const timer = window.setTimeout(stop, durationMs)
    const onMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) stop()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') stop()
    }
    reducedMotion.addEventListener('change', onMotionChange)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      reducedMotion.removeEventListener('change', onMotionChange)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [pageReady])

  // Navigating to another page ends the intro, as in the original.
  useEffect(() => {
    if (page === shownPage.current) return
    shownPage.current = page
    stopIntro(overlayRef, restoreFocus, setStartedAt)
  }, [page])

  useEffect(() => {
    if (!playing) return
    document.documentElement.dataset.entrance = 'playing'
    skipRef.current?.focus({ preventScroll: true })
    // Moving focus anywhere outside the intro ends it.
    const onFocusIn = (event: FocusEvent) => {
      const element = overlayRef.current
      if (
        element &&
        event.target instanceof Node &&
        !element.contains(event.target)
      )
        setStartedAt(null)
    }
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      delete document.documentElement.dataset.entrance
      if (restoreFocus.current) {
        restoreFocus.current = false
        document.getElementById('main-content')?.focus({ preventScroll: true })
      }
    }
  }, [playing])

  function skip(): void {
    restoreFocus.current = true
    setStartedAt(null)
  }

  return { startedAt, overlayRef, skipRef, skip }
}
