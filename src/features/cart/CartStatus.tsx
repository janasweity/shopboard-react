import { useCartContext } from './cart-context.ts'

export default function CartStatus() {
  const { status } = useCartContext()
  return (
    <p className="cart-status" role="status" aria-live="polite">
      {status}
    </p>
  )
}
