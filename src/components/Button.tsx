import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly tone?: 'primary' | 'secondary'
}

export default function Button({
  type = 'button',
  tone = 'primary',
  className = '',
  ...props
}: Props) {
  return (
    <button
      {...props}
      type={type}
      className={['button', 'button-' + tone, className]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
