import type { InspirationRoom } from '../../modules/products/products.types.ts'
import { money, products } from '../../data.ts'
import { productPath } from '../../lib/routes.ts'
import Link from 'next/link'

interface Props {
  readonly room: InspirationRoom
  readonly position: number
}

export default function RoomSection({ room, position }: Props) {
  const items = room.items.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.id)
    const variant = product?.variants.find((option) => option.id === item.color)
    if (!product || !variant) return []
    const href = productPath(product.id, variant.id)
    return [{ product, variant, href }]
  })

  return (
    <section
      className="inspiration-room"
      id={room.id}
      aria-labelledby={room.id + '-title'}
    >
      <div className="room-story">
        <figure>
          <img
            src={room.image}
            alt={room.alt}
            width={1400}
            height={1000}
            loading={position === 1 ? undefined : 'lazy'}
            decoding="async"
          />
          <figcaption>RAHA / {room.name.toUpperCase()} INSPIRATION</figcaption>
        </figure>
        <div>
          <p className="eyebrow">
            0{position} / {room.name.toUpperCase()}
          </p>
          <h2 id={room.id + '-title'}>{room.title}</h2>
          <p>{room.description}</p>
          <p className="inspiration-note">
            Explore the featured pieces below in their photographed finishes.
            Room setting shown for styling inspiration.
          </p>
        </div>
      </div>
      <h3 className="inspiration-products-title">Bring the look home.</h3>
      <div
        className="inspiration-products"
        aria-label={'Products in this ' + room.name.toLowerCase()}
      >
        {items.map(({ product, variant, href }) => (
          <article
            key={product.id + '::' + variant.id}
            className="inspiration-product"
            data-inspiration-product={product.id}
          >
            <Link
              href={href}
              aria-label={`View ${product.name} in ${variant.name}`}
            >
              <img
                src={variant.image}
                alt={variant.alt}
                width={1400}
                height={1000}
                loading="lazy"
                decoding="async"
              />
            </Link>
            <div>
              <h3>
                <Link href={href}>{product.name}</Link>
              </h3>
              <p>{variant.name}</p>
              <p className="inspiration-price">{money(variant.price)}</p>
              <Link href={href} className="text-link">
                View product {'↗'}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
