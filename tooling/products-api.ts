import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { products } from '../src/data.ts'
import { serializeProducts } from '../src/modules/products/products.api.ts'

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

function send(response: ServerResponse, status: number, body: unknown): void {
  response.statusCode = status
  response.end(JSON.stringify(body))
}

function serveProducts(
  request: IncomingMessage,
  response: ServerResponse,
  next: () => void,
): void {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname
  const { switches, rest } = readSwitches(pathname)
  const productId = readProductId(rest)
  if (productId === null) {
    next()
    return
  }

  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    send(response, 405, { error: 'Method not allowed' })
    return
  }
  if (
    switches.failStatus !== null &&
    (switches.failStatus < 400 || switches.failStatus > 599)
  ) {
    send(response, 400, { error: 'Fail status must be from 400 to 599' })
    return
  }

  function answer(): void {
    if (switches.failStatus !== null) {
      send(response, switches.failStatus, {
        error: 'Simulated error ' + switches.failStatus,
      })
    } else if (productId === undefined) {
      // The list keeps its original contract. empty affects only the list.
      send(response, 200, {
        items: switches.empty ? [] : serializeProducts(products),
      })
    } else {
      const product = products.find((item) => item.id === productId)
      if (product) send(response, 200, serializeProducts([product])[0])
      else send(response, 404, { error: 'Product not found' })
    }
  }

  if (switches.delayMs === 0) {
    answer()
    return
  }
  const timer = setTimeout(answer, switches.delayMs)
  // Stop waiting if the browser cancels the request.
  response.on('close', () => clearTimeout(timer))
}

export function productsApi(): Plugin {
  return {
    name: 'raha-products-api',
    configureServer(server) {
      server.middlewares.use(serveProducts)
    },
    configurePreviewServer(server) {
      server.middlewares.use(serveProducts)
    },
  }
}
