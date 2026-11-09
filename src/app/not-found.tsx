import type { Metadata } from 'next'
import NotFoundPage from '../features/not-found/NotFoundPage.tsx'

export const metadata: Metadata = { title: 'Page not found' }

export default function NotFound() {
  return <NotFoundPage />
}
