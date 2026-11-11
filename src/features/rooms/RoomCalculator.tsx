import { useState } from 'react'
import type { FormEvent } from 'react'
import { calculateRoomArea } from '../../modules/rooms/rooms.logic.ts'
import FormField from '../../components/FormField.tsx'
import { Button } from '../../components/ui/button.tsx'
import { cardVariants } from '../../components/ui/card-variants.ts'
import { Input } from '../../components/ui/input.tsx'
import { cn } from '../../lib/utils.ts'
import { eyebrowClass } from '../../components/shared-classes.ts'

// Each field grows from a 140px basis, so the two fields and the button sit
// on one row when there is room and wrap below it otherwise.
const fieldClass = 'grow basis-35'

export default function RoomCalculator() {
  const [width, setWidth] = useState('')
  const [length, setLength] = useState('')
  const [area, setArea] = useState<number | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const w = Number(width)
    const l = Number(length)
    // Native min/max/step validation runs first; this guards odd input.
    if (!Number.isFinite(w) || !Number.isFinite(l) || w <= 0 || l <= 0) return
    setArea(calculateRoomArea(w, l))
  }

  return (
    // The panel's 1.5rem padding, with the page sections' taller vertical
    // padding from 768px (4.5rem, then 5rem), as before.
    <section id="planning" className={cn(cardVariants(), 'md:py-18 xl:py-20')}>
      <p className={eyebrowClass}>A GOOD PLACE TO START</p>
      <h2 className="my-4">Plan your room.</h2>
      <p>
        Measure your room to estimate its floor area. Check furniture dimensions
        and leave space for walkways before choosing your layout.
      </p>
      <form
        id="room-planner"
        className="my-6 flex flex-wrap items-end gap-4"
        onSubmit={handleSubmit}
      >
        <FormField
          id="room-width"
          label="Width (metres)"
          className={fieldClass}
        >
          <Input
            id="room-width"
            type="number"
            min="0.5"
            max="50"
            step="0.1"
            required
            placeholder="4.0"
            value={width}
            onChange={(event) => setWidth(event.currentTarget.value)}
          />
        </FormField>
        <FormField
          id="room-length"
          label="Length (metres)"
          className={fieldClass}
        >
          <Input
            id="room-length"
            type="number"
            min="0.5"
            max="50"
            step="0.1"
            required
            placeholder="5.0"
            value={length}
            onChange={(event) => setLength(event.currentTarget.value)}
          />
        </FormField>
        <Button type="submit">Calculate room area {'↗'}</Button>
      </form>
      <output
        id="room-area"
        htmlFor="room-width room-length"
        aria-live="polite"
        className="block py-4"
      >
        {area === null
          ? 'Enter your measurements to get started.'
          : `Your room is ${area.toLocaleString('en-US', { maximumFractionDigits: 2 })} m². A good starting point for your layout.`}
      </output>
    </section>
  )
}
