import type { ReactNode } from 'react'

interface Props {
  readonly id: string
  readonly label: string
  readonly hint?: string
  readonly error?: string
  readonly className?: string
  readonly children: ReactNode
}

export default function FormField({
  id,
  label,
  hint,
  error,
  className,
  children,
}: Props) {
  return (
    <div className={['form-field', className].filter(Boolean).join(' ')}>
      <label htmlFor={id}>{label}</label>
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
