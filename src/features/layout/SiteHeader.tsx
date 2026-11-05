import type { Route } from '../../app/route.types.ts'
import { handleRouteClick } from '../../app/navigation.ts'

interface Props {
  readonly route: Route
  readonly cartCount: number
  onOpenCart: () => void
}

const links = [
  { id: 'home', href: '/', label: 'Home' },
  { id: 'products', href: '/?page=products', label: 'Products' },
  { id: 'inspiration', href: '/?page=inspiration', label: 'Room Inspiration' },
  { id: 'about', href: '/?page=about', label: 'About & Contact' },
]

export default function SiteHeader({ route, cartCount, onOpenCart }: Props) {
  const activePage = route.page === 'product' ? 'products' : route.page
  return (
    <header className="site-header">
      <a className="brand" href="/" onClick={handleRouteClick}>
        <span>
          RAHA <small>HOME &amp; LIVING</small>
        </span>
      </a>
      <nav aria-label="Main navigation">
        <ul className="nav-list">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                onClick={handleRouteClick}
                className={activePage === link.id ? 'active' : undefined}
                aria-current={activePage === link.id ? 'page' : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
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
              Cart <span id="cart-count">{cartCount}</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}
