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
      className="page-section border-t border-line"
      id="products"
      aria-labelledby="bestsellers-title"
    >
      <div className="mb-7.25 flex flex-wrap items-end justify-between gap-5.25">
        <div>
          <p className="eyebrow">FAVOURITES FROM OUR LIVING COLLECTIONS</p>
          <h2 id="bestsellers-title" className="mt-2.5">
            Soft forms. Grounded living.
          </h2>
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
