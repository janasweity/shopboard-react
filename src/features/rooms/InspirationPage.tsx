'use client'

import { inspirationRooms } from '../../data/inspiration.ts'
import RoomSection from './RoomSection.tsx'
import RoomCalculator from './RoomCalculator.tsx'
import {
  entranceDelay,
  useEntranceMotion,
} from '../entrance/entrance-motion.ts'
import { eyebrowClass } from '../../components/shared-classes.ts'
import {
  pageIntroClass,
  pageIntroTextClass,
  pageIntroTitleClass,
} from '../../components/page-intro-classes.ts'
import { cn } from '../../lib/utils.ts'

export default function InspirationPage() {
  const titleMotion = useEntranceMotion('copy', entranceDelay.copy)
  return (
    <>
      <section className={pageIntroClass}>
        <p className={eyebrowClass}>REAL PIECES. EVERYDAY ROOMS.</p>
        <h1
          className={cn(pageIntroTitleClass, titleMotion.className)}
          style={titleMotion.style}
        >
          Room Inspiration
        </h1>
        <p className={pageIntroTextClass}>
          Three simple spaces, built around pieces from our catalogue. Find your
          room, then explore the exact colours and finishes below.
        </p>
        <nav
          className="mt-6 flex flex-wrap gap-4 text-xs leading-body"
          aria-label="Room sections"
        >
          {inspirationRooms.map((room) => (
            <a key={room.id} href={'#' + room.id}>
              {room.name} {'↓'}
            </a>
          ))}
        </nav>
      </section>
      {inspirationRooms.map((room, index) => (
        <RoomSection key={room.id} room={room} position={index + 1} />
      ))}
      <RoomCalculator />
    </>
  )
}
