import { money } from '../../data.ts'
import { useCartContext } from '../cart/cart-context.ts'

export default function OrderSummary() {
  // Lines, count and subtotal come from CartContext; nothing is copied here.
  const { items, quantity, subtotal } = useCartContext()
  return (
    <section className="checkout-summary" aria-labelledby="order-summary-title">
      <h2 id="order-summary-title">Order summary</h2>
      <p>
        {quantity} {quantity === 1 ? 'item' : 'items'} in your local cart
      </p>
      <ul>
        {items.map((line) => (
          <li key={line.key}>
            <span className="checkout-line-name">{line.product.name}</span>
            <span className="checkout-line-total">{money(line.total)}</span>
            <span className="checkout-line-detail">
              {line.variant.name} {'×'} {line.quantity}
            </span>
          </li>
        ))}
      </ul>
      <p className="checkout-subtotal">
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
