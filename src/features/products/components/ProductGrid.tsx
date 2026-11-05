import type { Product } from '../../../modules/products/products.types.ts'
import type { AddHandler } from '../../cart/cart-store.ts'
import ProductCard from './ProductCard.tsx'

interface Props {
  readonly products: readonly Product[]
  onAdd: AddHandler
}

export default function ProductGrid({ products, onAdd }: Props) {
  return (
    <div className="product-grid">
      {products.map((product, position) => (
        // The key is the product ID; position only staggers the intro motion.
        <ProductCard
          key={product.id}
          product={product}
          position={position}
          onAdd={onAdd}
        />
      ))}
    </div>
  )
}
