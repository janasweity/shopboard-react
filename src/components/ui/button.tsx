import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils.ts'
import { buttonVariants } from '@/components/ui/button-variants.ts'
import type {
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button-variants.ts'

// An icon button shows only a symbol, so it must be named with aria-label.
type ButtonSizeProps =
  | { readonly size?: Exclude<ButtonSize, 'icon'> }
  | { readonly size: 'icon'; readonly 'aria-label': string }

export type ButtonProps = ComponentProps<'button'> & {
  readonly variant?: ButtonVariant
} & ButtonSizeProps

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
