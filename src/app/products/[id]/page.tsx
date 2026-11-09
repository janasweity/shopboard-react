import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProduct } from '../../../lib/api/products.ts'
import ProductDetails from '../../../features/products/components/ProductDetails.tsx'

export async function generateMetadata({
  params,
}: PageProps<'/products/[id]'>): Promise<Metadata> {
  // getProduct is cached per render, so this shares the page's request.
  const product = await getProduct((await params).id)
  return { title: product ? product.name : 'Page not found' }
}

export default async function ProductPage({
  params,
}: PageProps<'/products/[id]'>) {
  const product = await getProduct((await params).id)
  if (!product) notFound()
  return <ProductDetails product={product} />
}
