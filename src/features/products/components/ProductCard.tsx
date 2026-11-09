'use client'

import type { Product } from '../../../modules/products/products.types.ts'
import {
  categoryName,
  collectionName,
  getVariant,
  money,
} from '../../../data.ts'
import Link from 'next/link'
import { productPath } from '../../../lib/routes.ts'
import Button from '../../../components/Button.tsx'
import { useCartContext } from '../../cart/cart-context.ts'
import {
  entranceDelay,
  joinClasses,
  useEntranceMotion,
} from '../../entrance/entrance-motion.ts'

interface Props {
  readonly product: Product
  readonly position: number
}

export default function ProductCard({ product, position }: Props) {
  const { add } = useCartContext()
  const href = productPath(product.id)
  const variant = getVariant(product)
  const motion = useEntranceMotion('card', entranceDelay.card(position))
  return (
    <article
      className={joinClasses('product-card', motion.className)}
      style={motion.style}
      data-id={product.id}
      data-category={product.category}
      data-collection={product.collection}
    >
      <Link
        className="product-image"
        href={href}
        aria-label={'View ' + product.name}
      >
        {product.tag ? (
          <span className="product-tag">{product.tag}</span>
        ) : null}
        <img
          src={product.image}
          alt={product.alt}
          width={1400}
          height={1000}
          loading="lazy"
          decoding="async"
        />
      </Link>
      <div className="product-info">
        <p className="product-type">
          {collectionName(product.collection)} /{' '}
          {categoryName(product.category)}
        </p>
        <h3>
          <Link href={href}>{product.name}</Link>
        </h3>
        <p className="product-detail">{product.description.split('. ')[0]}.</p>
        <p className="product-price">{money(product.price)}</p>
        <p className="color-option-count">
          {product.variants.length}{' '}
          {product.variants.length === 1
            ? 'color / finish'
            : 'colors & finishes'}
        </p>
        <Button
          className="add-to-cart"
          disabled={!variant.available}
          aria-label={'Add ' + product.name + ' to cart'}
          onClick={() => add(product.id, variant.id)}
        >
          Add to cart <span aria-hidden="true">+</span>
        </Button>
      </div>
    </article>
  )
}
