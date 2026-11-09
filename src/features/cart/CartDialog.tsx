import { useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import { money } from '../../data.ts'
import type { CartAction } from '../../modules/cart/cart.types.ts'
import Link from 'next/link'
import Button from '../../components/Button.tsx'
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

export default function CartDialog({ open, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const pendingFocus = useRef<PendingFocus | null>(null)
  const { items, quantity, subtotal, change, clear } = useCartContext()

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (open && !element.open) element.showModal()
    if (!open && element.open) element.close()
  }, [open])

  // After a cart action re-renders the list, keep keyboard focus useful.
  useEffect(() => {
    const target = pendingFocus.current
    const element = dialog.current
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
    ;(replacement || element.querySelector<HTMLElement>('.close-cart'))?.focus()
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
    <dialog
      ref={dialog}
      id="cart-dialog"
      className="cart-dialog"
      aria-labelledby="cart-title"
      aria-describedby="cart-note"
      onClose={onClose}
    >
      <div className="cart-header">
        <h2 id="cart-title">Your favourites.</h2>
        <button
          type="button"
          className="close-cart"
          aria-label="Close cart"
          onClick={onClose}
        >
          {'×'}
        </button>
      </div>
      <p id="cart-note">
        A local demo cart. Items are saved on this device across page navigation
        and refresh. The demo checkout takes no payment and sends nothing.
      </p>
      {quantity === 0 ? (
        <p id="cart-empty">Your cart is waiting for a little inspiration.</p>
      ) : null}
      <ul id="cart-items">
        {items.map((line) => (
          <CartLineItem key={line.key} line={line} onAction={handleAction} />
        ))}
      </ul>
      <div className="cart-summary">
        <span>Subtotal</span>
        <strong id="cart-total">{money(subtotal)}</strong>
      </div>
      {quantity > 0 ? (
        <Link
          href="/checkout"
          id="review-order"
          className="button button-primary"
          onClick={openCheckout}
        >
          Review demo order {'→'}
        </Link>
      ) : null}
      <button
        type="button"
        className="text-button"
        id="clear-cart"
        disabled={quantity === 0}
        onClick={handleClear}
      >
        Clear cart
      </button>
      <Button id="continue-shopping" onClick={onClose}>
        Continue exploring {'→'}
      </Button>
    </dialog>
  )
}
