import { Suspense, useRef, useState } from 'react'
import { replaceProductSelection } from '../../../app/navigation.ts'
import type { ProductSelection } from '../../../modules/products/products.types.ts'
import ErrorBoundary from '../../../components/ErrorBoundary.tsx'
import StatusMessage from '../../../components/StatusMessage.tsx'
import { retryCatalogue } from '../api/products-resource.ts'
import CatalogueControls from '../components/CatalogueControls.tsx'
import CatalogueResults from '../components/CatalogueResults.tsx'
import CatalogueSummary from '../components/CatalogueSummary.tsx'
import {
  entranceDelay,
  useEntranceMotion,
} from '../../entrance/entrance-motion.ts'

interface Props {
  readonly selection: ProductSelection
}

const summaryFallback = (
  <p id="catalogue-summary">Explore our considered collection.</p>
)

export default function ProductsPage({ selection }: Props) {
  const titleMotion = useEntranceMotion('copy', entranceDelay.copy)
  // Each Try again remounts both boundaries below, so the summary and the
  // results read the new request together.
  const [attempt, setAttempt] = useState(0)
  // Try again removes its own button, so focus moves to the results region.
  const resultsRegion = useRef<HTMLDivElement>(null)

  function reset(): void {
    replaceProductSelection({ query: '', category: 'all', sort: 'default' })
    document.getElementById('product-search')?.focus()
  }

  function tryAgain(): void {
    retryCatalogue()
    setAttempt((value) => value + 1)
    resultsRegion.current?.focus()
  }

  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">FIVE ROOMS / ONE CONSIDERED HOME</p>
        <h1 className={titleMotion.className} style={titleMotion.style}>
          Find your everyday favourites.
        </h1>
        <ErrorBoundary key={attempt} fallback={() => summaryFallback}>
          <Suspense fallback={summaryFallback}>
            <CatalogueSummary />
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
            key={attempt}
            fallback={() => (
              <>
                <div id="catalogue-status">
                  <StatusMessage
                    kind="error"
                    message="We could not load the catalogue. Please try again."
                    onRetry={tryAgain}
                  />
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
              <CatalogueResults selection={selection} onReset={reset} />
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
