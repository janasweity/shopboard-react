import { mkdirSync, writeFileSync } from 'node:fs'
import { products } from '../../src/data.ts'
import { serializeProducts } from '../../src/modules/products/products.api.ts'

// Builds the API data from the RAHA catalogue and the unchanged Day 3
// serializer (prices in cents). The file is generated on every build and is
// not committed, so src/data.ts stays the only product source.
const folder = new URL('../generated/', import.meta.url)
mkdirSync(folder, { recursive: true })
writeFileSync(
  new URL('products.json', folder),
  JSON.stringify({ items: serializeProducts(products) }),
)
console.log(`Wrote ${products.length} products to generated/products.json`)
