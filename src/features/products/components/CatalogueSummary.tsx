import { use } from 'react'
import type { Product } from '../../../modules/products/products.types.ts'

interface Props {
  // The same list request as CatalogueResults, so no second request.
  readonly products: Promise<Product[]>
}

export default function CatalogueSummary({ products: request }: Props) {
  const products = use(request)
  return (
    <p id="catalogue-summary">
      {products.length} considered pieces. So many ways to make them yours.
    </p>
  )
}
