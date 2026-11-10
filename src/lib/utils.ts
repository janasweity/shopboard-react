import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge knows Tailwind's default radius names only. RAHA's names from
// @theme are added, so a className such as rounded-panel replaces rounded-pill.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: [
        'thumb',
        'field',
        'md',
        'control',
        'card',
        'panel',
        'photo',
        'dialog',
        'feature',
        'chip',
        'pill',
        'circle',
      ],
    },
  },
})

// Joins class names and resolves conflicting Tailwind classes.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
