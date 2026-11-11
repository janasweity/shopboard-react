import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils.ts'
import { inputClass } from '@/components/ui/input-class.ts'

// Every native input prop, including `ref` (a prop in React 19), so
// react-hook-form's register() result can be spread onto it.
export interface InputProps extends ComponentProps<'input'> {}

// RAHA's shared text field; its look is in input-class.ts.
function Input({ className, type = 'text', ...props }: InputProps) {
  return (
    <input
      {...props}
      type={type}
      data-slot="input"
      className={cn(inputClass, className)}
    />
  )
}

export { Input }
