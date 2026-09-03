import { useState } from 'react'
import type { FormEvent } from 'react'
import { brlToNumber, centsToBRL, numberToBRLDigits } from '../../lib/currencyMask'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { Field } from '../common/Field'
import { Modal } from '../common/Modal'
import { Select } from '../common/Select'
import type { CardColorway } from '../../theme/colors'
import { CardColorPicker } from './CardColorPicker'
import { CreditCard } from './CreditCard'
import type { CardData } from './types'
import styles from './CardEditModal.module.css'

const cardTypeOptions = [
  { value: 'Crédito', label: 'Crédito' },
  { value: 'Débito', label: 'Débito' },
]

interface CardEditModalProps {
  card: CardData
  isNew?: boolean
  onSave: (card: CardData) => void
  onDelete?: (id: string) => void
  onClose: () => void
}

export function CardEditModal({
  card,
  isNew = false,
  onSave,
  onDelete,
  onClose,
}: CardEditModalProps) {
  const [bankName, setBankName] = useState(card.bankName)
  const [cardType, setCardType] = useState<CardData['cardType']>(card.cardType)
  const [lastDigits, setLastDigits] = useState(card.lastDigits)
  const [limitDigits, setLimitDigits] = useState(
    numberToBRLDigits(card.availableLimit),
  )
  const [colorway, setColorway] = useState<CardColorway>(card.colorway)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const previewCard: CardData = {
    id: card.id,
    bankName: bankName.trim() || 'Nome do banco',
    cardType,
    lastDigits: lastDigits.padEnd(4, '•'),
    availableLimit: brlToNumber(centsToBRL(limitDigits)),
    colorway,
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSave({
      ...card,
      bankName: bankName.trim() || 'Meu cartão',
      cardType,
      lastDigits: lastDigits.padStart(4, '0'),
      availableLimit: brlToNumber(centsToBRL(limitDigits)),
      colorway,
    })
  }

  return (
    <Modal title={isNew ? 'Novo cartão' : 'Editar cartão'} onClose={onClose}>
      <div className={styles.previewWrap}>
        <CreditCard card={previewCard} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Field label="Banco" as="label">
          <input
            className={styles.input}
            type="text"
            required
            value={bankName}
            onChange={(event) => setBankName(event.target.value)}
          />
        </Field>

        <div className={styles.row}>
          <Field label="Tipo" className={styles.rowField}>
            <Select
              ariaLabel="Tipo"
              options={cardTypeOptions}
              value={cardType}
              onChange={(value) => setCardType(value as CardData['cardType'])}
            />
          </Field>

          <Field label="Últimos dígitos" as="label" className={styles.rowField}>
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              required
              maxLength={4}
              value={lastDigits}
              onChange={(event) =>
                setLastDigits(event.target.value.replace(/\D/g, '').slice(0, 4))
              }
            />
          </Field>
        </div>

        <Field label="Limite disponível" as="label">
          <input
            className={styles.input}
            type="text"
            inputMode="decimal"
            value={centsToBRL(limitDigits)}
            onChange={(event) =>
              setLimitDigits(event.target.value.replace(/\D/g, ''))
            }
          />
        </Field>

        <Field label="Cor">
          <CardColorPicker value={colorway} onChange={setColorway} />
        </Field>

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
          title="Excluir cartão"
          message="Tem certeza que deseja excluir este cartão? Essa ação não pode ser desfeita."
          onCancel={() => setIsConfirmingDelete(false)}
          onConfirm={() => {
            setIsConfirmingDelete(false)
            onDelete?.(card.id)
            onClose()
          }}
        />
      )}
    </Modal>
  )
}
