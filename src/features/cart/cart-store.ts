import { addCartItem, changeCartItem, clearCart, getCart } from '../../state.ts'
import type { CartAction, CartItem } from '../../modules/cart/cart.types.ts'

export type AddHandler = (productId: string, variantId: string) => void

// The preserved Day 3 state module owns the cart Map and raha-cart storage.
// This adapter only gives React a stable snapshot and change notifications.
let snapshot: readonly CartItem[] = getCart()
const listeners = new Set<() => void>()

function refresh(): void {
  snapshot = getCart()
  listeners.forEach((listener) => listener())
}

export function subscribeCart(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const getCartSnapshot = (): readonly CartItem[] => snapshot

export function addToCart(productId: string, variantId: string): void {
  addCartItem(productId, variantId)
  refresh()
}

export function changeCart(key: string, action: CartAction): void {
  changeCartItem(key, action)
  refresh()
}

export function emptyCart(): void {
  clearCart()
  refresh()
}
