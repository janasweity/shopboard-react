import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

// RAHA card surfaces, taken from the panels the site already uses. Card
// renders a div; a section, figure or dialog that must keep its own element
// uses className={cardVariants(...)} instead.
export const cardVariants = cva('min-w-0 text-foreground', {
  variants: {
    variant: {
      // Silver panel: room planner, contact, checkout form and order summary,
      // product gallery frame.
      panel: 'rounded-panel bg-panel',
      // Greige feature block with a line: Home registration section.
      feature: 'rounded-panel border border-line bg-feature',
      // Page-coloured card with a line: the registration form.
      surface: 'rounded-card border border-line bg-background',
    },
    // Spacing from Tailwind's scale; md: and xl: are RAHA's 768px and 1280px.
    padding: {
      // Gallery frame: 1rem.
      sm: 'p-4',
      // Planner, checkout panels and registration form: 1.5rem.
      md: 'p-6',
      // Contact section: 1.5rem, then 2rem and 3rem.
      lg: 'p-6 md:p-8 xl:p-12',
      // Registration section: 2rem by 1.25rem, then 2.5rem and 3.5rem.
      xl: 'px-5 py-8 md:p-10 xl:p-14',
    },
  },
  defaultVariants: { variant: 'panel', padding: 'md' },
})

type Variants = VariantProps<typeof cardVariants>
export type CardVariant = NonNullable<Variants['variant']>
export type CardPadding = NonNullable<Variants['padding']>
