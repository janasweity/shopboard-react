import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../../components/Button.tsx'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../../components/ui/field.tsx'
import { Input } from '../../components/ui/input.tsx'
import { checkoutSchema } from './checkout-schema.ts'
import type { CheckoutInput, CheckoutValues } from './checkout-schema.ts'

interface Props {
  // Called after valid input. The values are not passed on, sent or stored.
  onConfirmed: () => void
}

interface TextField {
  readonly name: Exclude<keyof CheckoutInput, 'demoConfirmed'>
  readonly id: string
  readonly label: string
  readonly type: 'text' | 'email'
  readonly autoComplete: string
}

const textFields: readonly TextField[] = [
  {
    name: 'fullName',
    id: 'checkout-full-name',
    label: 'Full name',
    type: 'text',
    autoComplete: 'name',
  },
  {
    name: 'email',
    id: 'checkout-email',
    label: 'Email address',
    type: 'email',
    autoComplete: 'email',
  },
  {
    name: 'address',
    id: 'checkout-address',
    label: 'Street address',
    type: 'text',
    autoComplete: 'street-address',
  },
  {
    name: 'city',
    id: 'checkout-city',
    label: 'City',
    type: 'text',
    autoComplete: 'address-level2',
  },
  {
    name: 'postalCode',
    id: 'checkout-postal-code',
    label: 'Postal code',
    type: 'text',
    autoComplete: 'postal-code',
  },
]

export const firstCheckoutFieldId = 'checkout-full-name'

export default function CheckoutForm({ onConfirmed }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput, unknown, CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    // Errors appear after a field is left or the form is submitted, then
    // update while typing. On submit, focus moves to the first invalid field.
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      demoConfirmed: false,
    },
  })
  const confirmError = errors.demoConfirmed?.message

  return (
    <form
      className="checkout-form"
      // Zod checks every field, so the browser's own messages are turned off.
      noValidate
      onSubmit={(event) => void handleSubmit(() => onConfirmed())(event)}
    >
      <FieldGroup>
        <FieldDescription id="checkout-required">
          All fields are required. This demo does not send or save them.
        </FieldDescription>
        {textFields.map((field) => {
          const error = errors[field.name]?.message
          return (
            <Field key={field.name} data-invalid={error ? true : undefined}>
              <FieldLabel htmlFor={field.id}>{field.label}</FieldLabel>
              <Input
                id={field.id}
                type={field.type}
                autoComplete={field.autoComplete}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? field.id + '-error' : undefined}
                {...register(field.name)}
              />
              <FieldError id={field.id + '-error'}>{error}</FieldError>
            </Field>
          )
        })}
        <Field
          orientation="horizontal"
          data-invalid={confirmError ? true : undefined}
        >
          <input
            id="checkout-demo-confirmed"
            type="checkbox"
            aria-invalid={confirmError ? true : undefined}
            aria-describedby={
              confirmError ? 'checkout-demo-confirmed-error' : undefined
            }
            {...register('demoConfirmed')}
          />
          <FieldLabel htmlFor="checkout-demo-confirmed">
            I understand this is a demo. No order is placed, no payment is taken
            and nothing I enter is sent.
          </FieldLabel>
        </Field>
        <FieldError id="checkout-demo-confirmed-error">
          {confirmError}
        </FieldError>
        <Button type="submit">Confirm demo order</Button>
      </FieldGroup>
    </form>
  )
}
