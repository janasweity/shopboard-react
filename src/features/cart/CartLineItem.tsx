import { money } from '../../data.ts'
import type { CartAction, CartLine } from '../../modules/cart/cart.types.ts'
import QuantityControl from './QuantityControl.tsx'

interface Props {
  readonly line: CartLine
  onAction: (key: string, action: CartAction) => void
}

export default function CartLineItem({ line, onAction }: Props) {
  const { key, product, variant, quantity, total } = line
  return (
    <li
      className="cart-item"
      data-product-id={product.id}
      data-variant-id={variant.id}
    >
      <img src={variant.image} alt={variant.alt} />
      <div>
        <h3>{product.name}</h3>
        <p className="cart-color">Color / finish: {variant.name}</p>
        <p>
          {money(variant.price)} each | {money(total)}
        </p>
        <div className="quantity-controls">
          <QuantityControl
            quantity={quantity}
            itemLabel={product.name}
            finishName={variant.name}
            cartKey={key}
            onDecrease={() => onAction(key, 'decrease')}
            onIncrease={() => onAction(key, 'increase')}
          />
          <button
            type="button"
            className="remove-item"
            data-key={key}
            data-action="remove"
            aria-label={`Remove ${product.name} | ${variant.name}`}
            onClick={() => onAction(key, 'remove')}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}
