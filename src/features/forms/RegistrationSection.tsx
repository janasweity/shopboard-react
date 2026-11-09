'use client'

import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import FormField from '../../components/FormField.tsx'
import Button from '../../components/Button.tsx'

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
      className="registration-section"
      id="registration"
      aria-labelledby="registration-title"
    >
      <div className="registration-copy">
        <p className="eyebrow">THERE'S ROOM FOR YOU HERE</p>
        <h2 id="registration-title">
          Make yourself
          <br />
          at home.
        </h2>
        <p id="demo-description">
          Try our registration demo. No account is created, and your details are
          never sent or stored. Please use made-up details.
        </p>
        <button
          ref={reopenButton}
          type="button"
          className="reopen-button"
          hidden={open}
          onClick={reopen}
        >
          Reopen demo form
        </button>
        <p id="registration-status" role="status" aria-live="polite">
          {status}
        </p>
      </div>
      <dialog
        open={open}
        id="registration-dialog"
        aria-labelledby="registration-title"
        aria-describedby="demo-description demo-behavior"
      >
        <form
          key={formKey}
          className="registration-form"
          onSubmit={handleSubmit}
        >
          <p className="form-heading">Try the experience</p>
          <FormField id="email" label="Email address">
            <input
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
            <input
              id="password"
              type="password"
              minLength={8}
              required
              autoComplete="off"
              aria-describedby="password-hint"
              placeholder="At least 8 characters"
            />
          </FormField>
          <Button type="submit">
            Try the demo <span aria-hidden="true">{'↗'}</span>
          </Button>
          <p id="demo-behavior">
            Valid entries close this demo form after demo validation only. No
            account is created.
          </p>
        </form>
      </dialog>
    </section>
  )
}
