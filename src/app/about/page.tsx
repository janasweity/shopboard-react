import type { Metadata } from 'next'
import AboutPage from '../../features/about/AboutPage.tsx'

export const metadata: Metadata = { title: 'About & Contact' }

export default function About() {
  return <AboutPage />
}
