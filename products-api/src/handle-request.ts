import type { ApiProduct } from '../../src/modules/products/products.api.types.ts'

export interface Catalogue {
  readonly items: readonly ApiProduct[]
}

export interface ApiResult {
  readonly status: number
  readonly body: unknown
  readonly delayMs: number
}

const maxDelayMs = 8000

interface Switches {
  readonly delayMs: number
  readonly failStatus: number | null
  readonly empty: boolean
}

// Test switches go before /api, as in the course API:
// /delay/3000/api/products, /fail/500/api/products, /empty/api/products.
// They can be combined, for example /delay/2000/fail/503/api/products.
function readSwitches(pathname: string): {
  readonly switches: Switches
  readonly rest: string
} {
  let rest = pathname
  let delayMs = 0
  let failStatus: number | null = null
  let empty = false
  for (;;) {
    const delay = /^\/delay\/(\d+)(?=\/)/.exec(rest)
    const fail = /^\/fail\/(\d{3})(?=\/)/.exec(rest)
    if (delay) {
      delayMs = Math.min(Number(delay[1]), maxDelayMs)
      rest = rest.slice(delay[0].length)
    } else if (fail) {
      failStatus = Number(fail[1])
      rest = rest.slice(fail[0].length)
    } else if (rest.startsWith('/empty/')) {
      empty = true
      rest = rest.slice('/empty'.length)
    } else {
      return { switches: { delayMs, failStatus, empty }, rest }
    }
  }
}

// Returns undefined for the list, a product ID for one product, or null when
// the path is not part of this API.
function readProductId(path: string): string | undefined | null {
  if (path === '/api/products') return undefined
  const match = /^\/api\/products\/([^/]+)$/.exec(path)
  if (!match) return null
  try {
    return decodeURIComponent(match[1])
  } catch {
    return match[1]
  }
}

// Pure request handling, shared by every way the API is served.
export function handleRequest(
  method: string,
  pathname: string,
  catalogue: Catalogue,
): ApiResult {
  const { switches, rest } = readSwitches(pathname)
  const productId = readProductId(rest)
  if (productId === null) {
    return { status: 404, body: { error: 'Not found' }, delayMs: 0 }
  }
  if (method !== 'GET') {
    return { status: 405, body: { error: 'Method not allowed' }, delayMs: 0 }
  }
  const { delayMs, failStatus, empty } = switches
  if (failStatus !== null && (failStatus < 400 || failStatus > 599)) {
    return {
      status: 400,
      body: { error: 'Fail status must be from 400 to 599' },
      delayMs: 0,
    }
  }
  if (failStatus !== null) {
    return {
      status: failStatus,
      body: { error: 'Simulated error ' + failStatus },
      delayMs,
    }
  }
  if (productId === undefined) {
    // The list keeps the { items } contract. empty affects only the list.
    return {
      status: 200,
      body: { items: empty ? [] : catalogue.items },
      delayMs,
    }
  }
  const product = catalogue.items.find((item) => item.id === productId)
  return product
    ? { status: 200, body: product, delayMs }
    : { status: 404, body: { error: 'Product not found' }, delayMs }
}
