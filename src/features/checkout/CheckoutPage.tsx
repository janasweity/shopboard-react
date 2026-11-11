'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '../../components/ui/button.tsx'
import { cardVariants } from '../../components/ui/card-variants.ts'
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
        <section className="mb-16" aria-label="Empty cart">
          <StatusMessage
            kind="empty"
            message="Your cart is empty, so there is nothing to review yet."
          />
          <Link href="/products" className="text-link">
            Browse products {'↗'}
          </Link>
        </section>
      ) : (
        <div className="mb-16 grid gap-8 md:grid-cols-checkout md:items-start">
          <section
            className={cardVariants()}
            aria-labelledby="checkout-panel-title"
          >
            {confirmed ? (
              <>
                {/* Focus moves here so the confirmation is announced. */}
                <h2
                  id="checkout-panel-title"
                  tabIndex={-1}
                  ref={focusOnMount}
                  className="mb-4 focus:outline-none"
                >
                  Demo order confirmed.
                </h2>
                <p role="status" className="text-sm leading-body text-muted">
                  Nothing was sent, saved or charged. Your cart is unchanged.
                </p>
                <Button
                  variant="secondary"
                  className="mt-2"
                  onClick={startAgain}
                >
                  Start a new demo order
                </Button>
              </>
            ) : (
              <>
                <h2 id="checkout-panel-title" className="mb-4">
                  Your details
                </h2>
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
