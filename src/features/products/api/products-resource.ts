import { fetchJson } from '../../../shared/api/api-client.ts'
import {
  mapApiProduct,
  parseProductsResponse,
} from '../../../modules/products/products.client.ts'
import type { ApiProduct } from '../../../modules/products/products.api.types.ts'
import type { Product } from '../../../modules/products/products.types.ts'
import { apiUrl } from './api-base.ts'

// Both requests reuse the Day 3 fetchJson, decoder and cents-to-dollars mapper
// without changing them. Day 3 loadProducts always requests /api/products, so
// it cannot use the shared base URL; the list is loaded here the same way.
async function loadCatalogue(): Promise<Product[]> {
  const response = await fetchJson(
    apiUrl('/api/products'),
    parseProductsResponse,
  )
  return response.items.map(mapApiProduct)
}

// One product is checked as a one-item list, so every field and finish is
// validated by the same Day 3 decoder.
function decodeProduct(value: unknown): ApiProduct {
  const [item] = parseProductsResponse({ items: [value] }).items
  if (!item) throw new Error('Invalid product response')
  return item
}

async function loadProduct(id: string): Promise<Product> {
  // fetchJson throws ApiError with the HTTP status, so 404 can be told apart
  // from server errors.
  const item = await fetchJson(
    apiUrl('/api/products/' + encodeURIComponent(id)),
    decodeProduct,
  )
  if (item.id !== id) throw new Error('The API returned a different product')
  return mapApiProduct(item)
}

// use() needs the same promise on every render, so each request is cached.
// That also stops duplicate requests from re-renders, StrictMode and revisits.
// A failed request stays cached until its retry function is called, so React
// does not start a new request each time it renders the error.
let catalogue: Promise<Product[]> | null = null
const products = new Map<string, Promise<Product>>()

export function readCatalogue(): Promise<Product[]> {
  if (!catalogue) catalogue = loadCatalogue()
  return catalogue
}

export function retryCatalogue(): void {
  catalogue = null
}

export function readProduct(id: string): Promise<Product> {
  let request = products.get(id)
  if (!request) {
    request = loadProduct(id)
    products.set(id, request)
  }
  return request
}

export function retryProduct(id: string): void {
  products.delete(id)
}
