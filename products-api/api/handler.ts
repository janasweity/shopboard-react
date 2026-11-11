import { readCatalogue } from '../src/catalogue.ts'
import { handleRequest } from '../src/handle-request.ts'

// The Vercel function. vercel.json rewrites every path to it and passes the
// original path as ?path=, so the routes and test switches stay the same as
// on the local server: /api/products, /api/products/:id, /delay/<ms>/...,
// /fail/<status>/... and /empty/...
const catalogue = readCatalogue()
const functionPath = '/api/handler'

// The path the client asked for: the request's own path, or the ?path= that
// the rewrite added when the function sees its own address.
function requestedPath(url: URL): string {
  if (url.pathname !== functionPath) return url.pathname
  return url.searchParams.get('path') ?? '/'
}

// Waits for a test delay, and stops early if the client cancels.
function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        resolve()
      },
      { once: true },
    )
  })
}

export default {
  async fetch(request: Request): Promise<Response> {
    const pathname = requestedPath(new URL(request.url))
    const result = handleRequest(request.method, pathname, catalogue)
    const headers = new Headers({
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    })
    if (result.status === 405) headers.set('Allow', 'GET')
    if (result.delayMs > 0) await wait(result.delayMs, request.signal)
    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers,
    })
  },
}
