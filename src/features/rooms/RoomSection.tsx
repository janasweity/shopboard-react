import type { InspirationRoom } from '../../modules/products/products.types.ts'
import { money, products } from '../../data.ts'
import { productPath } from '../../lib/routes.ts'
import Link from 'next/link'
import { cn } from '../../lib/utils.ts'
import { eyebrowClass, textLinkClass } from '../../components/shared-classes.ts'

interface Props {
  readonly room: InspirationRoom
  readonly position: number
}

const productTextClass = 'mb-2 text-xs leading-body'

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
      className="mt-8 mb-16 border-b border-line pb-8"
      id={room.id}
      aria-labelledby={room.id + '-title'}
    >
      <div className="mb-8 grid items-center gap-6 md:grid-cols-story md:gap-10">
        {/* From 768px the photo alternates: left for the first and third
            rooms, right for the second. */}
        <figure className={cn(position % 2 === 0 && 'md:order-2')}>
          <img
            src={room.image}
            alt={room.alt}
            width={1400}
            height={1000}
            loading={position === 1 ? undefined : 'lazy'}
            decoding="async"
            className="aspect-3/2 w-full rounded-feature object-contain"
          />
          <figcaption className="mt-2.75 text-figcaption tracking-widest text-muted">
            RAHA / {room.name.toUpperCase()} INSPIRATION
          </figcaption>
        </figure>
        <div>
          <p className={eyebrowClass}>
            0{position} / {room.name.toUpperCase()}
          </p>
          <h2 id={room.id + '-title'} className="my-4">
            {room.title}
          </h2>
          <p className="mb-5.25 text-muted">{room.description}</p>
          <p className="mb-5.25 text-muted">
            Explore the featured pieces below in their photographed finishes.
            Room setting shown for styling inspiration.
          </p>
        </div>
      </div>
      <h3 className="mb-4 font-heading text-2xl leading-tight">
        Bring the look home.
      </h3>
      <div
        className="grid gap-6 md:grid-cols-3"
        aria-label={'Products in this ' + room.name.toLowerCase()}
      >
        {items.map(({ product, variant, href }) => (
          <article
            key={product.id + '::' + variant.id}
            className="min-w-0"
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
                className="aspect-3/2 w-full rounded-panel bg-panel object-contain"
              />
            </Link>
            <div>
              <h3 className="mt-3.25 mb-1.5 text-base leading-heading">
                <Link href={href}>{product.name}</Link>
              </h3>
              <p className={cn(productTextClass, 'text-muted')}>
                {variant.name}
              </p>
              <p className={cn(productTextClass, 'text-ink')}>
                {money(variant.price)}
              </p>
              <Link href={href} className={textLinkClass}>
                View product {'↗'}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
