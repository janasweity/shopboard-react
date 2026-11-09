import type { Metadata } from 'next'
import { getProducts } from '../../lib/api/products.ts'
import ProductsPage from '../../features/products/pages/ProductsPage.tsx'

export const metadata: Metadata = { title: 'Products' }

// The list is requested from the products API for every visit, so test
// switches and Try again always reach the API.
export const dynamic = 'force-dynamic'

export default async function Products({
  searchParams,
}: PageProps<'/products'>) {
  // The client reads search, filter and sort from the URL; the server passes
  // the same search for the first render and hydration.
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === 'string') params.set(key, value)
  }
  const search = params.toString()
  // The list is not awaited: the page streams at once, and only the results
  // wait for the API.
  return (
    <ProductsPage
      products={getProducts()}
      requestId={crypto.randomUUID()}
      initialSearch={search ? '?' + search : ''}
    />
  )
}
