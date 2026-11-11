import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

// RAHA button styles, shared by Button and by links that look like buttons
// (className={buttonVariants()}). The focus ring comes from the global
// :focus-visible rule in globals.css. Hover waits for not-disabled, so a
// disabled button keeps its disabled colour under the pointer.
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-5 rounded-pill border font-medium disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        // The RAHA call to action (.button).
        primary:
          'border-transparent bg-primary text-primary-foreground not-disabled:hover:bg-primary-dark disabled:bg-graphite-grey',
        // The quieter ivory button (.button-secondary).
        secondary:
          'border-line bg-sand text-ink not-disabled:hover:bg-panel disabled:bg-graphite-grey disabled:text-primary-foreground',
        // A transparent outlined button, based on .text-button.
        ghost:
          'border-line bg-transparent font-normal text-ink not-disabled:hover:bg-sand disabled:opacity-50',
        // No box at all, like the header's cart button: no border, background
        // or hover background; the focus ring follows the text.
        plain:
          'rounded-none border-0 bg-transparent font-normal text-ink disabled:opacity-50',
      },
      // Tailwind's spacing and text scale. text-2xs is RAHA's compact control
      // text (globals.css). Every size keeps at least a 40px target.
      size: {
        // Compact, like the product card's Add to cart: 40px high.
        sm: 'min-h-10 px-4 py-2 text-2xs',
        // The standard RAHA button: 44px high.
        md: 'min-h-11 px-6 py-3 text-xs',
        // A larger call to action: 48px high.
        lg: 'min-h-12 px-8 py-3 text-sm',
        // A 44px round button for one symbol, such as a close ×. Button
        // requires an aria-label with this size.
        icon: 'size-11 shrink-0 p-0 text-2xl',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type Variants = VariantProps<typeof buttonVariants>
export type ButtonVariant = NonNullable<Variants['variant']>
export type ButtonSize = NonNullable<Variants['size']>
