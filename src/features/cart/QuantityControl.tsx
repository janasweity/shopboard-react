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
      <button
        type="button"
        data-key={cartKey}
        data-action="decrease"
        aria-label={`Decrease ${itemLabel} quantity | ${finishName}`}
        onClick={onDecrease}
      >
        -
      </button>
      <span aria-label={`Quantity: ${quantity} | ${finishName}`}>
        {quantity}
      </span>
      <button
        type="button"
        data-key={cartKey}
        data-action="increase"
        aria-label={`Increase ${itemLabel} quantity | ${finishName}`}
        onClick={onIncrease}
      >
        +
      </button>
    </>
  )
}
