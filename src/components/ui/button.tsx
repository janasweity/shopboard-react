import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils.ts'
import { buttonVariants } from '@/components/ui/button-variants.ts'
import type {
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button-variants.ts'

export interface ButtonProps extends ComponentProps<'button'> {
  readonly variant?: ButtonVariant
  readonly size?: ButtonSize
}

// A native button with RAHA's variants. `type` defaults to "button", so a
// button inside a form submits only when it asks for type="submit".
function Button({
  type = 'button',
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
    />
  )
}

export { Button }
