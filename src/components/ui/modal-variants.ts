import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

// Panel widths for Modal, from Tailwind's container scale. The panel never
// grows past the viewport: the dialog keeps a 1rem gutter around it.
export const modalVariants = cva('max-h-full w-full overflow-y-auto', {
  variants: {
    size: {
      sm: 'max-w-sm', // 24rem
      md: 'max-w-xl', // 36rem, close to the cart's 580px
      lg: 'max-w-3xl', // 48rem
    },
  },
  defaultVariants: { size: 'md' },
})

// The title of Modal and InlineDialog.
export const dialogTitleClass = 'text-3xl'

type Variants = VariantProps<typeof modalVariants>
export type ModalSize = NonNullable<Variants['size']>
