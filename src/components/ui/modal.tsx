'use client'

import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils.ts'
import { Button } from '@/components/ui/button.tsx'
import { cardVariants } from '@/components/ui/card-variants.ts'
import {
  dialogTitleClass,
  modalVariants,
} from '@/components/ui/modal-variants.ts'
import type { ModalSize } from '@/components/ui/modal-variants.ts'

export interface ModalProps {
  readonly open: boolean
  // Asks the parent to set `open` to false: Escape, the close button, or the
  // browser closing the dialog itself. Not called when the parent closes it.
  readonly onClose: () => void
  readonly title: ReactNode
  // Accessible name of the close button, such as "Close cart".
  readonly closeLabel: string
  readonly size?: ModalSize
  readonly id?: string
  readonly 'aria-describedby'?: string
  // Classes for the panel inside the dialog.
  readonly className?: string
  readonly children: ReactNode
}

// A modal dialog: the native showModal() makes the rest of the page inert,
// so keyboard focus stays in the dialog. `open` is owned by the parent, and
// onClose must set it to false. Escape and the close button close the native
// dialog and call onClose. When `open` turns false or the Modal is removed
// while open, the effect's cleanup closes the dialog if it is still open and
// returns focus to the element that was focused when it opened, if that
// element still exists. StrictMode's double run ends with the dialog open.
// For a dialog that stays part of the page, use InlineDialog.
function Modal({
  open,
  onClose,
  title,
  closeLabel,
  size,
  id,
  'aria-describedby': describedBy,
  className,
  children,
}: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useEffect(() => {
    const element = dialog.current
    if (!element || !open) return
    if (!element.open) {
      const active = document.activeElement
      returnFocus.current = active instanceof HTMLElement ? active : null
      element.showModal()
      // A panel taller than the screen scrolls, and Chromium then focuses the
      // panel itself. Start on the close button instead, as when it fits.
      if (document.activeElement === panel.current) closeButton.current?.focus()
    }
    // Runs when `open` turns false, when the Modal is removed while open, and
    // in StrictMode's extra unmount check, which then runs the effect again
    // and reopens the dialog with the same opener.
    return () => {
      if (element.open) element.close()
      const target = returnFocus.current
      returnFocus.current = null
      if (target?.isConnected) target.focus()
    }
  }, [open])

  // The close button closes the native dialog at once, so the page is never
  // inert while the parent already treats it as closed.
  function requestClose(): void {
    dialog.current?.close()
    onClose()
  }

  // Escape: the browser closes the dialog right after this event. The native
  // close event comes later, so the parent is told here.
  function handleCancel(): void {
    onClose()
  }

  // Any other native close (none in RAHA today) is reported too. The event
  // arrives late (about 200ms in Chromium), so it is ignored if the parent has
  // already set open to false, the dialog has been opened again since, or
  // the Modal has been removed.
  function handleNativeClose(): void {
    const element = dialog.current
    if (open && element && !element.open) onClose()
  }

  return (
    <dialog
      ref={dialog}
      id={id}
      aria-labelledby={titleId}
      aria-describedby={describedBy}
      onCancel={handleCancel}
      onClose={handleNativeClose}
      className="m-0 size-full max-h-none max-w-none place-items-center bg-transparent p-4 open:grid backdrop:bg-soft-black/45 backdrop:backdrop-blur-xs"
    >
      <div
        ref={panel}
        className={cn(
          cardVariants({ variant: 'surface' }),
          'rounded-dialog',
          modalVariants({ size }),
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id={titleId} className={dialogTitleClass}>
            {title}
          </h2>
          <Button
            ref={closeButton}
            variant="ghost"
            size="icon"
            aria-label={closeLabel}
            onClick={requestClose}
          >
            <span aria-hidden="true">{'×'}</span>
          </Button>
        </div>
        {children}
      </div>
    </dialog>
  )
}

export { Modal }
