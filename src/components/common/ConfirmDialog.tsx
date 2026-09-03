import { Modal } from './Modal'
import { TrashIcon } from './icons'
import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Excluir',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel} maxWidth={340}>
      <div className={styles.body}>
        <div className={styles.iconWrap}>
          <TrashIcon className={styles.icon} />
        </div>
        <p className={styles.message}>{message}</p>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Cancelar
        </button>
        <button type="button" className={styles.confirmButton} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
