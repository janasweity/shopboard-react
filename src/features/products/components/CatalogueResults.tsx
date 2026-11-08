import { use } from 'react'
import { selectProducts } from '../../../modules/products/products.logic.ts'
import type { ProductSelection } from '../../../modules/products/products.types.ts'
import StatusMessage from '../../../components/StatusMessage.tsx'
import { EntranceContext } from '../../entrance/entrance-motion.ts'
import { readCatalogue } from '../api/products-resource.ts'
import ProductGrid from './ProductGrid.tsx'

interface Props {
  readonly selection: ProductSelection
  onReset: () => void
}

export default function CatalogueResults({ selection, onReset }: Props) {
  // Suspends until the list loads. Errors go to the Error Boundary in
  // ProductsPage. Search, filter and sort only change the URL selection, so
  // they re-render with the cached list and never start a new request.
  const products = use(readCatalogue())
  const visible = selectProducts(products, selection)

  return (
    <>
      <div id="catalogue-status">
        {products.length === 0 ? (
          <StatusMessage
            kind="empty"
            message="The catalogue is empty. Please check back soon."
          />
        ) : visible.length === 0 ? (
          <StatusMessage
            kind="no-match"
            message="No products match these selections. Try a shorter product name, choose All categories, or reset the filters."
            onReset={onReset}
          />
        ) : (
          <StatusMessage
            kind="success"
            message={visible.length + ' of ' + products.length + ' products'}
          />
        )}
      </div>
      <div id="catalog-grid" aria-busy={false}>
        {/* Cards come from the API, so they appear without the intro arrival
            motion, as in the original. Without this, a fast response could
            mount them before the intro starts and animate them. */}
        <EntranceContext value={null}>
          <ProductGrid products={visible} />
        </EntranceContext>
      </div>
    </>
  )
}
