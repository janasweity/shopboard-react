import { createContext, useContext, useState } from 'react'
import type { CSSProperties } from 'react'

// Holds the time the intro started (performance.now()), or null when no intro
// is playing. Provided by App from useEntrance.
export const EntranceContext = createContext<number | null>(null)

// Original RAHA timings: content arrives as the intro curtain lifts.
export const entranceDelay = {
  hero: 2100,
  copy: 2350,
  search: 2450,
  card: (position: number) => 2550 + Math.min(position, 11) * 50,
}

type EntranceStyle = CSSProperties & { '--entrance-delay': string }

interface EntranceMotion {
  readonly className: string | undefined
  readonly style: EntranceStyle | undefined
}

export function useEntranceMotion(
  kind: 'hero' | 'copy' | 'search' | 'card',
  delayMs: number,
): EntranceMotion {
  const startedAt = useContext(EntranceContext)
  // As in the original, only content already on the page when the intro
  // starts takes part; content that mounts later (for example catalogue cards
  // loaded from the API) appears normally.
  const [mountedAt] = useState(() => performance.now())
  if (startedAt === null || mountedAt > startedAt) {
    return { className: undefined, style: undefined }
  }
  // When the intro stops, startedAt becomes null and the class is removed,
  // so the content is shown at once.
  return {
    className: 'entrance-' + kind,
    style: { '--entrance-delay': delayMs + 'ms' },
  }
}

export const joinClasses = (...names: (string | undefined)[]): string =>
  names.filter(Boolean).join(' ')
