import { useState } from 'react'
import type { FormEvent } from 'react'
import { calculateRoomArea } from '../../modules/rooms/rooms.logic.ts'
import Button from '../../components/Button.tsx'
import FormField from '../../components/FormField.tsx'

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
    <section id="planning" className="planner page-section">
      <p className="eyebrow">A GOOD PLACE TO START</p>
      <h2>Plan your room.</h2>
      <p>
        Measure your room to estimate its floor area. Check furniture dimensions
        and leave space for walkways before choosing your layout.
      </p>
      <form id="room-planner" onSubmit={handleSubmit}>
        <FormField id="room-width" label="Width (metres)">
          <input
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
        <FormField id="room-length" label="Length (metres)">
          <input
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
      >
        {area === null
          ? 'Enter your measurements to get started.'
          : `Your room is ${area.toLocaleString('en-US', { maximumFractionDigits: 2 })} m². A good starting point for your layout.`}
      </output>
    </section>
  )
}
