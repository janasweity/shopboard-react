import { money } from '../../data.ts'
import { cn } from '../../lib/utils.ts'
import { cardVariants } from '../../components/ui/card-variants.ts'
import { useCartContext } from '../cart/cart-context.ts'

const summaryTextClass = 'text-sm leading-body text-muted'

export default function OrderSummary() {
  // Lines, count and subtotal come from CartContext; nothing is copied here.
  const { items, quantity, subtotal } = useCartContext()
  return (
    <section className={cardVariants()} aria-labelledby="order-summary-title">
      <h2 id="order-summary-title" className="mb-4">
        Order summary
      </h2>
      <p className={summaryTextClass}>
        {quantity} {quantity === 1 ? 'item' : 'items'} in your local cart
      </p>
      <ul className="my-4">
        {items.map((line) => (
          <li
            key={line.key}
            className="grid grid-cols-line gap-x-4 gap-y-0.75 border-b border-line py-3.25 text-sm leading-body"
          >
            <span>{line.product.name}</span>
            <span>{money(line.total)}</span>
            <span className="col-span-full text-xs leading-body text-muted">
              {line.variant.name} {'×'} {line.quantity}
            </span>
          </li>
        ))}
      </ul>
      <p className={cn(summaryTextClass, 'flex justify-between gap-4')}>
        <span>Subtotal</span>
        <strong>{money(subtotal)}</strong>
      </p>
      <p className="collection-footnote">
        Illustrative prices. This demo adds no delivery, fees or taxes and takes
        no payment.
      </p>
    </section>
  )
}
