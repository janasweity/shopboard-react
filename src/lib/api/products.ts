import 'server-only'
import { cache } from 'react'
import { headers } from 'next/headers'
import { ApiError, fetchJson } from '../../shared/api/api-client.ts'
import {
  mapApiProduct,
  parseProductsResponse,
} from '../../modules/products/products.client.ts'
import type { ApiProduct } from '../../modules/products/products.api.types.ts'
import type { Product } from '../../modules/products/products.types.ts'
import { splitTestSwitches, testSwitchesHeader } from './test-switches.ts'

// The shared products API client for Server Components. It requests the
// standalone RAHA products API (products-api/) at RAHA_API_URL, never this
// app itself, and reuses the unchanged Day 3 fetchJson, runtime decoder and
// cents-to-dollars mapper.

function apiBaseUrl(): string {
  const value = process.env.RAHA_API_URL || ''
  if (!/^https?:\/\/[^/]/.test(value)) {
    throw new Error(
      'RAHA_API_URL must be the full http(s) URL of the products API, for example http://127.0.0.1:4000.',
    )
  }
  return value.replace(/\/+$/, '')
}

// The switches src/proxy.ts took from the page URL, checked again here.
async function testPrefix(): Promise<string> {
  const value = (await headers()).get(testSwitchesHeader) || ''
  const { prefix, rest } = splitTestSwitches(value)
  return rest === '' ? prefix : ''
}

async function apiUrl(path: string): Promise<string> {
  return apiBaseUrl() + (await testPrefix()) + path
}

// One product is checked as a one-item list, so every field and finish is
// validated by the same Day 3 decoder.
function decodeProduct(value: unknown): ApiProduct {
  const [item] = parseProductsResponse({ items: [value] }).items
  if (!item) throw new Error('Invalid product response')
  return item
}

// cache() shares one request per render, for example between a page and its
// generateMetadata.
export const getProducts = cache(async (): Promise<Product[]> => {
  const response = await fetchJson(
    await apiUrl('/api/products'),
    parseProductsResponse,
  )
  return response.items.map(mapApiProduct)
})

// Returns null for 404, so the page can show not-found; other errors throw.
export const getProduct = cache(async (id: string): Promise<Product | null> => {
  try {
    const item = await fetchJson(
      await apiUrl('/api/products/' + encodeURIComponent(id)),
      decodeProduct,
    )
    if (item.id !== id) throw new Error('The API returned a different product')
    return mapApiProduct(item)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
})
