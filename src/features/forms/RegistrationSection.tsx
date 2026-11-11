'use client'

import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import FormField from '../../components/FormField.tsx'
import { Button } from '../../components/ui/button.tsx'
import { cardVariants } from '../../components/ui/card-variants.ts'
import { InlineDialog } from '../../components/ui/inline-dialog.tsx'
import { Input } from '../../components/ui/input.tsx'
import { cn } from '../../lib/utils.ts'

export default function RegistrationSection() {
  const [open, setOpen] = useState(true)
  const [status, setStatus] = useState('')
  // Changing the key remounts the form, which clears every entered value.
  const [formKey, setFormKey] = useState(0)
  const reopenButton = useRef<HTMLButtonElement>(null)
  const emailInput = useRef<HTMLInputElement>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    // Native required/type/minLength validation runs before submit fires.
    event.preventDefault()
    setOpen(false)
    setFormKey((value) => value + 1)
    setStatus(
      'Successful demo validation only. No account was created; no details were sent or stored.',
    )
    requestAnimationFrame(() => reopenButton.current?.focus())
  }

  function reopen(): void {
    setStatus('')
    setOpen(true)
    requestAnimationFrame(() => emailInput.current?.focus())
  }

  return (
    <section
      className={cn(
        cardVariants({ variant: 'feature', padding: 'xl' }),
        'my-14 grid gap-8 md:grid-cols-2 md:gap-12 xl:gap-24',
      )}
      id="registration"
      aria-labelledby="registration-title"
    >
      <div className="self-center">
        <p className="eyebrow text-charcoal-brown">THERE'S ROOM FOR YOU HERE</p>
        <h2 id="registration-title" className="mt-3.25 mb-4">
          Make yourself
          <br />
          at home.
        </h2>
        <p
          id="demo-description"
          className="max-w-97.5 text-xs leading-body text-charcoal-brown"
        >
          Try our registration demo. No account is created, and your details are
          never sent or stored. Please use made-up details.
        </p>
        <Button
          ref={reopenButton}
          className="mt-4"
          hidden={open}
          onClick={reopen}
        >
          Reopen demo form
        </Button>
        <p id="registration-status" role="status" aria-live="polite">
          {status}
        </p>
      </div>
      {/* Non-modal: the form stays part of the page and traps no focus. */}
      <InlineDialog
        open={open}
        id="registration-dialog"
        aria-labelledby="registration-title"
        aria-describedby="demo-description demo-behavior"
      >
        <form key={formKey} onSubmit={handleSubmit}>
          <p className="mb-5.25 font-heading text-2xl leading-tight">
            Try the experience
          </p>
          <FormField id="email" label="Email address">
            <Input
              ref={emailInput}
              id="email"
              type="email"
              required
              autoComplete="off"
              placeholder="you@example.com"
            />
          </FormField>
          <FormField
            id="password"
            label="Demo password"
            hint="Use 8 or more characters. Never use a real password."
          >
            <Input
              id="password"
              type="password"
              minLength={8}
              required
              autoComplete="off"
              aria-describedby="password-hint"
              placeholder="At least 8 characters"
            />
          </FormField>
          <Button type="submit" className="w-full">
            Try the demo <span aria-hidden="true">{'↗'}</span>
          </Button>
          <p id="demo-behavior" className="mt-4 text-hint text-muted">
            Valid entries close this demo form after demo validation only. No
            account is created.
          </p>
        </form>
      </InlineDialog>
    </section>
  )
}
