import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge knows Tailwind's default names only. RAHA's names from
// @theme are added, so conflicting classes resolve correctly: rounded-panel
// replaces rounded-pill, and text-caption stays a font size next to a text
// colour instead of being dropped as a second colour.
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
        'dialog',
        'feature',
        'chip',
        'pill',
        'circle',
        'hero',
        'hero-md',
      ],
      text: [
        'brand-tag',
        'hero',
        'slide-title',
        'caption',
        'hint',
        'label',
        'card-title',
        'detail-title',
        'figcaption',
        'intro-kicker',
        'intro-title',
        'eyebrow',
        'action',
        'field-label',
        'footnote',
      ],
      tracking: [
        'brand',
        'brand-tag',
        'caption',
        'label',
        'intro-kicker',
        'intro-title',
        'intro-tag',
        'eyebrow',
      ],
      leading: ['body', 'heading'],
    },
    classGroups: {
      'object-position': [{ object: ['hero', 'hero-md', 'kitchen'] }],
    },
  },
})

// Joins class names and resolves conflicting Tailwind classes.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
