import {
  categories,
  categoryAliases,
  collections,
  retiredProducts,
} from '../data.ts'
import { isPriceSort } from '../modules/products/products.logic.ts'
import type { ProductSelection } from '../modules/products/products.types.ts'

// The App Router paths. Older query-string URLs (/?page=…) are redirected to
// these by src/proxy.ts and converted with toAppHref when they come from data.

export const productPath = (id: string, colorId?: string | null): string =>
  '/products/' +
  encodeURIComponent(id) +
  (colorId ? '?color=' + encodeURIComponent(colorId) : '')

interface SearchParamsLike {
  get(name: string): string | null
}

// Reads the catalogue search, category or collection, and sort from the URL.
export function readProductSelection(
  params: SearchParamsLike,
): ProductSelection {
  const category = params.get('category')
  const collection = params.get('collection')
  const selected =
    categories.some(([id]) => id === category) ||
    collections.some(({ id }) => 'collection:' + id === category)
      ? category || 'all'
      : collections.some(({ id }) => id === collection)
        ? 'collection:' + collection
        : 'all'
  const sort = params.get('sort')
  return {
    query: params.get('q') || '',
    category: selected,
    sort: isPriceSort(sort) ? sort : 'default',
  }
}

export function productsHref(selection: ProductSelection): string {
  const params = new URLSearchParams()
  if (selection.query) params.set('q', selection.query)
  if (selection.category && selection.category !== 'all') {
    params.set('category', selection.category)
  }
  if (selection.sort && selection.sort !== 'default') {
    params.set('sort', selection.sort)
  }
  const search = params.toString()
  return '/products' + (search ? '?' + search : '')
}

// Fired after the catalogue selection changes the URL (see
// useProductSelection).
export const productSelectionEvent = 'raha:product-selection'

// Updates the catalogue URL without a server request. Next.js also keeps its
// router in sync with the native History API.
export function replaceProductSelection(selection: ProductSelection): void {
  const next = productsHref(selection)
  if (next === location.pathname + location.search) return
  window.history.replaceState(null, '', next)
  window.dispatchEvent(new Event(productSelectionEvent))
}

export function replaceProductColor(variantId: string): void {
  const url = new URL(window.location.href)
  url.searchParams.set('color', variantId)
  if (url.href === window.location.href) return
  window.history.replaceState(null, '', url)
}

function retiredRedirect(productId: string): string | null {
  const category = Object.hasOwn(retiredProducts, productId)
    ? retiredProducts[productId]
    : undefined
  return category ? '/products?category=' + category : null
}

// Returns the new path for an old /?page=… URL or a retired product, or null
// when the URL needs no redirect. Kept from the earlier hand-written router:
// legacy category and collection pages, category aliases and retired IDs.
export function redirectPath(url: URL): string | null {
  const productMatch = /^\/products\/([^/]+)$/.exec(url.pathname)
  if (productMatch) {
    let id = productMatch[1]
    try {
      id = decodeURIComponent(id)
    } catch {
      /* Invalid encoded IDs use their literal value. */
    }
    return retiredRedirect(id)
  }
  if (url.pathname !== '/' || !url.searchParams.has('page')) return null

  const params = new URLSearchParams(url.searchParams)
  let page = params.get('page') || 'home'
  if (
    page === 'category' ||
    page === 'collection' ||
    categories.some(([id]) => id === page) ||
    Object.hasOwn(categoryAliases, page) ||
    collections.some(({ id }) => id === page)
  ) {
    const legacy = params.get('id') || params.get('slug') || page
    const key =
      page !== 'category' &&
      (page === 'collection' || collections.some(({ id }) => id === legacy))
        ? 'collection'
        : 'category'
    params.set(key, params.get(key) || legacy)
    params.delete('id')
    params.delete('slug')
    page = 'products'
  }
  const alias = categoryAliases[params.get('category') || '']
  if (alias) params.set('category', alias)

  const productId = params.get('id')
  params.delete('page')
  if (page === 'product') {
    params.delete('id')
    if (!productId) return withSearch('/products', params)
    const retired = retiredRedirect(productId)
    if (retired) return retired
    const color = params.get('color')
    params.delete('color')
    return withSearch(productPath(productId, color), params)
  }
  const paths: Record<string, string> = {
    home: '/',
    products: '/products',
    inspiration: '/inspiration',
    about: '/about',
    checkout: '/checkout',
  }
  return withSearch(paths[page] || '/' + encodeURIComponent(page), params)
}

function withSearch(path: string, params: URLSearchParams): string {
  const search = params.toString()
  if (!search) return path
  return path + (path.includes('?') ? '&' : '?') + search
}

// Converts an href from the Day 3 data (for example '/?page=products&…') to
// the App Router path, so links do not need the redirect.
export function toAppHref(href: string): string {
  const url = new URL(href, 'http://raha.local')
  const path = redirectPath(url)
  return path ? path + url.hash : href
}
