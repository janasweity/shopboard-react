import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from 'react'
import type { CSSProperties } from 'react'

// Holds the time the intro started (performance.now()), or null when no intro
// is playing. Provided by AppShell from useEntrance.
export const EntranceContext = createContext<number | null>(null)

// During hydration React reads the server snapshot (true); later client
// renders read false. Nothing changes over time, so there is no subscription.
const noSubscribe = () => () => {}
const isClient = () => false
const isServer = () => true

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
  // starts takes part: here, content rendered on the server, which the intro
  // reveals after hydration. Content that mounts later in the browser appears
  // normally. The value is kept from the first render.
  const hydrating = useSyncExternalStore(noSubscribe, isClient, isServer)
  const [fromServer] = useState(hydrating)
  if (startedAt === null || !fromServer) {
    return { className: undefined, style: undefined }
  }
  // When the intro stops, startedAt becomes null and the class is removed,
  // so the content is shown at once.
  return {
    className: 'entrance-' + kind,
    style: { '--entrance-delay': delayMs + 'ms' },
  }
}
