import { readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { handleRequest } from './src/handle-request.ts'
import type { Catalogue } from './src/handle-request.ts'

// The generated file comes from the RAHA catalogue through the typed build
// script, so only its outer shape is checked here.
function isCatalogue(value: unknown): value is Catalogue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'items' in value &&
    Array.isArray(value.items) &&
    value.items.every(
      (item: unknown) =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        typeof item.id === 'string',
    )
  )
}

function readCatalogue(): Catalogue {
  const file = new URL('./generated/products.json', import.meta.url)
  let value: unknown
  try {
    value = JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    throw new Error(
      'generated/products.json is missing or invalid. Run "npm run build" in products-api first.',
    )
  }
  if (!isCatalogue(value)) {
    throw new Error('generated/products.json does not contain { items }.')
  }
  return value
}

const catalogue = readCatalogue()
const port = Number(process.env.PORT) || 4000

createServer((request, response) => {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname
  const result = handleRequest(request.method || 'GET', pathname, catalogue)
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  if (result.status === 405) response.setHeader('Allow', 'GET')

  function answer(): void {
    response.statusCode = result.status
    response.end(JSON.stringify(result.body))
  }

  if (result.delayMs === 0) {
    answer()
    return
  }
  const timer = setTimeout(answer, result.delayMs)
  // Stop waiting if the client cancels the request.
  response.on('close', () => clearTimeout(timer))
}).listen(port, '127.0.0.1', () => {
  console.log(`RAHA products API on http://127.0.0.1:${port}`)
})
