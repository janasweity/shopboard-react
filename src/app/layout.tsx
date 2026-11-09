import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import AppShell from '../features/layout/AppShell.tsx'
import '../styles/tokens.css'
import '../styles/main.css'

export const metadata: Metadata = {
  title: { default: 'RAHA | Make room for living', template: '%s | RAHA' },
  description:
    'RAHA - contemporary furniture and home accessories, room inspiration, and thoughtful design for everyday living.',
  icons: { icon: { url: '/raha.svg', type: 'image/svg+xml' } },
}

export const viewport: Viewport = { themeColor: '#302923' }

interface Props {
  readonly children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
