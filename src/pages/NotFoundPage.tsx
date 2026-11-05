import { handleRouteClick } from '../app/navigation.ts'
import StatusMessage from '../components/StatusMessage.tsx'

interface Props {
  readonly heading?: string
}

export default function NotFoundPage({
  heading = 'A little off the beaten path.',
}: Props) {
  return (
    <section className="page-intro">
      <p className="eyebrow">RAHA / HOME &amp; LIVING</p>
      <h1>{heading}</h1>
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
