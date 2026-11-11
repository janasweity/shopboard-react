import { textLinkClass } from './shared-classes.ts'

interface Props {
  readonly kind: 'loading' | 'error' | 'empty' | 'no-match' | 'success'
  readonly message: string
  readonly className?: string
  onRetry?: () => void
  onReset?: () => void
}

export default function StatusMessage({
  kind,
  message,
  className,
  onRetry,
  onReset,
}: Props) {
  return (
    <div
      className={className}
      role={kind === 'error' ? 'alert' : 'status'}
      aria-live={kind === 'error' ? 'assertive' : 'polite'}
    >
      <p>{message}</p>
      {onRetry ? (
        <button className={textLinkClass} type="button" onClick={onRetry}>
          Try again
        </button>
      ) : null}
      {onReset ? (
        <button className={textLinkClass} type="button" onClick={onReset}>
          Reset selections
        </button>
      ) : null}
    </div>
  )
}
