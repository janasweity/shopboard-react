import { handleRouteClick } from '../../app/navigation.ts'

interface Props {
  readonly year: number
}

export default function SiteFooter({ year }: Props) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-intro">
          <a className="footer-brand brand" href="/" onClick={handleRouteClick}>
            <span>
              RAHA <small>HOME &amp; LIVING</small>
            </span>
          </a>
          <p>
            Considered pieces.
            <br />A little more feeling at home.
          </p>
        </div>
        <nav aria-label="Store services">
          <p className="eyebrow">A HELPING HAND</p>
          <a href="/?page=inspiration#planning" onClick={handleRouteClick}>
            Planning tools
          </a>
          <a href="/?page=about#store-information" onClick={handleRouteClick}>
            Store information
          </a>
          <a href="/?page=about#returns" onClick={handleRouteClick}>
            Returns &amp; support
          </a>
        </nav>
        <div className="footer-note">
          <p className="eyebrow">MAKE YOURSELF AT HOME</p>
          <p>
            A furniture store demo for exploring, imagining, and finding your
            favourites.
          </p>
          <a
            href="/#registration"
            className="text-link"
            onClick={handleRouteClick}
          >
            Explore the registration demo {'\u2197'}
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {year} RAHA. Make room for living.</p>
        <span>Natural inspiration. Everyday beauty.</span>
        <a href="#top">Back to top {'\u2191'}</a>
      </div>
    </footer>
  )
}
