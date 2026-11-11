// The curved, photo-led band shared by the Home hero and the room slider.
// From 768px the photo sits behind the copy with an ivory fade.

export const heroShellClass =
  'relative isolate -mx-gutter overflow-hidden rounded-hero bg-sand md:flex md:min-h-145 md:items-center md:rounded-hero-md xl:min-h-162.5'

export const heroCopyClass =
  'relative z-2 px-gutter pt-12 pb-8 md:w-51/100 md:pt-16 md:pb-20 xl:w-49/100 xl:pl-26'

export const heroDescriptionClass =
  'mb-6.5 max-w-85 text-sm leading-body text-muted md:max-w-72.5 xl:max-w-77.5'

export const heroFigureClass =
  'relative md:absolute md:inset-y-0 md:right-0 md:left-7/20 md:-z-1 md:after:absolute md:after:inset-0 md:after:bg-linear-to-r/srgb md:after:from-sand md:after:from-0% md:after:via-sand/65 md:after:via-15% md:after:to-transparent md:after:to-43%'

// Add a focal point: heroFocusClass, or object-kitchen for the kitchen photo.
export const heroImageClass = 'h-75 w-full object-cover md:h-full'
export const heroFocusClass = 'object-hero md:object-hero-md'

export const heroCaptionClass =
  'absolute right-6 bottom-5.5 bg-bg/90 px-2.5 py-1.25 text-caption tracking-caption text-ink md:z-1'
