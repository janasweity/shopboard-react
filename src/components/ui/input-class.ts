// RAHA's shared field look, used by Input and by native selects and text
// areas that need the same look. The text inherits the surrounding font, the
// placeholder keeps the browser grey from the base layer, and the focus ring
// comes from the global :focus-visible rule. aria-invalid gives a 2px ink
// border.
export const inputClass =
  'min-h-11 w-full min-w-0 rounded-field border border-input bg-background p-3 text-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-2 aria-invalid:border-destructive'
