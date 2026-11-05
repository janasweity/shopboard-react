import type { Product } from '../../../modules/products/products.types.ts'
import ProductCard from './ProductCard.tsx'

interface Props {
  readonly products: readonly Product[]
}

export default function ProductGrid({ products }: Props) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
