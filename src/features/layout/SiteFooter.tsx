import Link from 'next/link'

interface Props {
  readonly year: number
}

export default function SiteFooter({ year }: Props) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-intro">
          <Link className="footer-brand brand" href="/">
            <span>
              RAHA <small>HOME &amp; LIVING</small>
            </span>
          </Link>
          <p>
            Considered pieces.
            <br />A little more feeling at home.
          </p>
        </div>
        <nav aria-label="Store services">
          <p className="eyebrow">A HELPING HAND</p>
          <Link href="/inspiration#planning">Planning tools</Link>
          <Link href="/about#store-information">Store information</Link>
          <Link href="/about#returns">Returns &amp; support</Link>
        </nav>
        <div className="footer-note">
          <p className="eyebrow">MAKE YOURSELF AT HOME</p>
          <p>
            A furniture store demo for exploring, imagining, and finding your
            favourites.
          </p>
          <Link href="/#registration" className="text-link">
            Explore the registration demo {'↗'}
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {year} RAHA. Make room for living.</p>
        <span>Natural inspiration. Everyday beauty.</span>
        <a href="#top">Back to top {'↑'}</a>
      </div>
    </footer>
  )
}
