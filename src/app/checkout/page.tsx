import type { Metadata } from 'next'
import CheckoutPage from '../../features/checkout/CheckoutPage.tsx'

export const metadata: Metadata = { title: 'Demo checkout' }

export default function Checkout() {
  return <CheckoutPage />
}
