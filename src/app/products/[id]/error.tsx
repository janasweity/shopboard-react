'use client'

import StatusMessage from '../../../components/StatusMessage.tsx'
import {
  pageIntroClass,
  pageIntroTitleClass,
} from '../../../components/page-intro-classes.ts'
import { eyebrowClass } from '../../../components/shared-classes.ts'

interface Props {
  readonly error: unknown
  // Fetches the product from the API again and renders it (Next.js 16.3+).
  readonly retry: () => void
}

// A server or network error. An unknown product is not an error: the page
// calls notFound(), which renders not-found.tsx without Try again.
export default function ProductError({ retry }: Props) {
  function tryAgain(): void {
    retry()
    // The Try again button disappears, so focus moves to the page area.
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }

  return (
    <section className={pageIntroClass}>
      <p className={eyebrowClass}>RAHA / PRODUCT DETAILS</p>
      <h1 className={pageIntroTitleClass}>We could not load this product.</h1>
      <StatusMessage
        kind="error"
        message="The product details did not load. Please try again."
        onRetry={tryAgain}
      />
    </section>
  )
}
