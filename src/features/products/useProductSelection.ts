import { useSyncExternalStore } from 'react'
import type { ProductSelection } from '../../modules/products/products.types.ts'
import {
  productSelectionEvent,
  readProductSelection,
} from '../../lib/routes.ts'

function subscribe(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange)
  window.addEventListener(productSelectionEvent, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(productSelectionEvent, onChange)
  }
}

const getSearch = () => window.location.search

// The catalogue selection lives in the URL. It is read synchronously, so the
// controlled search field never falls behind fast typing (useSearchParams
// updates later). initialSearch is the server's URL search, used for the
// server render and hydration.
export function useProductSelection(initialSearch: string): ProductSelection {
  const search = useSyncExternalStore(subscribe, getSearch, () => initialSearch)
  return readProductSelection(new URLSearchParams(search))
}
