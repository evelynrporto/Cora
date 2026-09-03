import { useState } from 'react'
import { PencilIcon } from '../common/icons'
import { CardEditModal } from './CardEditModal'
import { CreditCard } from './CreditCard'
import type { CardData } from './types'
import styles from './CardsWidget.module.css'

const MAX_VISIBLE_DEPTH = 2

function createBlankCard(): CardData {
  return {
    id: '',
    bankName: '',
    cardType: 'Crédito',
    lastDigits: '',
    availableLimit: 0,
    colorway: 'pink',
  }
}

interface CardsWidgetProps {
  cards: CardData[]
  onCreateCard: (card: Omit<CardData, 'id'>) => Promise<void>
  onUpdateCard: (card: CardData) => Promise<void>
  onDeleteCard: (id: string) => Promise<void>
}

export function CardsWidget({
  cards,
  onCreateCard,
  onUpdateCard,
  onDeleteCard,
}: CardsWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const editingCard = cards.find((card) => card.id === editingId)

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length)
  }

  return (
    <div className={styles.widget}>
      <header className={styles.header}>
        <h2 className={styles.title}>Meus cartões</h2>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => setIsCreating(true)}
          aria-label="Adicionar cartão"
        >
          +
        </button>
      </header>

      {cards.length === 0 ? (
        <p className={styles.empty}>Nenhum cartão cadastrado ainda.</p>
      ) : (
        <div className={styles.stack}>
          {cards.map((card, index) => {
            const depth = (index - currentIndex + cards.length) % cards.length
            const isVisible = depth <= MAX_VISIBLE_DEPTH
            const isFront = depth === 0

            return (
              <CreditCard
                key={card.id}
                card={card}
                onClick={isFront ? goToNext : undefined}
                style={{
                  zIndex: cards.length - depth,
                  opacity: isVisible ? 1 : 0,
                  pointerEvents: isFront ? 'auto' : 'none',
                  transform: `translate(${depth * 10}px, ${depth * -10}px) scale(${1 - depth * 0.06}) rotate(${depth * 2}deg)`,
                }}
              />
            )
          })}

          <button
            type="button"
            className={styles.editCardButton}
            onClick={(event) => {
              event.stopPropagation()
              setEditingId(cards[currentIndex].id)
            }}
            aria-label="Editar cartão"
          >
            <PencilIcon className={styles.editCardIcon} />
          </button>
        </div>
      )}

      {cards.length > 1 && (
        <div className={styles.dots}>
          {cards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              aria-label={`Mostrar cartão ${card.bankName}`}
              className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}

      {isCreating && (
        <CardEditModal
          isNew
          card={createBlankCard()}
          onClose={() => setIsCreating(false)}
          onSave={(draft) => {
            setIsCreating(false)
            const { id: _unusedId, ...payload } = draft
            onCreateCard(payload).catch((error) => {
              console.error('Falha ao criar o cartão:', error)
            })
          }}
        />
      )}

      {editingCard && (
        <CardEditModal
          card={editingCard}
          onClose={() => setEditingId(null)}
          onSave={(updated) => {
            setEditingId(null)
            onUpdateCard(updated).catch((error) => {
              console.error('Falha ao salvar o cartão:', error)
            })
          }}
          onDelete={(id) => {
            setEditingId(null)
            setCurrentIndex(0)
            onDeleteCard(id).catch((error) => {
              console.error('Falha ao excluir o cartão:', error)
            })
          }}
        />
      )}
    </div>
  )
}
