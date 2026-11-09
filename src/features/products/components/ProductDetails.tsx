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
import Button from '../../../components/Button.tsx'
import { useCartContext } from '../../cart/cart-context.ts'
import {
  entranceDelay,
  useEntranceMotion,
} from '../../entrance/entrance-motion.ts'
import ProductGallery from './ProductGallery.tsx'
import VariantSelector from './VariantSelector.tsx'

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
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/products">Products</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <section className="product-layout">
        <ProductGallery product={product} variant={variant}>
          <VariantSelector
            variants={product.variants}
            selected={variant}
            onSelect={replaceProductColor}
          />
        </ProductGallery>
        <div className="detail-copy">
          <p className="eyebrow">
            {categoryName(product.category).toUpperCase()} / RAHA
          </p>
          <h1 className={titleMotion.className} style={titleMotion.style}>
            {product.name}
          </h1>
          <Link
            className="text-link detail-collection"
            href={'/products?collection=' + product.collection}
          >
            {collectionName(product.collection)}
          </Link>
          <div className="variant-summary" aria-live="polite">
            <p className="detail-price">{money(variant.price)}</p>
            <p id="variant-availability">{variant.availability}</p>
          </div>
          <p className="variant-demo-note">
            Illustrative availability for this local demo.
          </p>
          <p className="detail-description">{variant.description}</p>
          <Button
            className="detail-add"
            aria-describedby="variant-availability"
            disabled={!variant.available}
            onClick={() => add(product.id, variant.id)}
          >
            Add {product.name} to cart <span aria-hidden="true">+</span>
          </Button>
          <dl className="specifications">
            <div>
              <dt>Dimensions</dt>
              <dd>{product.dimensions}</dd>
            </div>
            <div>
              <dt>Materials</dt>
              <dd id="variant-materials">{variant.materials}</dd>
            </div>
            <div>
              <dt>Care</dt>
              <dd>{care}</dd>
            </div>
          </dl>
          <p className="collection-footnote">
            Illustrative product specifications. Local demo cart only; the demo
            checkout creates no order and takes no payment.
          </p>
          <Link href="/products" className="text-link">
            {'←'} Back to all products
          </Link>
        </div>
      </section>
    </>
  )
}
