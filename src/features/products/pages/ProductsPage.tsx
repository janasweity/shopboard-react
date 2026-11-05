import { useRef } from 'react'
import { replaceProductSelection } from '../../../app/navigation.ts'
import { selectProducts } from '../../../modules/products/products.logic.ts'
import type { ProductSelection } from '../../../modules/products/products.types.ts'
import StatusMessage from '../../../components/StatusMessage.tsx'
import CatalogueControls from '../components/CatalogueControls.tsx'
import ProductGrid from '../components/ProductGrid.tsx'
import { useProducts } from '../hooks/useProducts.ts'
import type { AddHandler } from '../../cart/cart-store.ts'
import {
  entranceDelay,
  useEntranceMotion,
} from '../../entrance/entrance-motion.ts'

interface Props {
  readonly selection: ProductSelection
  onAdd: AddHandler
}

export default function ProductsPage({ selection, onAdd }: Props) {
  const { state, retry } = useProducts()
  const titleMotion = useEntranceMotion('copy', entranceDelay.copy)
  const statusRegion = useRef<HTMLDivElement>(null)
  const visible =
    state.status === 'success' ? selectProducts(state.products, selection) : []

  function reset(): void {
    replaceProductSelection({ query: '', category: 'all', sort: 'default' })
    document.getElementById('product-search')?.focus()
  }

  function tryAgain(): void {
    retry()
    statusRegion.current?.focus()
  }

  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">FIVE ROOMS / ONE CONSIDERED HOME</p>
        <h1 className={titleMotion.className} style={titleMotion.style}>
          Find your everyday favourites.
        </h1>
        <p id="catalogue-summary">
          {state.status === 'success'
            ? state.products.length +
              ' considered pieces. So many ways to make them yours.'
            : 'Explore our considered collection.'}
        </p>
      </section>
      <section aria-label="Product catalogue">
        <CatalogueControls
          selection={selection}
          onChange={replaceProductSelection}
          onReset={reset}
        />
        <div id="catalogue-status" ref={statusRegion} tabIndex={-1}>
          {state.status === 'loading' ? (
            <StatusMessage kind="loading" message="Loading products..." />
          ) : state.status === 'error' ? (
            <StatusMessage
              kind="error"
              message="We could not load the catalogue. Please try again."
              onRetry={tryAgain}
            />
          ) : state.products.length === 0 ? (
            <StatusMessage
              kind="empty"
              message="The catalogue is empty. Please check back soon."
            />
          ) : visible.length === 0 ? (
            <StatusMessage
              kind="no-match"
              message="No products match these selections. Try a shorter product name, choose All categories, or reset the filters."
              onReset={reset}
            />
          ) : (
            <StatusMessage
              kind="success"
              message={
                visible.length + ' of ' + state.products.length + ' products'
              }
            />
          )}
        </div>
        <div id="catalog-grid" aria-busy={state.status === 'loading'}>
          {state.status === 'success' ? (
            <ProductGrid products={visible} onAdd={onAdd} />
          ) : null}
        </div>
        <p className="collection-footnote">
          A concept furniture store. Product photos illustrate the collection;
          names, specifications and prices are concept content.
        </p>
      </section>
    </>
  )
}
