import type { Product } from '../../../modules/products/products.types.ts'
import ProductCard from './ProductCard.tsx'

interface Props {
  readonly products: readonly Product[]
}

export default function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-1 gap-x-5.25 gap-y-9 md:grid-cols-2 md:gap-x-6 md:gap-y-10 xl:grid-cols-3 xl:gap-x-7 xl:gap-y-11">
      {products.map((product, position) => (
        // The key is the product ID; position only staggers the intro motion.
        <ProductCard key={product.id} product={product} position={position} />
      ))}
    </div>
  )
}
