import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../../components/Button.tsx'
import FormField from '../../components/FormField.tsx'

export default function ContactForm() {
  const [status, setStatus] = useState('')
  // A new key remounts the form so every field is cleared after the demo.
  const [formKey, setFormKey] = useState(0)

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    // Native required/type/minLength validation runs first. Nothing is sent.
    event.preventDefault()
    setFormKey((value) => value + 1)
    setStatus(
      'Demo complete. No message was sent and your entries have been cleared.',
    )
  }

  return (
    <form key={formKey} id="contact-form" onSubmit={handleSubmit}>
      <FormField id="contact-name" label="Your name">
        <input id="contact-name" required autoComplete="off" />
      </FormField>
      <FormField id="contact-email" label="Email address">
        <input id="contact-email" type="email" required autoComplete="off" />
      </FormField>
      <FormField id="contact-topic" label="What's on your mind?">
        <select id="contact-topic" required defaultValue="">
          <option value="">Choose a topic</option>
          <option>Product information</option>
          <option>Room planning</option>
          <option>General question</option>
        </select>
      </FormField>
      <FormField
        id="contact-message"
        label="Your message"
        hint="At least 10 characters. This demo will not send your message."
      >
        <textarea
          id="contact-message"
          rows={5}
          required
          minLength={10}
          aria-describedby="contact-message-hint"
        />
      </FormField>
      <Button type="submit">Try contact demo {'↗'}</Button>
      <p id="contact-status" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  )
}
