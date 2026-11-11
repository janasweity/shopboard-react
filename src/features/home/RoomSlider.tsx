'use client'

import { useState } from 'react'
import type { heroSlides } from '../../data/hero-slides.ts'
import Link from 'next/link'
import { toAppHref } from '../../lib/routes.ts'
import { cn } from '../../lib/utils.ts'
import { buttonVariants } from '../../components/ui/button-variants.ts'
import StatusMessage from '../../components/StatusMessage.tsx'
import { slideTitleLines } from './slide-title.ts'
import {
  heroCaptionClass,
  heroCopyClass,
  heroDescriptionClass,
  heroFigureClass,
  heroFocusClass,
  heroImageClass,
  heroShellClass,
} from './hero-classes.ts'

interface Props {
  readonly slides: readonly (typeof heroSlides)[number][]
}

// The room choices are toggle chips (aria-pressed), not call-to-action
// buttons, so they are not the shared Button.
const roomChipClass =
  'inline-flex min-h-11 items-center justify-center rounded-chip border border-stone-grey bg-soft-white px-3.5 py-2.25 text-xs text-charcoal-brown hover:border-soft-black aria-pressed:border-charcoal-brown aria-pressed:bg-charcoal-brown aria-pressed:text-soft-white'

export default function RoomSlider({ slides }: Props) {
  const [activeId, setActiveId] = useState(slides[0]?.id || '')
  const slide = slides.find((item) => item.id === activeId) || slides[0]
  if (!slide) return null
  const titleLines = slideTitleLines[slide.id]
  return (
    <section
      className={cn(heroShellClass, 'page-section')}
      id="room-inspiration"
      data-slide={slide.id}
      aria-labelledby="room-slider-title"
    >
      <div className={heroCopyClass}>
        <p className="eyebrow">{slide.eyebrow}</p>
        <h2 id="room-slider-title" className="text-slide-title">
          {titleLines
            ? titleLines.map((line) => (
                <span className="block" key={line.id}>
                  {line.emphasis ? <em>{line.text}</em> : line.text}
                </span>
              ))
            : slide.label}
        </h2>
        <p className={heroDescriptionClass}>{slide.description}</p>
        <Link href={toAppHref(slide.href)} className={buttonVariants()}>
          Explore the look <span aria-hidden="true">{'↗'}</span>
        </Link>
        <div
          className="mt-5.5 flex flex-wrap gap-2"
          role="group"
          aria-label="Choose a room"
        >
          {slides.map((item) => (
            <button
              key={item.id}
              type="button"
              className={roomChipClass}
              aria-controls="room-inspiration"
              aria-pressed={slide.id === item.id}
              onClick={() => setActiveId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <StatusMessage
          className="sr-only"
          kind="success"
          message={slide.label + ' inspiration selected.'}
        />
      </div>
      <figure className={heroFigureClass}>
        <img
          src={slide.room.image}
          alt={slide.room.alt}
          width={slide.id === 'kitchen' ? 1672 : 1536}
          height={slide.id === 'kitchen' ? 941 : 1024}
          loading="lazy"
          decoding="async"
          className={cn(
            heroImageClass,
            slide.id === 'kitchen' ? 'object-kitchen' : heroFocusClass,
          )}
        />
        <figcaption className={heroCaptionClass}>
          {slide.label.toUpperCase()} / RAHA
        </figcaption>
      </figure>
    </section>
  )
}
