import { useState } from 'react'
import type { ReactNode } from 'react'
import type {
  Product,
  ProductVariant,
} from '../../../modules/products/products.types.ts'
import { getProductGallery } from '../../../product-gallery.ts'
import Link from 'next/link'
import { productPath } from '../../../lib/routes.ts'
import { cardVariants } from '../../../components/ui/card-variants.ts'

interface Props {
  readonly product: Product
  readonly variant: ProductVariant
  // The finish selector sits between the main photo and the thumbnails.
  readonly children: ReactNode
}

const galleryNoteClass = 'mt-6 text-2xs leading-body text-muted'

export default function ProductGallery({ product, variant, children }: Props) {
  const views = getProductGallery(product, variant)
  // The chosen view is stored with the product and finish it belongs to. When
  // the finish or product changes, it is reset during render (no effect and no
  // remount), so the finish buttons in children keep keyboard focus.
  const finishKey = product.id + '::' + variant.id
  const [chosen, setChosen] = useState({ finishKey, viewId: 'product' })
  if (chosen.finishKey !== finishKey) {
    setChosen({ finishKey, viewId: 'product' })
  }
  const viewId = chosen.finishKey === finishKey ? chosen.viewId : 'product'
  const view = views.find((item) => item.id === viewId) || views[0]
  const original = product.variants[0]
  const hasAdditionalViews = getProductGallery(product, original).length > 1

  return (
    <div className="min-w-0">
      <figure className={cardVariants({ padding: 'sm' })}>
        <img
          id="gallery-image"
          src={view.image}
          alt={view.alt}
          width={1400}
          height={1000}
          fetchPriority="high"
          className="aspect-13/10 w-full object-contain"
        />
        <figcaption id="gallery-caption" className="mt-4 text-hint text-muted">
          {view.caption}
        </figcaption>
      </figure>
      {children}
      <div id="gallery-options">
        <div
          className="mt-4 flex gap-2.75"
          role="group"
          aria-label="Product image gallery"
        >
          {views.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === view.id}
              className="w-27.5 rounded-control border border-line p-1.5 text-2xs leading-body text-ink aria-pressed:border-2 aria-pressed:border-primary"
              aria-label={`Show ${product.name} ${item.id === 'product' ? 'product photo' : item.label.toLowerCase()}`}
              onClick={() => setChosen({ finishKey, viewId: item.id })}
            >
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="aspect-3/2 w-full rounded-thumb object-cover"
              />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        {hasAdditionalViews && variant.id !== original.id ? (
          <p className={galleryNoteClass}>
            Additional photographs are available in {original.name}.{' '}
            <Link
              className="text-link"
              href={productPath(product.id, original.id)}
            >
              View those photographs
            </Link>
          </p>
        ) : (
          <p className={galleryNoteClass}>
            {hasAdditionalViews
              ? 'Additional views show this product in the photographed finish.'
              : 'Only the product photograph is available for this finish.'}
          </p>
        )}
      </div>
    </div>
  )
}
