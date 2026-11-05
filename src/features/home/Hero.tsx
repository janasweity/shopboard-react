import { handleRouteClick } from '../../app/navigation.ts'
import {
  entranceDelay,
  useEntranceMotion,
} from '../entrance/entrance-motion.ts'

interface Props {
  readonly image: string
  readonly alt: string
}

export default function Hero({ image, alt }: Props) {
  const imageMotion = useEntranceMotion('hero', entranceDelay.hero)
  const titleMotion = useEntranceMotion('copy', entranceDelay.copy)
  return (
    <section className="hero home-hero" id="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">RAHA / THE CONSIDERED HOME</p>
        <h1
          id="hero-title"
          className={titleMotion.className}
          style={titleMotion.style}
        >
          Beautiful pieces.
          <br />A home that
          <br />
          <em>feels like you.</em>
        </h1>
        <p className="hero-description">
          Considered furniture, warm textures, and little details that bring
          your everyday into balance.
        </p>
        <a
          href="/?page=products"
          className="button hero-cta"
          onClick={handleRouteClick}
        >
          Explore the collection <span aria-hidden="true">{'\u2197'}</span>
        </a>
        <p className="hero-footnote">Thoughtfully chosen. Naturally at home.</p>
      </div>
      <figure>
        <img
          src={image}
          alt={alt}
          width={1400}
          height={1000}
          fetchPriority="high"
          decoding="async"
          className={imageMotion.className}
          style={imageMotion.style}
        />
        <figcaption>RAHA / HOME &amp; LIVING</figcaption>
      </figure>
    </section>
  )
}
