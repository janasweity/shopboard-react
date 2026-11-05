import { useMemo, useSyncExternalStore } from 'react'
import { calculateCart } from '../../modules/cart/cart.logic.ts'
import { getCartSnapshot, subscribeCart } from './cart-store.ts'

export function useCart() {
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot)
  // Lines, count and subtotal are derived from the snapshot, never stored.
  return useMemo(() => calculateCart(items), [items])
}
