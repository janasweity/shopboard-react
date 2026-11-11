'use client'

import Link from 'next/link'
import StatusMessage from '../../components/StatusMessage.tsx'
import {
  pageIntroClass,
  pageIntroTitleClass,
} from '../../components/page-intro-classes.ts'
import { cn } from '../../lib/utils.ts'
import {
  entranceDelay,
  useEntranceMotion,
} from '../entrance/entrance-motion.ts'

interface Props {
  readonly heading?: string
}

export default function NotFoundPage({
  heading = 'A little off the beaten path.',
}: Props) {
  const titleMotion = useEntranceMotion('copy', entranceDelay.copy)
  return (
    <section className={pageIntroClass}>
      <p className="eyebrow">RAHA / HOME &amp; LIVING</p>
      <h1
        className={cn(pageIntroTitleClass, titleMotion.className)}
        style={titleMotion.style}
      >
        {heading}
      </h1>
      <StatusMessage
        kind="empty"
        message="We could not find that page. Make yourself at home and explore our featured pieces."
      />
      <Link href="/" className="text-link">
        Back to Home {'\u2197'}
      </Link>
    </section>
  )
}
