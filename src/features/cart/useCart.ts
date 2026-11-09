import { useMemo, useSyncExternalStore } from 'react'
import { calculateCart } from '../../modules/cart/cart.logic.ts'
import type { CartItem } from '../../modules/cart/cart.types.ts'
import { getCartSnapshot, subscribeCart } from './cart-store.ts'

// The server has no localStorage, so the server render and hydration use an
// empty cart. React then switches to the saved browser cart, which avoids a
// hydration mismatch; the count shows 0 for a moment before that.
const serverSnapshot: readonly CartItem[] = []
const getServerSnapshot = (): readonly CartItem[] => serverSnapshot

export function useCart() {
  const items = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerSnapshot,
  )
  // Lines, count and subtotal are derived from the snapshot, never stored.
  return useMemo(() => calculateCart(items), [items])
}
