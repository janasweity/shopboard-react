import { useState } from 'react'
import type { ReactNode } from 'react'
import type {
  Product,
  ProductVariant,
} from '../../../modules/products/products.types.ts'
import { getProductGallery } from '../../../product-gallery.ts'
import { productURL } from '../../../data.ts'
import { handleRouteClick } from '../../../app/navigation.ts'

interface Props {
  readonly product: Product
  readonly variant: ProductVariant
  // The finish selector sits between the main photo and the thumbnails.
  readonly children: ReactNode
}

// The parent remounts this component per finish (key=variant.id), so the
// selected view resets to the product photograph without an effect.
export default function ProductGallery({ product, variant, children }: Props) {
  const views = getProductGallery(product, variant)
  const [viewId, setViewId] = useState('product')
  const view = views.find((item) => item.id === viewId) || views[0]
  const original = product.variants[0]
  const hasAdditionalViews = getProductGallery(product, original).length > 1

  return (
    <div className="product-gallery">
      <figure>
        <img
          id="gallery-image"
          src={view.image}
          alt={view.alt}
          width={1400}
          height={1000}
          fetchPriority="high"
        />
        <figcaption id="gallery-caption">{view.caption}</figcaption>
      </figure>
      {children}
      <div id="gallery-options">
        <div
          className="gallery-thumbnails"
          role="group"
          aria-label="Product image gallery"
        >
          {views.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === view.id}
              aria-label={`Show ${product.name} ${item.id === 'product' ? 'product photo' : item.label.toLowerCase()}`}
              onClick={() => setViewId(item.id)}
            >
              <img src={item.image} alt="" loading="lazy" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        {hasAdditionalViews && variant.id !== original.id ? (
          <p className="gallery-note">
            Additional photographs are available in {original.name}.{' '}
            <a
              className="text-link"
              href={
                productURL(product.id) +
                '&color=' +
                encodeURIComponent(original.id)
              }
              onClick={handleRouteClick}
            >
              View those photographs
            </a>
          </p>
        ) : (
          <p className="gallery-note">
            {hasAdditionalViews
              ? 'Additional views show this product in the photographed finish.'
              : 'Only the product photograph is available for this finish.'}
          </p>
        )}
      </div>
    </div>
  )
}
