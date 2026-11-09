import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartContext } from '../cart/cart-context.ts'

interface Props {
  onOpenCart: () => void
}

const links = [
  { id: 'home', href: '/', label: 'Home' },
  { id: 'products', href: '/products', label: 'Products' },
  { id: 'inspiration', href: '/inspiration', label: 'Room Inspiration' },
  { id: 'about', href: '/about', label: 'About & Contact' },
]

// A product page belongs to Products in the menu.
function isActive(pathname: string, href: string): boolean {
  return href === '/'
    ? pathname === '/'
    : pathname === href || pathname.startsWith(href + '/')
}

export default function SiteHeader({ onOpenCart }: Props) {
  const { quantity } = useCartContext()
  const pathname = usePathname()
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span>
          RAHA <small>HOME &amp; LIVING</small>
        </span>
      </Link>
      <nav aria-label="Main navigation">
        <ul className="nav-list">
          {links.map((link) => {
            const active = isActive(pathname, link.href)
            return (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className={active ? 'active' : undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
          <li>
            <button
              className="cart-toggle"
              type="button"
              aria-haspopup="dialog"
              aria-controls="cart-dialog"
              onClick={onOpenCart}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="m2 3 3 1 3 12h11l3-9H6M10 21h.01M18 21h.01" />
              </svg>
              Cart <span id="cart-count">{quantity}</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}
