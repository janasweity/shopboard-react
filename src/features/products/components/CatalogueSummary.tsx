import { use } from 'react'
import { readCatalogue } from '../api/products-resource.ts'

export default function CatalogueSummary() {
  // Reads the same cached request as CatalogueResults, so no second request.
  const products = use(readCatalogue())
  return (
    <p id="catalogue-summary">
      {products.length} considered pieces. So many ways to make them yours.
    </p>
  )
}
