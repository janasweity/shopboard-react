import { z } from 'zod'

// Every checkout validation rule lives here. The form only displays the
// messages; nothing is sent, stored or charged.
export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Enter your full name, at least 2 characters.')
    .max(80, 'Use 80 characters or fewer for your name.'),
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address.')
    .pipe(z.email('Enter an email address like name@example.com.')),
  address: z
    .string()
    .trim()
    .min(5, 'Enter your street address, at least 5 characters.')
    .max(120, 'Use 120 characters or fewer for your address.'),
  city: z
    .string()
    .trim()
    .min(2, 'Enter your city.')
    .max(60, 'Use 60 characters or fewer for your city.'),
  postalCode: z
    .string()
    .trim()
    .regex(
      /^[A-Za-z0-9][A-Za-z0-9 -]{1,8}[A-Za-z0-9]$/,
      'Enter a postal code of 3 to 10 letters or numbers.',
    ),
  demoConfirmed: z
    .boolean()
    .refine(
      (value) => value,
      'Confirm that you understand this is a demo order.',
    ),
})

export type CheckoutInput = z.input<typeof checkoutSchema>
export type CheckoutValues = z.output<typeof checkoutSchema>
