import Link from 'next/link'
import { cn } from '../../lib/utils.ts'
import { brandClass, brandTagClass } from './brand-classes.ts'
import { eyebrowClass, textLinkClass } from '../../components/shared-classes.ts'

interface Props {
  readonly year: number
}

const serviceLinkClass = 'hover:underline hover:underline-offset-4'

// The footer is a dark band in both colour modes, so it uses fixed palette
// colours instead of roles, and its focus ring is soft white.
export default function SiteFooter({ year }: Props) {
  return (
    <footer className="mt-8 border-t-4 border-accent bg-charcoal-brown px-gutter pt-10 pb-4 text-soft-white **:focus-visible:outline-soft-white">
      <div className="grid grid-cols-2 gap-x-4.75 gap-y-8 md:grid-cols-footer xl:grid-cols-footer-wide xl:gap-12">
        <div className="col-span-full md:col-auto">
          <Link className={cn(brandClass, 'bg-sand px-4 py-3.25')} href="/">
            <span>
              RAHA <small className={brandTagClass}>HOME &amp; LIVING</small>
            </span>
          </Link>
          <p className="mt-4 text-xs leading-body text-silver-mist">
            Considered pieces.
            <br />A little more feeling at home.
          </p>
        </div>
        <nav
          aria-label="Store services"
          className="flex flex-col items-start gap-2 text-xs leading-body"
        >
          <p className={cn(eyebrowClass, 'mb-2.5 text-silver-mist')}>
            A HELPING HAND
          </p>
          <Link className={serviceLinkClass} href="/inspiration#planning">
            Planning tools
          </Link>
          <Link className={serviceLinkClass} href="/about#store-information">
            Store information
          </Link>
          <Link className={serviceLinkClass} href="/about#returns">
            Returns &amp; support
          </Link>
        </nav>
        <div className="col-span-full xl:col-auto">
          <p className={cn(eyebrowClass, 'mb-2.5 text-silver-mist')}>
            MAKE YOURSELF AT HOME
          </p>
          <p className="max-w-70 text-xs leading-body text-silver-mist">
            A furniture store demo for exploring, imagining, and finding your
            favourites.
          </p>
          <Link
            href="/#registration"
            className={cn(textLinkClass, 'text-soft-white')}
          >
            Explore the registration demo {'↗'}
          </Link>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap justify-between gap-2.75 border-t border-line pt-4 text-2xs text-silver-mist">
        <p>&copy; {year} RAHA. Make room for living.</p>
        <span>Natural inspiration. Everyday beauty.</span>
        <a href="#top">Back to top {'↑'}</a>
      </div>
    </footer>
  )
}
