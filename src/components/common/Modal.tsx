import { useEffect } from 'react'
import type { ReactNode } from 'react'
import styles from './Modal.module.css'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
  maxWidth?: number
}

export function Modal({ title, onClose, children, maxWidth = 380 }: ModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        style={{ maxWidth }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
