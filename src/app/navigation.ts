import type { MouseEvent } from 'react'
import {
  categories,
  categoryAliases,
  collections,
  retiredProducts,
} from '../data.ts'
import { isPriceSort } from '../modules/products/products.logic.ts'
import type { Route } from './route.types.ts'
import type { ProductSelection } from '../modules/products/products.types.ts'

export const navigationEvent = 'raha:navigate'

export function replaceProductSelection(selection: ProductSelection): void {
  const url = new URL(window.location.href)
  url.searchParams.set('page', 'products')
  url.searchParams.delete('collection')
  if (!selection.category || selection.category === 'all') {
    url.searchParams.delete('category')
  } else {
    url.searchParams.set('category', selection.category)
  }
  if (selection.query) url.searchParams.set('q', selection.query)
  else url.searchParams.delete('q')
  if (!selection.sort || selection.sort === 'default') {
    url.searchParams.delete('sort')
  } else {
    url.searchParams.set('sort', selection.sort)
  }
  if (url.href === window.location.href) return
  history.replaceState(null, '', url)
  window.dispatchEvent(new Event(navigationEvent))
}

export function replaceProductColor(variantId: string): void {
  const url = new URL(window.location.href)
  url.searchParams.set('color', variantId)
  if (url.href === window.location.href) return
  history.replaceState(null, '', url)
  window.dispatchEvent(new Event(navigationEvent))
}

export function canonicalizeUrl(input: string): URL {
  const url = new URL(input)
  if (url.pathname !== '/') return url
  const params = url.searchParams
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
    params.set('page', 'products')
    page = 'products'
  }
  const productId = params.get('id') || ''
  const retiredCategory =
    page === 'product' && Object.hasOwn(retiredProducts, productId)
      ? retiredProducts[productId]
      : undefined
  if (retiredCategory) {
    params.set('category', retiredCategory)
    params.delete('id')
    params.delete('color')
    params.set('page', 'products')
  }
  const selectedCategory = params.get('category') || ''
  const alias = Object.hasOwn(categoryAliases, selectedCategory)
    ? categoryAliases[selectedCategory]
    : undefined
  if (alias) params.set('category', alias)
  return url
}

export function readRoute(href: string): Route {
  const url = canonicalizeUrl(href)
  if (url.pathname !== '/') return { page: 'not-found' }
  const params = url.searchParams
  const page = params.get('page') || 'home'
  switch (page) {
    case 'home':
      return { page }
    case 'products': {
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
        page,
        selection: {
          query: params.get('q') || '',
          category: selected,
          sort: isPriceSort(sort) ? sort : 'default',
        },
      }
    }
    case 'product':
      return { page, productId: params.get('id'), colorId: params.get('color') }
    case 'inspiration':
      return { page }
    case 'about':
      return { page }
    default:
      return { page: 'not-found' }
  }
}

export function handleRouteClick(event: MouseEvent<HTMLAnchorElement>): void {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return
  const anchor = event.currentTarget
  if (
    anchor.hasAttribute('download') ||
    (anchor.target && anchor.target !== '_self')
  )
    return
  const destination = new URL(anchor.href)
  if (destination.origin !== window.location.origin) return
  // Same-page anchors retain native scrolling and history behavior.
  if (
    destination.pathname === location.pathname &&
    destination.search === location.search &&
    destination.hash
  )
    return
  event.preventDefault()
  const next = canonicalizeUrl(destination.href)
  if (next.href === location.href) return
  history.pushState(null, '', next)
  window.dispatchEvent(new Event(navigationEvent))
}
