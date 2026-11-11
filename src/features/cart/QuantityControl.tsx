import { Button } from '../../components/ui/button.tsx'
import { quantityBoxClass, quantityButtonClass } from './quantity-classes.ts'

interface Props {
  readonly quantity: number
  readonly itemLabel: string
  readonly finishName: string
  readonly cartKey: string
  onDecrease: () => void
  onIncrease: () => void
}

export default function QuantityControl({
  quantity,
  itemLabel,
  finishName,
  cartKey,
  onDecrease,
  onIncrease,
}: Props) {
  return (
    <>
      <Button
        variant="ghost"
        className={quantityButtonClass}
        data-key={cartKey}
        data-action="decrease"
        aria-label={`Decrease ${itemLabel} quantity | ${finishName}`}
        onClick={onDecrease}
      >
        -
      </Button>
      <span
        className={quantityBoxClass}
        aria-label={`Quantity: ${quantity} | ${finishName}`}
      >
        {quantity}
      </span>
      <Button
        variant="ghost"
        className={quantityButtonClass}
        data-key={cartKey}
        data-action="increase"
        aria-label={`Increase ${itemLabel} quantity | ${finishName}`}
        onClick={onIncrease}
      >
        +
      </Button>
    </>
  )
}
