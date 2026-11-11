import type { CSSProperties } from 'react'
import type { ProductVariant } from '../../../modules/products/products.types.ts'
import { Badge } from '../../../components/ui/badge.tsx'

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

// Toggle swatches (aria-pressed). A pressed swatch has a 2px border, so its
// padding is 1px smaller and the swatch keeps its size. The buttons keep
// their keys, so keyboard focus stays on the chosen swatch.
const swatchClass =
  'flex min-h-12 flex-wrap items-center gap-2 rounded-control border border-stone-grey bg-soft-white px-3 py-2.5 text-xs leading-body text-charcoal-brown hover:bg-warm-ivory aria-pressed:border-2 aria-pressed:border-charcoal-brown aria-pressed:bg-silver-mist aria-pressed:px-2.75 aria-pressed:py-2.25'

export default function VariantSelector({
  variants,
  selected,
  onSelect,
}: Props) {
  return (
    <fieldset className="mt-4 min-w-0 py-5">
      <legend className="text-sm leading-body font-semibold text-charcoal-brown">
        Color / finish
      </legend>
      <p
        id="selected-color"
        className="mb-3.25 text-xs leading-body"
        aria-live="polite"
      >
        Selected: <strong>{selected.name}</strong>
      </p>
      <div className="flex flex-wrap gap-2.5">
        {variants.map((variant) => {
          const isSelected = variant.id === selected.id
          return (
            <button
              key={variant.id}
              type="button"
              className={swatchClass}
              aria-pressed={isSelected}
              onClick={() => onSelect(variant.id)}
            >
              <span
                className="size-6 flex-none rounded-circle border border-stone-grey bg-(--swatch-color)"
                style={swatchStyle(variant.hex)}
                aria-hidden="true"
              />
              <span>{variant.name}</span>
              <span
                className="text-label font-semibold"
                aria-hidden="true"
                hidden={!isSelected}
              >
                Selected
              </span>
              {variant.available ? null : (
                <Badge variant="status">Out of stock</Badge>
              )}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
