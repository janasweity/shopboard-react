import type { ReactNode } from 'react'
import { cn } from '../lib/utils.ts'

interface Props {
  readonly id: string
  readonly label: string
  readonly hint?: string
  readonly error?: string
  readonly className?: string
  // Tailwind classes for the label, for example a different margin. The
  // shared .form-field rules are in a cascade layer, so these win.
  readonly labelClassName?: string
  readonly children: ReactNode
}

export default function FormField({
  id,
  label,
  hint,
  error,
  className,
  labelClassName,
  children,
}: Props) {
  return (
    <div className={cn('form-field', className)}>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      {children}
      {hint ? <p id={id + '-hint'}>{hint}</p> : null}
      {error ? (
        <p id={id + '-error'} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
