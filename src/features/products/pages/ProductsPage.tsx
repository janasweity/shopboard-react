'use client'

import { Suspense, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { replaceProductSelection } from '../../../lib/routes.ts'
import type { Product } from '../../../modules/products/products.types.ts'
import ErrorBoundary from '../../../components/ErrorBoundary.tsx'
import StatusMessage from '../../../components/StatusMessage.tsx'
import CatalogueControls from '../components/CatalogueControls.tsx'
import CatalogueResults from '../components/CatalogueResults.tsx'
import CatalogueSummary from '../components/CatalogueSummary.tsx'
import { useProductSelection } from '../useProductSelection.ts'
import {
  entranceDelay,
  useEntranceMotion,
} from '../../entrance/entrance-motion.ts'

interface Props {
  // Started by the products Server Component and not awaited, so the page
  // streams and only the results wait.
  readonly products: Promise<Product[]>
  // New for every server render; a retry that brings new data clears errors.
  readonly requestId: string
  // The URL search the server rendered, for example '?q=lamp'.
  readonly initialSearch: string
}

const summaryFallback = (
  <p id="catalogue-summary">Explore our considered collection.</p>
)

export default function ProductsPage({
  products,
  requestId,
  initialSearch,
}: Props) {
  const titleMotion = useEntranceMotion('copy', entranceDelay.copy)
  // Search, filter and sort live in the URL and are changed with
  // history.replaceState, so they never start a server request.
  const selection = useProductSelection(initialSearch)
  const router = useRouter()
  const [retrying, startRetry] = useTransition()
  // Try again removes its own button, so focus moves to the results region.
  const resultsRegion = useRef<HTMLDivElement>(null)

  function reset(): void {
    replaceProductSelection({ query: '', category: 'all', sort: 'default' })
    document.getElementById('product-search')?.focus()
  }

  function tryAgain(): void {
    // The server renders the page again with a new request and requestId.
    startRetry(() => router.refresh())
    resultsRegion.current?.focus()
  }

  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">FIVE ROOMS / ONE CONSIDERED HOME</p>
        <h1 className={titleMotion.className} style={titleMotion.style}>
          Find your everyday favourites.
        </h1>
        <ErrorBoundary resetKey={requestId} fallback={() => summaryFallback}>
          <Suspense fallback={summaryFallback}>
            <CatalogueSummary products={products} />
          </Suspense>
        </ErrorBoundary>
      </section>
      <section aria-label="Product catalogue">
        {/* The controls stay outside the boundaries, so they keep working and
            keep focus while results load or fail. */}
        <CatalogueControls
          selection={selection}
          onChange={replaceProductSelection}
          onReset={reset}
        />
        <div id="catalogue-results" ref={resultsRegion} tabIndex={-1}>
          <ErrorBoundary
            resetKey={requestId}
            fallback={() => (
              <>
                <div id="catalogue-status">
                  {retrying ? (
                    <StatusMessage
                      kind="loading"
                      message="Loading products..."
                    />
                  ) : (
                    <StatusMessage
                      kind="error"
                      message="We could not load the catalogue. Please try again."
                      onRetry={tryAgain}
                    />
                  )}
                </div>
                <div id="catalog-grid" />
              </>
            )}
          >
            <Suspense
              fallback={
                <>
                  <div id="catalogue-status">
                    <StatusMessage
                      kind="loading"
                      message="Loading products..."
                    />
                  </div>
                  <div id="catalog-grid" aria-busy={true} />
                </>
              }
            >
              <CatalogueResults
                products={products}
                selection={selection}
                onReset={reset}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
        <p className="collection-footnote">
          A concept furniture store. Product photos illustrate the collection;
          names, specifications and prices are concept content.
        </p>
      </section>
    </>
  )
}
