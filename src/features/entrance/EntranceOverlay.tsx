import type { RefObject } from 'react'

interface Props {
  readonly overlayRef: RefObject<HTMLElement | null>
  readonly skipRef: RefObject<HTMLButtonElement | null>
  onSkip: () => void
}

export default function EntranceOverlay({
  overlayRef,
  skipRef,
  onSkip,
}: Props) {
  return (
    <section
      ref={overlayRef}
      className="store-intro is-playing"
      aria-labelledby="intro-title"
    >
      <div className="intro-brand">
        <p className="intro-kicker">MAKE ROOM FOR LIVING</p>
        <p id="intro-title">
          RAHA<span>HOME &amp; LIVING</span>
        </p>
        <span className="intro-line" aria-hidden="true" />
      </div>
      <button
        ref={skipRef}
        type="button"
        className="skip-intro"
        onClick={onSkip}
      >
        Skip intro <span aria-hidden="true">{'↗'}</span>
      </button>
    </section>
  )
}
