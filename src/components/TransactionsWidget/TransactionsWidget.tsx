import { useState } from 'react'
import { isSameMonth, toISODate } from '../../lib/date'
import { AllTransactionsModal } from './AllTransactionsModal'
import { TransactionEditModal } from './TransactionEditModal'
import { TransactionRow } from './TransactionRow'
import type { TransactionData } from './types'
import styles from './TransactionsWidget.module.css'

function createBlankTransaction(): TransactionData {
  return {
    id: '',
    title: '',
    category: 'Outros',
    amount: 0,
    date: toISODate(new Date()),
    isRecurring: false,
    icon: 'cart',
  }
}

interface TransactionsWidgetProps {
  transactions: TransactionData[]
  onCreateTransaction: (draft: Omit<TransactionData, 'id'>) => Promise<void>
  onUpdateTransaction: (transaction: TransactionData) => Promise<void>
  onDeleteTransaction: (id: string) => Promise<void>
}

export function TransactionsWidget({
  transactions,
  onCreateTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}: TransactionsWidgetProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isViewingAll, setIsViewingAll] = useState(false)

  const currentMonthTransactions = transactions.filter((transaction) =>
    isSameMonth(transaction.date),
  )
  const editingTransaction = transactions.find(
    (transaction) => transaction.id === editingId,
  )

  return (
    <div className={styles.widget}>
      <header className={styles.header}>
        <h2 className={styles.title}>Últimos lançamentos</h2>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => setIsCreating(true)}
            aria-label="Adicionar gasto"
          >
            +
          </button>
          <button
            type="button"
            className={styles.seeAll}
            onClick={() => setIsViewingAll(true)}
          >
            Ver todos
            <span className={styles.chevron}>›</span>
          </button>
        </div>
      </header>

      {currentMonthTransactions.length === 0 ? (
        <p className={styles.empty}>Nenhum gasto neste mês ainda.</p>
      ) : (
        <div className={styles.list}>
          {currentMonthTransactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              onClick={() => setEditingId(transaction.id)}
            />
          ))}
        </div>
      )}

      {isViewingAll && (
        <AllTransactionsModal
          transactions={transactions}
          onSelectTransaction={(id) => setEditingId(id)}
          onClose={() => setIsViewingAll(false)}
        />
      )}

      {editingTransaction && (
        <TransactionEditModal
          transaction={editingTransaction}
          onClose={() => setEditingId(null)}
          onSave={(updated) => {
            setEditingId(null)
            onUpdateTransaction(updated)
          }}
          onDelete={(id) => {
            setEditingId(null)
            onDeleteTransaction(id).catch((error) => {
              console.error('Falha ao excluir o gasto:', error)
            })
          }}
        />
      )}

      {isCreating && (
        <TransactionEditModal
          isNew
          transaction={createBlankTransaction()}
          onClose={() => setIsCreating(false)}
          onSave={(draft) => {
            setIsCreating(false)
            const { id: _unusedId, ...payload } = draft

            onCreateTransaction(payload).catch((error) => {
              console.error('Falha ao criar o gasto:', error)
            })
          }}
        />
      )}
    </div>
  )
}
