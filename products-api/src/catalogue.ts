import { readFileSync } from 'node:fs'
import type { Catalogue } from './handle-request.ts'

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

// Reads generated/products.json. The local server and the Vercel function
// both use it; on Vercel, vercel.json includes the file in the function.
export function readCatalogue(): Catalogue {
  const file = new URL('../generated/products.json', import.meta.url)
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
