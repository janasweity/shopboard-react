import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils.ts'

// Every native input prop, including `ref` (a prop in React 19), so
// react-hook-form's register() result can be spread onto it.
export interface InputProps extends ComponentProps<'input'> {}

// RAHA's shared text field. The text inherits the surrounding font, and the
// placeholder keeps the browser grey from the base layer, like the other
// RAHA forms. The focus ring comes from the global :focus-visible rule.
// aria-invalid gives the field a 2px ink border.
function Input({ className, type = 'text', ...props }: InputProps) {
  return (
    <input
      {...props}
      type={type}
      data-slot="input"
      className={cn(
        'min-h-11 w-full min-w-0 rounded-field border border-input bg-background p-3 text-foreground',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-2 aria-invalid:border-destructive',
        className,
      )}
    />
  )
}

export { Input }
