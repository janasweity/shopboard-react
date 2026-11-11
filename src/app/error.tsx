'use client'

import StatusMessage from '../components/StatusMessage.tsx'
import {
  pageIntroClass,
  pageIntroTitleClass,
} from '../components/page-intro-classes.ts'

interface Props {
  readonly error: unknown
  // Fetches and renders the page again (Next.js 16.3+).
  readonly retry: () => void
}

// Only the page area fails; the header, footer and cart in the root layout
// keep working.
export default function PageError({ retry }: Props) {
  function tryAgain(): void {
    retry()
    // The Try again button disappears, so focus moves to the page area.
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }

  return (
    <section className={pageIntroClass}>
      <p className="eyebrow">RAHA / PAGE</p>
      <h1 className={pageIntroTitleClass}>This page could not be loaded.</h1>
      <StatusMessage
        kind="error"
        message="Check your connection and try again. The menu, cart and other pages still work."
        onRetry={tryAgain}
      />
    </section>
  )
}
