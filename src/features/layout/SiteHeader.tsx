import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../../components/ui/button.tsx'
import { cn } from '../../lib/utils.ts'
import { useCartContext } from '../cart/cart-context.ts'
import { brandClass, brandTagClass } from './brand-classes.ts'

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
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2.5 bg-warm-ivory px-gutter py-4 md:gap-5 md:py-5.5 xl:min-h-24">
      <Link className={brandClass} href="/">
        <span>
          RAHA <small className={brandTagClass}>HOME &amp; LIVING</small>
        </span>
      </Link>
      {/* Below 768px the menu takes its own row under the brand. */}
      <nav
        aria-label="Main navigation"
        className="order-3 basis-full md:order-none md:flex-1"
      >
        <ul className="flex flex-wrap justify-between gap-x-2.75 gap-y-1 md:justify-center md:gap-4 xl:gap-8">
          {links.map((link) => {
            const active = isActive(pathname, link.href)
            return (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex min-h-11 items-center border-b text-2xs hover:border-primary hover:text-primary-dark',
                    active
                      ? 'border-taupe-brown font-semibold text-primary-dark'
                      : 'border-transparent',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
          <li>
            <Button
              variant="plain"
              className="gap-1.5 px-1.5 py-px"
              aria-haspopup="dialog"
              aria-controls="cart-dialog"
              onClick={onOpenCart}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="text-stone-grey"
              >
                <path d="m2 3 3 1 3 12h11l3-9H6M10 21h.01M18 21h.01" />
              </svg>
              Cart{' '}
              <span
                id="cart-count"
                className="grid h-5.5 min-w-5.5 place-items-center rounded-circle bg-panel px-1 text-2xs"
              >
                {quantity}
              </span>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  )
}
