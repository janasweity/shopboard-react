import { useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import { money } from '../../data.ts'
import type { CartAction } from '../../modules/cart/cart.types.ts'
import Link from 'next/link'
import { Button } from '../../components/ui/button.tsx'
import { buttonVariants } from '../../components/ui/button-variants.ts'
import { Modal } from '../../components/ui/modal.tsx'
import { cn } from '../../lib/utils.ts'
import CartLineItem from './CartLineItem.tsx'
import { useCartContext } from './cart-context.ts'

interface Props {
  readonly open: boolean
  onClose: () => void
}

interface PendingFocus {
  readonly key: string
  readonly action: CartAction | 'clear'
}

const noteClass = 'mt-4 text-xs leading-body text-muted'

// The cart is the shared Modal: it opens with showModal(), keeps focus inside,
// closes on Escape and returns focus to the cart button.
export default function CartDialog({ open, onClose }: Props) {
  const content = useRef<HTMLDivElement>(null)
  const pendingFocus = useRef<PendingFocus | null>(null)
  const { items, quantity, subtotal, change, clear } = useCartContext()

  // After a cart action re-renders the list, keep keyboard focus useful: on
  // the same button of the same line, on Continue after Clear, or else on the
  // Modal's close button.
  useEffect(() => {
    const target = pendingFocus.current
    const element = content.current
    pendingFocus.current = null
    if (!target || !element) return
    const replacement =
      target.action === 'clear'
        ? element.querySelector<HTMLElement>('#continue-shopping')
        : [...element.querySelectorAll<HTMLButtonElement>('button')].find(
            (button) =>
              button.dataset.key === target.key &&
              button.dataset.action === target.action,
          )
    const closeButton = element
      .closest('dialog')
      ?.querySelector<HTMLElement>('button[aria-label="Close cart"]')
    ;(replacement || closeButton)?.focus()
  }, [items])

  function handleAction(key: string, action: CartAction): void {
    pendingFocus.current = { key, action }
    change(key, action)
  }

  function openCheckout(event: MouseEvent<HTMLAnchorElement>): void {
    // Close only for an in-app navigation, not a new-tab or new-window click.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    onClose()
  }

  function handleClear(): void {
    pendingFocus.current = { key: '', action: 'clear' }
    clear()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Your favourites."
      closeLabel="Close cart"
      id="cart-dialog"
      aria-describedby="cart-note"
    >
      <div ref={content}>
        <p id="cart-note" className={noteClass}>
          A local demo cart. Items are saved on this device across page
          navigation and refresh. The demo checkout takes no payment and sends
          nothing.
        </p>
        {quantity === 0 ? (
          <p id="cart-empty" className={noteClass}>
            Your cart is waiting for a little inspiration.
          </p>
        ) : null}
        <ul id="cart-items" className="my-6">
          {items.map((line) => (
            <CartLineItem key={line.key} line={line} onAction={handleAction} />
          ))}
        </ul>
        <div className="my-6 flex justify-between">
          <span>Subtotal</span>
          <strong id="cart-total">{money(subtotal)}</strong>
        </div>
        {quantity > 0 ? (
          <Link
            href="/checkout"
            id="review-order"
            className={cn(buttonVariants(), 'mb-4 flex')}
            onClick={openCheckout}
          >
            Review demo order {'→'}
          </Link>
        ) : null}
        <Button
          variant="ghost"
          id="clear-cart"
          className="mb-4 flex"
          disabled={quantity === 0}
          onClick={handleClear}
        >
          Clear cart
        </Button>
        <Button id="continue-shopping" onClick={onClose}>
          Continue exploring {'→'}
        </Button>
      </div>
    </Modal>
  )
}
