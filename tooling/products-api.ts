import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { products } from '../src/data.ts'
import { serializeProducts } from '../src/modules/products/products.api.ts'

function serveProducts(
  request: IncomingMessage,
  response: ServerResponse,
  next: () => void,
): void {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname
  if (pathname !== '/api/products') {
    next()
    return
  }

  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  if (request.method !== 'GET') {
    response.statusCode = 405
    response.setHeader('Allow', 'GET')
    response.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  response.end(JSON.stringify({ items: serializeProducts(products) }))
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
