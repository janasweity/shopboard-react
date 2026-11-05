import type { CSSProperties } from 'react'
import type { ProductVariant } from '../../../modules/products/products.types.ts'

interface Props {
  readonly variants: readonly ProductVariant[]
  readonly selected: ProductVariant
  onSelect: (variantId: string) => void
}

function swatchStyle(
  hex: string,
): CSSProperties & { '--swatch-color': string } {
  return { '--swatch-color': hex }
}

export default function VariantSelector({
  variants,
  selected,
  onSelect,
}: Props) {
  return (
    <fieldset className="color-options">
      <legend>Color / finish</legend>
      <p id="selected-color" aria-live="polite">
        Selected: <strong>{selected.name}</strong>
      </p>
      <div className="color-swatches">
        {variants.map((variant) => {
          const isSelected = variant.id === selected.id
          return (
            <button
              key={variant.id}
              type="button"
              className="color-swatch"
              aria-pressed={isSelected}
              onClick={() => onSelect(variant.id)}
            >
              <span
                className="swatch-dot"
                style={swatchStyle(variant.hex)}
                aria-hidden="true"
              />
              <span>{variant.name}</span>
              <span
                className="swatch-check"
                aria-hidden="true"
                hidden={!isSelected}
              >
                Selected
              </span>
              {variant.available ? null : (
                <span className="swatch-stock">Out of stock</span>
              )}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
