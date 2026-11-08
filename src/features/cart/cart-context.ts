import { createContext, useContext } from 'react'
import type { CartAction, CartSummary } from '../../modules/cart/cart.types.ts'
import type { AddHandler } from './cart-store.ts'

export interface CartContextValue extends CartSummary {
  // The add announcement for the current page; empty after navigation.
  readonly status: string
  readonly add: AddHandler
  readonly change: (key: string, action: CartAction) => void
  readonly clear: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCartContext(): CartContextValue {
  const value = useContext(CartContext)
  if (!value) {
    throw new Error('useCartContext must be used inside CartProvider.')
  }
  return value
}
