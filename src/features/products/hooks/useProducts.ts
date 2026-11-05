import { useEffect, useRef, useState } from 'react'
import { loadProducts } from '../../../modules/products/products.client.ts'
import type { Product } from '../../../modules/products/products.types.ts'

type ProductsState =
  | { readonly status: 'loading' }
  | { readonly status: 'error' }
  | { readonly status: 'success'; readonly products: readonly Product[] }

export function useProducts() {
  const [state, setState] = useState<ProductsState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const generation = useRef(0)

  useEffect(() => {
    const request = ++generation.current

    // The preserved client has no AbortSignal parameter. Invalidate results
    // instead of changing that protected API or updating an unmounted page.
    void loadProducts().then(
      (products) => {
        if (generation.current === request) {
          setState({ status: 'success', products })
        }
      },
      () => {
        if (generation.current === request) {
          setState({ status: 'error' })
        }
      },
    )

    return () => {
      generation.current = request + 1
    }
  }, [attempt])

  function retry(): void {
    // Invalidate immediately, including the interval before effect cleanup.
    generation.current++
    setState({ status: 'loading' })
    setAttempt((value) => value + 1)
  }

  return { state, retry }
}
