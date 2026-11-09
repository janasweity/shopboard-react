import type { Metadata } from 'next'
import InspirationPage from '../../features/rooms/InspirationPage.tsx'

export const metadata: Metadata = { title: 'Room Inspiration' }

export default function Inspiration() {
  return <InspirationPage />
}
