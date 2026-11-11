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
        <button className="text-link" type="button" onClick={onRetry}>
          Try again
        </button>
      ) : null}
      {onReset ? (
        <button className="text-link" type="button" onClick={onReset}>
          Reset selections
        </button>
      ) : null}
    </div>
  )
}
