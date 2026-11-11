import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

// RAHA's two short labels. Placement (such as the tag's corner position on a
// product image) belongs to the page, not to the badge.
export const badgeVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      // Product tag on a product image (.product-tag): an outlined pill.
      tag: 'rounded-chip border border-accent bg-background px-2.5 py-1 text-2xs tracking-wider text-primary-dark',
      // Availability note inside a finish swatch (.swatch-stock): small text
      // in the surrounding colour, without a frame.
      status: 'text-2xs',
    },
  },
  defaultVariants: { variant: 'tag' },
})

type Variants = VariantProps<typeof badgeVariants>
export type BadgeVariant = NonNullable<Variants['variant']>
