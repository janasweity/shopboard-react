'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  categoryName,
  collectionName,
  getVariant,
  money,
} from '../../../data.ts'
import type { Product } from '../../../modules/products/products.types.ts'
import { replaceProductColor } from '../../../lib/routes.ts'
import { Button } from '../../../components/ui/button.tsx'
import { cn } from '../../../lib/utils.ts'
import { useCartContext } from '../../cart/cart-context.ts'
import {
  entranceDelay,
  useEntranceMotion,
} from '../../entrance/entrance-motion.ts'
import ProductGallery from './ProductGallery.tsx'
import VariantSelector from './VariantSelector.tsx'
import {
  eyebrowClass,
  textLinkClass,
} from '../../../components/shared-classes.ts'

interface Props {
  // Loaded by the products/[id] Server Component from the products API.
  readonly product: Product
}

const defaultCare = {
  bedroom:
    'Follow the sewn-in care label. Remove cushion inserts before cleaning covers, and avoid direct heat.',
  other:
    'Wipe gently with a soft, slightly damp cloth and dry promptly. Avoid abrasive cleaners.',
}

const crumbLinkClass = 'underline underline-offset-3'
// The muted copy under the title: the demo note, description and footnote.
const copyTextClass = 'text-sm leading-body text-muted'
const specRowClass = 'border-t border-line py-4'
const specValueClass = 'mt-1.5 text-muted'

export default function ProductDetails({ product }: Props) {
  const { add } = useCartContext()
  // The selected finish is derived from the URL, so refresh and links keep it.
  // Choosing a finish only replaces ?color=, with no new server request.
  const variant = getVariant(product, useSearchParams().get('color'))
  const titleMotion = useEntranceMotion('copy', entranceDelay.copy)
  const care =
    product.care ||
    (product.category === 'bedroom' ? defaultCare.bedroom : defaultCare.other)

  return (
    <>
      <nav
        className="flex flex-wrap gap-2.5 py-8 text-2xs leading-body text-muted"
        aria-label="Breadcrumb"
      >
        <Link href="/" className={crumbLinkClass}>
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/products" className={crumbLinkClass}>
          Products
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <section className="grid gap-8 md:grid-cols-product xl:gap-16">
        <ProductGallery product={product} variant={variant}>
          <VariantSelector
            variants={product.variants}
            selected={variant}
            onSelect={replaceProductColor}
          />
        </ProductGallery>
        <div className="min-w-0">
          <p className={eyebrowClass}>
            {categoryName(product.category).toUpperCase()} / RAHA
          </p>
          <h1
            className={cn(
              'mt-3.25 mb-4 text-detail-title',
              titleMotion.className,
            )}
            style={titleMotion.style}
          >
            {product.name}
          </h1>
          <Link
            className={cn(textLinkClass, 'mb-4')}
            href={'/products?collection=' + product.collection}
          >
            {collectionName(product.collection)}
          </Link>
          <div className="my-4" aria-live="polite">
            <p className="mb-1.25 text-xl leading-body">
              {money(variant.price)}
            </p>
            <p
              id="variant-availability"
              className="text-xs leading-body font-semibold"
            >
              {variant.availability}
            </p>
          </div>
          <p className={cn(copyTextClass, 'mb-4')}>
            Illustrative availability for this local demo.
          </p>
          <p className={copyTextClass}>{variant.description}</p>
          <Button
            className="my-6"
            aria-describedby="variant-availability"
            disabled={!variant.available}
            onClick={() => add(product.id, variant.id)}
          >
            Add {product.name} to cart <span aria-hidden="true">+</span>
          </Button>
          <dl className="mt-4 mb-6 text-xs leading-body">
            <div className={specRowClass}>
              <dt className="font-semibold">Dimensions</dt>
              <dd className={specValueClass}>{product.dimensions}</dd>
            </div>
            <div className={specRowClass}>
              <dt className="font-semibold">Materials</dt>
              <dd id="variant-materials" className={specValueClass}>
                {variant.materials}
              </dd>
            </div>
            <div className={specRowClass}>
              <dt className="font-semibold">Care</dt>
              <dd className={specValueClass}>{care}</dd>
            </div>
          </dl>
          <p className={cn(copyTextClass, 'mt-6')}>
            Illustrative product specifications. Local demo cart only; the demo
            checkout creates no order and takes no payment.
          </p>
          <Link href="/products" className={textLinkClass}>
            {'←'} Back to all products
          </Link>
        </div>
      </section>
    </>
  )
}
