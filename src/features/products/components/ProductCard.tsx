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
import { cn } from '../../../lib/utils.ts'
import { Badge } from '../../../components/ui/badge.tsx'
import { Button } from '../../../components/ui/button.tsx'
import { useCartContext } from '../../cart/cart-context.ts'
import {
  entranceDelay,
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
      className={cn('group flex min-w-0 flex-col', motion.className)}
      style={motion.style}
      data-id={product.id}
      data-category={product.category}
      data-collection={product.collection}
    >
      <Link
        className="relative block aspect-13/10 overflow-hidden rounded-card bg-panel xl:aspect-29/20"
        href={href}
        aria-label={'View ' + product.name}
      >
        {product.tag ? (
          <Badge className="absolute top-2.75 left-2.75 z-1">
            {product.tag}
          </Badge>
        ) : null}
        <img
          src={product.image}
          alt={product.alt}
          width={1400}
          height={1000}
          loading="lazy"
          decoding="async"
          className="size-full object-contain p-2.75 transition-transform duration-400 group-hover:scale-card-hover"
        />
      </Link>
      <div className="flex flex-1 flex-col px-0.5 pt-4">
        <p className="min-h-7.5 text-label tracking-label text-muted">
          {collectionName(product.collection)} /{' '}
          {categoryName(product.category)}
        </p>
        <h3 className="mt-1.5 mb-2 min-h-12 text-card-title">
          <Link
            href={href}
            className="hover:underline hover:underline-offset-4"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mb-3.25 text-xs leading-body text-muted">
          {product.description.split('. ')[0]}.
        </p>
        <p className="mt-auto text-sm leading-body">{money(product.price)}</p>
        <p className="mt-1.25 text-2xs leading-body text-muted">
          {product.variants.length}{' '}
          {product.variants.length === 1
            ? 'color / finish'
            : 'colors & finishes'}
        </p>
        <Button
          size="sm"
          className="mt-2.75 self-start disabled:opacity-65"
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
