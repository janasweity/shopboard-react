'use client'

import { useState } from 'react'
import type { heroSlides } from '../../data/hero-slides.ts'
import Link from 'next/link'
import { toAppHref } from '../../lib/routes.ts'
import Button from '../../components/Button.tsx'
import StatusMessage from '../../components/StatusMessage.tsx'
import { slideTitleLines } from './slide-title.ts'

interface Props {
  readonly slides: readonly (typeof heroSlides)[number][]
}

export default function RoomSlider({ slides }: Props) {
  const [activeId, setActiveId] = useState(slides[0]?.id || '')
  const slide = slides.find((item) => item.id === activeId) || slides[0]
  if (!slide) return null
  const titleLines = slideTitleLines[slide.id]
  return (
    <section
      className="room-slider page-section"
      id="room-inspiration"
      data-slide={slide.id}
      aria-labelledby="room-slider-title"
    >
      <div className="hero-copy">
        <p className="eyebrow">{slide.eyebrow}</p>
        <h2 id="room-slider-title">
          {titleLines
            ? titleLines.map((line) => (
                <span className="slide-title-line" key={line.id}>
                  {line.emphasis ? <em>{line.text}</em> : line.text}
                </span>
              ))
            : slide.label}
        </h2>
        <p className="hero-description">{slide.description}</p>
        <Link href={toAppHref(slide.href)} className="button hero-cta">
          Explore the look <span aria-hidden="true">{'\u2197'}</span>
        </Link>
        <div className="hero-controls" role="group" aria-label="Choose a room">
          {slides.map((item) => (
            <Button
              key={item.id}
              aria-controls="room-inspiration"
              aria-pressed={slide.id === item.id}
              onClick={() => setActiveId(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <StatusMessage
          className="visually-hidden"
          kind="success"
          message={slide.label + ' inspiration selected.'}
        />
      </div>
      <figure>
        <img
          src={slide.room.image}
          alt={slide.room.alt}
          width={slide.id === 'kitchen' ? 1672 : 1536}
          height={slide.id === 'kitchen' ? 941 : 1024}
          loading="lazy"
          decoding="async"
        />
        <figcaption>{slide.label.toUpperCase()} / RAHA</figcaption>
      </figure>
    </section>
  )
}
