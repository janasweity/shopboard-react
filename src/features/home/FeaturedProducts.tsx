import type { Product } from '../../modules/products/products.types.ts'
import { handleRouteClick } from '../../app/navigation.ts'
import ProductGrid from '../products/components/ProductGrid.tsx'
import type { AddHandler } from '../cart/cart-store.ts'

interface Props {
  readonly products: readonly Product[]
  onAdd: AddHandler
}
const featuredIds = new Set([
  'arc-sofa',
  'gem-goblets',
  'hammam-towels',
  'flora-duvet',
  'facet-glass-vase',
  'cadence-lumbar',
])

export default function FeaturedProducts({ products, onAdd }: Props) {
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
        <a
          href="/?page=products"
          className="text-link"
          onClick={handleRouteClick}
        >
          View all products <span aria-hidden="true">{'\u2197'}</span>
        </a>
      </div>
      <ProductGrid products={featured} onAdd={onAdd} />
      <p className="collection-footnote">
        Concept collection: product specifications and prices are illustrative.
      </p>
    </section>
  )
}
