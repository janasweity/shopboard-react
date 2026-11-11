import { useState } from 'react'
import type { FormEvent } from 'react'
import FormField from '../../components/FormField.tsx'
import { Button } from '../../components/ui/button.tsx'
import { Input } from '../../components/ui/input.tsx'
import { inputClass } from '../../components/ui/input-class.ts'

// The hint and the demo status share the contact section's small muted text.
const noteClass = 'text-sm leading-body text-muted'

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
        <Input id="contact-name" required autoComplete="off" />
      </FormField>
      <FormField id="contact-email" label="Email address">
        <Input id="contact-email" type="email" required autoComplete="off" />
      </FormField>
      {/* The select and text area have no shared component; they use the
          shared Input look. */}
      <FormField id="contact-topic" label="What's on your mind?">
        <select
          id="contact-topic"
          required
          defaultValue=""
          className={inputClass}
        >
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
        hintClassName={noteClass}
      >
        <textarea
          id="contact-message"
          rows={5}
          required
          minLength={10}
          aria-describedby="contact-message-hint"
          className={inputClass}
        />
      </FormField>
      <Button type="submit">Try contact demo {'↗'}</Button>
      <p
        id="contact-status"
        role="status"
        aria-live="polite"
        className={noteClass}
      >
        {status}
      </p>
    </form>
  )
}
