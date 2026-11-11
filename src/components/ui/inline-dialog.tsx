import { useId } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils.ts'
import { cardVariants } from '@/components/ui/card-variants.ts'
import { dialogTitleClass } from '@/components/ui/modal-variants.ts'

type InlineDialogLabel =
  // A title rendered inside the dialog, or the ID of a heading outside it.
  | { readonly title: ReactNode; readonly 'aria-labelledby'?: never }
  | { readonly title?: never; readonly 'aria-labelledby': string }

export type InlineDialogProps = Omit<
  ComponentProps<'dialog'>,
  'open' | 'title' | 'aria-labelledby'
> & { readonly open: boolean } & InlineDialogLabel

// A non-modal dialog shown in the page flow. It does not trap focus, close
// on Escape or move focus: the page around it stays usable, and the owner
// decides where focus goes. For a dialog that traps focus, use Modal.
function InlineDialog({
  open,
  title,
  'aria-labelledby': labelledBy,
  className,
  children,
  ...props
}: InlineDialogProps) {
  const titleId = useId()
  return (
    <dialog
      {...props}
      open={open}
      aria-labelledby={title === undefined ? labelledBy : titleId}
      className={cn(
        cardVariants({ variant: 'surface' }),
        'static m-0 w-full',
        className,
      )}
    >
      {title === undefined ? null : (
        <h2 id={titleId} className={dialogTitleClass}>
          {title}
        </h2>
      )}
      {children}
    </dialog>
  )
}

export { InlineDialog }
