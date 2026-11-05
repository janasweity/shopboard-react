import { handleRouteClick } from '../app/navigation.ts'
import StatusMessage from '../components/StatusMessage.tsx'
import {
  entranceDelay,
  useEntranceMotion,
} from '../features/entrance/entrance-motion.ts'

interface Props {
  readonly heading?: string
}

export default function NotFoundPage({
  heading = 'A little off the beaten path.',
}: Props) {
  const titleMotion = useEntranceMotion('copy', entranceDelay.copy)
  return (
    <section className="page-intro">
      <p className="eyebrow">RAHA / HOME &amp; LIVING</p>
      <h1 className={titleMotion.className} style={titleMotion.style}>
        {heading}
      </h1>
      <StatusMessage
        kind="empty"
        message="We could not find that page. Make yourself at home and explore our featured pieces."
      />
      <a href="/" className="text-link" onClick={handleRouteClick}>
        Back to Home {'\u2197'}
      </a>
    </section>
  )
}
