'use client'

import StatusMessage from '../components/StatusMessage.tsx'

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
    <section className="page-intro">
      <p className="eyebrow">RAHA / PAGE</p>
      <h1>This page could not be loaded.</h1>
      <StatusMessage
        kind="error"
        message="Check your connection and try again. The menu, cart and other pages still work."
        onRetry={tryAgain}
      />
    </section>
  )
}
