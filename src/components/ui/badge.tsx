import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils.ts'
import { badgeVariants } from '@/components/ui/badge-variants.ts'
import type { BadgeVariant } from '@/components/ui/badge-variants.ts'

export interface BadgeProps extends ComponentProps<'span'> {
  readonly variant?: BadgeVariant
}

// A short inline label. The text comes from the page; the badge does not
// decide what a product's tag or availability is.
function Badge({ variant, className, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
    />
  )
}

export { Badge }
