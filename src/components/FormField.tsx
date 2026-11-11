import type { ReactNode } from 'react'
import { cn } from '../lib/utils.ts'

interface Props {
  readonly id: string
  readonly label: string
  readonly hint?: string
  readonly error?: string
  readonly className?: string
  // Tailwind classes for the label, for example a different margin. cn()
  // lets them replace the default label classes.
  readonly labelClassName?: string
  // Tailwind classes for the hint paragraph.
  readonly hintClassName?: string
  readonly children: ReactNode
}

export default function FormField({
  id,
  label,
  hint,
  error,
  className,
  labelClassName,
  hintClassName,
  children,
}: Props) {
  return (
    <div className={cn('mb-4.5', className)}>
      <label
        htmlFor={id}
        className={cn('mb-1.5 block text-field-label', labelClassName)}
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p id={id + '-hint'} className={hintClassName}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={id + '-error'} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
