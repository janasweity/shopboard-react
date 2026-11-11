'use client'

import Link from 'next/link'
import { buttonVariants } from '../../components/ui/button-variants.ts'
import { cn } from '../../lib/utils.ts'
import {
  entranceDelay,
  useEntranceMotion,
} from '../entrance/entrance-motion.ts'
import {
  heroCaptionClass,
  heroCopyClass,
  heroDescriptionClass,
  heroFigureClass,
  heroFocusClass,
  heroImageClass,
  heroShellClass,
} from './hero-classes.ts'
import { eyebrowClass } from '../../components/shared-classes.ts'

interface Props {
  readonly image: string
  readonly alt: string
}

export default function Hero({ image, alt }: Props) {
  const imageMotion = useEntranceMotion('hero', entranceDelay.hero)
  const titleMotion = useEntranceMotion('copy', entranceDelay.copy)
  return (
    <section className={heroShellClass} id="hero" aria-labelledby="hero-title">
      <div className={heroCopyClass}>
        <p className={eyebrowClass}>RAHA / THE CONSIDERED HOME</p>
        <h1
          id="hero-title"
          className={cn('my-4.5 xl:text-hero', titleMotion.className)}
          style={titleMotion.style}
        >
          Beautiful pieces.
          <br />A home that
          <br />
          <em className="text-primary">feels like you.</em>
        </h1>
        <p className={heroDescriptionClass}>
          Considered furniture, warm textures, and little details that bring
          your everyday into balance.
        </p>
        <Link href="/products" className={buttonVariants()}>
          Explore the collection <span aria-hidden="true">{'↗'}</span>
        </Link>
        <p className="mt-6 text-2xs tracking-wider text-muted">
          Thoughtfully chosen. Naturally at home.
        </p>
      </div>
      <figure className={heroFigureClass}>
        <img
          src={image}
          alt={alt}
          width={1400}
          height={1000}
          fetchPriority="high"
          decoding="async"
          className={cn(heroImageClass, heroFocusClass, imageMotion.className)}
          style={imageMotion.style}
        />
        <figcaption className={heroCaptionClass}>
          RAHA / HOME &amp; LIVING
        </figcaption>
      </figure>
    </section>
  )
}
