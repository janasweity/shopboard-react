import { useState } from 'react'
import { handleRouteClick } from '../../app/navigation.ts'
import Button from '../../components/Button.tsx'
import StatusMessage from '../../components/StatusMessage.tsx'
import { useCartContext } from '../cart/cart-context.ts'
import {
  entranceDelay,
  useEntranceMotion,
} from '../entrance/entrance-motion.ts'
import CheckoutForm, { firstCheckoutFieldId } from './CheckoutForm.tsx'
import OrderSummary from './OrderSummary.tsx'

// A stable ref callback runs once when the confirmation heading appears. An
// inline one would run again on every render and pull focus back.
const focusOnMount = (element: HTMLElement | null): void => {
  element?.focus()
}

export default function CheckoutPage() {
  const { quantity } = useCartContext()
  const titleMotion = useEntranceMotion('copy', entranceDelay.copy)
  // Only whether the demo was confirmed is kept, never the entered values.
  const [confirmed, setConfirmed] = useState(false)

  function startAgain(): void {
    setConfirmed(false)
    requestAnimationFrame(() =>
      document.getElementById(firstCheckoutFieldId)?.focus(),
    )
  }

  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">RAHA / DEMO CHECKOUT</p>
        <h1 className={titleMotion.className} style={titleMotion.style}>
          Review your demo order.
        </h1>
        <p>
          A practice checkout for this local demo. It takes no payment, and
          nothing you enter is sent or saved.
        </p>
      </section>
      {!confirmed && quantity === 0 ? (
        <section className="checkout-empty" aria-label="Empty cart">
          <StatusMessage
            kind="empty"
            message="Your cart is empty, so there is nothing to review yet."
          />
          <a
            href="/?page=products"
            className="text-link"
            onClick={handleRouteClick}
          >
            Browse products {'↗'}
          </a>
        </section>
      ) : (
        <div className="checkout-layout">
          <section
            className="checkout-panel"
            aria-labelledby="checkout-panel-title"
          >
            {confirmed ? (
              <>
                {/* Focus moves here so the confirmation is announced. */}
                <h2 id="checkout-panel-title" tabIndex={-1} ref={focusOnMount}>
                  Demo order confirmed.
                </h2>
                <p role="status">
                  Nothing was sent, saved or charged. Your cart is unchanged.
                </p>
                <Button tone="secondary" onClick={startAgain}>
                  Start a new demo order
                </Button>
              </>
            ) : (
              <>
                <h2 id="checkout-panel-title">Your details</h2>
                <CheckoutForm onConfirmed={() => setConfirmed(true)} />
              </>
            )}
          </section>
          <OrderSummary />
        </div>
      )}
    </>
  )
}
