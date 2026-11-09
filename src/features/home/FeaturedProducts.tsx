import type { Product } from '../../modules/products/products.types.ts'
import Link from 'next/link'
import ProductGrid from '../products/components/ProductGrid.tsx'

interface Props {
  readonly products: readonly Product[]
}
const featuredIds = new Set([
  'arc-sofa',
  'gem-goblets',
  'hammam-towels',
  'flora-duvet',
  'facet-glass-vase',
  'cadence-lumbar',
])

export default function FeaturedProducts({ products }: Props) {
  const featured = products.filter((product) => featuredIds.has(product.id))
  return (
    <section
      className="page-section featured-section"
      id="products"
      aria-labelledby="bestsellers-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">FAVOURITES FROM OUR LIVING COLLECTIONS</p>
          <h2 id="bestsellers-title">Soft forms. Grounded living.</h2>
        </div>
        <Link href="/products" className="text-link">
          View all products <span aria-hidden="true">{'\u2197'}</span>
        </Link>
      </div>
      <ProductGrid products={featured} />
      <p className="collection-footnote">
        Concept collection: product specifications and prices are illustrative.
      </p>
    </section>
  )
}
