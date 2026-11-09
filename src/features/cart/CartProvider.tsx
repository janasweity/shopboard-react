import { useState } from 'react'
import type { ReactNode } from 'react'
import { products } from '../../data.ts'
import { CartContext } from './cart-context.ts'
import {
  addToCart,
  changeCart,
  emptyCart,
  getCartSnapshot,
} from './cart-store.ts'
import { useCart } from './useCart.ts'

interface Props {
  // The current pathname; the add announcement belongs to it.
  readonly page: string
  readonly children: ReactNode
}

export default function CartProvider({ page, children }: Props) {
  // The Day 3 state module stays the only cart owner. useCart reads its
  // snapshot through cart-store.ts and derives lines, count and subtotal.
  const cart = useCart()
  const [announcement, setAnnouncement] = useState({ page, message: '' })
  // Feedback belongs to the page where it was given; it clears on navigation.
  const status = announcement.page === page ? announcement.message : ''

  function add(productId: string, variantId: string): void {
    const product = products.find((item) => item.id === productId)
    const variant = product?.variants.find((option) => option.id === variantId)
    if (!product || !variant?.available) return
    addToCart(productId, variantId)
    const total = getCartSnapshot().reduce(
      (sum, item) => sum + item.quantity,
      0,
    )
    setAnnouncement({
      page,
      message: `${product.name} | ${variant.name} added to your local cart. ${total} items in total.`,
    })
  }

  return (
    <CartContext
      value={{ ...cart, status, add, change: changeCart, clear: emptyCart }}
    >
      {children}
    </CartContext>
  )
}
