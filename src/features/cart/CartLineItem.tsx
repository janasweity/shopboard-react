import { money } from '../../data.ts'
import type { CartAction, CartLine } from '../../modules/cart/cart.types.ts'
import { Button } from '../../components/ui/button.tsx'
import QuantityControl from './QuantityControl.tsx'
import { quantityButtonClass } from './quantity-classes.ts'

interface Props {
  readonly line: CartLine
  onAction: (key: string, action: CartAction) => void
}

export default function CartLineItem({ line, onAction }: Props) {
  const { key, product, variant, quantity, total } = line
  return (
    <li
      className="flex gap-4 border-b border-line py-4"
      data-product-id={product.id}
      data-variant-id={variant.id}
    >
      <img
        src={variant.image}
        alt={variant.alt}
        className="h-20 w-18 flex-none rounded-field bg-panel object-contain"
      />
      <div className="min-w-0">
        <h3 className="text-lg leading-heading">{product.name}</h3>
        <p className="my-1.25 text-xs leading-body font-semibold">
          Color / finish: {variant.name}
        </p>
        <p className="text-xs leading-body">
          {money(variant.price)} each | {money(total)}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.25">
          <QuantityControl
            quantity={quantity}
            itemLabel={product.name}
            finishName={variant.name}
            cartKey={key}
            onDecrease={() => onAction(key, 'decrease')}
            onIncrease={() => onAction(key, 'increase')}
          />
          <Button
            variant="ghost"
            className={quantityButtonClass}
            data-key={key}
            data-action="remove"
            aria-label={`Remove ${product.name} | ${variant.name}`}
            onClick={() => onAction(key, 'remove')}
          >
            Remove
          </Button>
        </div>
      </div>
    </li>
  )
}
