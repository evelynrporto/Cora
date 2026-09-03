import { useState } from 'react'
import type { FormEvent } from 'react'
import { brlToNumber, centsToBRL, numberToBRLDigits } from '../../lib/currencyMask'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { DatePicker } from '../common/DatePicker'
import { Field } from '../common/Field'
import { Modal } from '../common/Modal'
import { Select } from '../common/Select'
import { IconPicker } from './IconPicker'
import type { TransactionData, TransactionIconType } from './types'
import styles from './TransactionEditModal.module.css'

const categoryOptions = [
  'Alimentação',
  'Assinatura',
  'Transporte',
  'Beleza',
  'Compras',
  'Lazer',
  'Saúde',
  'Moradia',
  'Outros',
]

interface TransactionEditModalProps {
  transaction: TransactionData
  isNew?: boolean
  onSave: (transaction: TransactionData) => void
  onDelete?: (id: string) => void
  onClose: () => void
}

export function TransactionEditModal({
  transaction,
  isNew = false,
  onSave,
  onDelete,
  onClose,
}: TransactionEditModalProps) {
  const [title, setTitle] = useState(transaction.title)
  const [category, setCategory] = useState(transaction.category)
  const [amountDigits, setAmountDigits] = useState(
    numberToBRLDigits(transaction.amount),
  )
  const [date, setDate] = useState(transaction.date)
  const [isRecurring, setIsRecurring] = useState(
    transaction.isRecurring ?? false,
  )
  const [icon, setIcon] = useState<TransactionIconType>(transaction.icon)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const categories = categoryOptions.includes(category)
    ? categoryOptions
    : [category, ...categoryOptions]

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSave({
      ...transaction,
      title: title.trim() || transaction.title,
      category,
      amount: brlToNumber(centsToBRL(amountDigits)),
      date,
      isRecurring,
      icon,
    })
  }

  return (
    <Modal title={isNew ? 'Novo gasto' : 'Editar gasto'} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Field label="Título" as="label">
          <input
            className={styles.input}
            type="text"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </Field>

        <Field label="Categoria">
          <Select
            ariaLabel="Categoria"
            options={categories.map((option) => ({
              value: option,
              label: option,
            }))}
            value={category}
            onChange={setCategory}
          />
        </Field>

        <div className={styles.row}>
          <Field label="Valor" as="label" className={styles.rowField}>
            <input
              className={styles.input}
              type="text"
              inputMode="decimal"
              value={centsToBRL(amountDigits)}
              onChange={(event) =>
                setAmountDigits(event.target.value.replace(/\D/g, ''))
              }
            />
          </Field>

          <Field label="Data" className={styles.rowField}>
            <DatePicker ariaLabel="Data" value={date} onChange={setDate} />
          </Field>
        </div>

        <Field label="Ícone">
          <IconPicker ariaLabel="Ícone" value={icon} onChange={setIcon} />
        </Field>

        <div className={styles.toggleField}>
          <span className={styles.toggleLabel}>Recorrente</span>
          <button
            type="button"
            role="switch"
            aria-checked={isRecurring}
            aria-label="Recorrente"
            className={`${styles.toggle} ${isRecurring ? styles.toggleOn : ''}`}
            onClick={() => setIsRecurring((value) => !value)}
          >
            <span className={styles.toggleThumb} />
          </button>
        </div>

        <div className={styles.actions}>
          {isNew ? (
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
          ) : (
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => setIsConfirmingDelete(true)}
            >
              Excluir
            </button>
          )}
          <button type="submit" className={styles.saveButton}>
            {isNew ? 'Adicionar' : 'Salvar'}
          </button>
        </div>
      </form>

      {isConfirmingDelete && (
        <ConfirmDialog
          title="Excluir gasto"
          message="Tem certeza que deseja excluir este gasto? Essa ação não pode ser desfeita."
          onCancel={() => setIsConfirmingDelete(false)}
          onConfirm={() => {
            setIsConfirmingDelete(false)
            onDelete?.(transaction.id)
            onClose()
          }}
        />
      )}
    </Modal>
  )
}
