import { fetchJson } from '../../../shared/api/api-client.ts'
import {
  mapApiProduct,
  parseProductsResponse,
} from '../../../modules/products/products.client.ts'
import type { ApiProduct } from '../../../modules/products/products.api.types.ts'
import type { Product } from '../../../modules/products/products.types.ts'

// Reuses the Day 3 runtime decoder without changing it: one product is checked
// as a one-item list, so every field and finish is validated the same way.
function decodeProduct(value: unknown): ApiProduct {
  const [item] = parseProductsResponse({ items: [value] }).items
  if (!item) throw new Error('Invalid product response')
  return item
}

async function loadProduct(id: string): Promise<Product> {
  // fetchJson throws ApiError with the HTTP status, so 404 can be told apart
  // from server errors.
  const item = await fetchJson(
    '/api/products/' + encodeURIComponent(id),
    decodeProduct,
  )
  if (item.id !== id) throw new Error('The API returned a different product')
  return mapApiProduct(item)
}

// use() needs the same promise on every render, so requests are cached by ID.
// A failed request stays cached until retryProduct is called, so React does
// not start a new request each time it renders the error.
const requests = new Map<string, Promise<Product>>()

export function readProduct(id: string): Promise<Product> {
  let request = requests.get(id)
  if (!request) {
    request = loadProduct(id)
    requests.set(id, request)
  }
  return request
}

export function retryProduct(id: string): void {
  requests.delete(id)
}
