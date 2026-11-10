import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils.ts'
import { cardVariants } from '@/components/ui/card-variants.ts'
import type { CardPadding, CardVariant } from '@/components/ui/card-variants.ts'

export interface CardProps extends ComponentProps<'div'> {
  readonly variant?: CardVariant
  readonly padding?: CardPadding
}

// A RAHA surface for grouped content. It holds no layout, headings or data:
// the page decides what goes inside.
function Card({ variant, padding, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      data-slot="card"
      className={cn(cardVariants({ variant, padding }), className)}
    />
  )
}

export { Card }
