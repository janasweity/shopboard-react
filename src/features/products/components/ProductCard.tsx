import type { Product } from '../../../modules/products/products.types.ts'
import {
  categoryName,
  collectionName,
  money,
  productURL,
} from '../../../data.ts'
import { handleRouteClick } from '../../../app/navigation.ts'
import Button from '../../../components/Button.tsx'

interface Props {
  readonly product: Product
}

export default function ProductCard({ product }: Props) {
  const href = productURL(product.id)
  return (
    <article
      className="product-card"
      data-id={product.id}
      data-category={product.category}
      data-collection={product.collection}
    >
      <a
        className="product-image"
        href={href}
        onClick={handleRouteClick}
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
      </a>
      <div className="product-info">
        <p className="product-type">
          {collectionName(product.collection)} /{' '}
          {categoryName(product.category)}
        </p>
        <h3>
          <a href={href} onClick={handleRouteClick}>
            {product.name}
          </a>
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
          disabled
          title="The cart is not available in this preview."
        >
          Add to cart <span aria-hidden="true">+</span>
        </Button>
      </div>
    </article>
  )
}
