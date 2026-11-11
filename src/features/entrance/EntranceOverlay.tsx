import type { RefObject } from 'react'
import { Button } from '../../components/ui/button.tsx'

interface Props {
  readonly overlayRef: RefObject<HTMLElement | null>
  readonly skipRef: RefObject<HTMLButtonElement | null>
  onSkip: () => void
}

// The store intro. Its animations are Tailwind tokens (globals.css); with
// reduced motion it is hidden and nothing animates.
export default function EntranceOverlay({
  overlayRef,
  skipRef,
  onSkip,
}: Props) {
  return (
    <section
      ref={overlayRef}
      className="fixed inset-0 z-100 grid animate-intro-curtain place-items-center bg-sand text-ink before:absolute before:bottom-7/100 before:left-1/20 before:h-70 before:w-35 before:bg-botanical before:bg-contain before:bg-center before:bg-no-repeat before:opacity-35 motion-reduce:hidden"
      aria-labelledby="intro-title"
    >
      <div className="w-17/20 max-w-212.5 text-center">
        <p className="animate-intro-kicker text-intro-kicker tracking-intro-kicker">
          MAKE ROOM FOR LIVING
        </p>
        <p
          id="intro-title"
          className="mt-3.25 mb-7.25 flex animate-intro-title flex-col items-center font-heading text-intro-title tracking-intro-title"
        >
          RAHA
          <span className="mt-4 font-body text-xs leading-normal tracking-intro-tag uppercase">
            HOME &amp; LIVING
          </span>
        </p>
        <span
          className="mx-auto block h-px w-3/5 max-w-60 origin-left animate-intro-underline bg-accent"
          aria-hidden="true"
        />
      </div>
      <Button
        ref={skipRef}
        size="lg"
        className="absolute top-6 right-6 gap-1 border-ink px-4.75 py-2.75 text-xs font-normal focus-visible:outline-primary-dark"
        onClick={onSkip}
      >
        Skip intro <span aria-hidden="true">{'↗'}</span>
      </Button>
    </section>
  )
}
