import { useCartContext } from './cart-context.ts'

export default function CartStatus() {
  const { status } = useCartContext()
  return (
    <p
      id="cart-status"
      className="text-xs leading-body text-primary-dark not-empty:py-4"
      role="status"
      aria-live="polite"
    >
      {status}
    </p>
  )
}
