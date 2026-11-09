import type { Metadata } from 'next'
import { products } from '../data.ts'
import HomePage from '../features/home/HomePage.tsx'

// The layout's title template applies only to nested routes, so Home sets
// its full title.
export const metadata: Metadata = {
  title: { absolute: 'Make room for living | RAHA' },
}

// Home shows six featured pieces from the static catalogue, as before.
export default function Home() {
  return <HomePage products={products} />
}
