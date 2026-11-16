import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Icon } from './Icon'

interface ModalProps {
  children: ReactNode
  titleId: string
  onClose: () => void
  className?: string
}

export function Modal({ children, titleId, onClose, className = '' }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    const previous = document.activeElement as HTMLElement | null
    dialog?.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      previous?.focus()
    }
  }, [])
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={`modal ${className}`}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect()
          if (
            event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom
          ) onClose()
        }
      }}
    >
      <button className="icon-button modal-close" aria-label="Close dialog" onClick={onClose}>
        <Icon name="close" />
      </button>
      {children}
    </dialog>
  )
}
