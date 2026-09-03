import { useState } from 'react'
import { formatMonthYear, getMonthKey } from '../../lib/date'
import { Modal } from '../common/Modal'
import { Select } from '../common/Select'
import { TransactionRow } from './TransactionRow'
import type { TransactionData } from './types'
import styles from './AllTransactionsModal.module.css'

interface AllTransactionsModalProps {
  transactions: TransactionData[]
  onSelectTransaction: (id: string) => void
  onClose: () => void
}

export function AllTransactionsModal({
  transactions,
  onSelectTransaction,
  onClose,
}: AllTransactionsModalProps) {
  const [selectedMonthKey, setSelectedMonthKey] = useState('all')

  const monthKeys = [...new Set(transactions.map((t) => getMonthKey(t.date)))].sort(
    (a, b) => b.localeCompare(a),
  )
  const visibleMonthKeys =
    selectedMonthKey === 'all' ? monthKeys : [selectedMonthKey]

  const monthOptions = [
    { value: 'all', label: 'Todos os meses' },
    ...monthKeys.map((key) => ({ value: key, label: formatMonthYear(key) })),
  ]

  return (
    <Modal title="Todos os lançamentos" onClose={onClose} maxWidth={480}>
      {transactions.length > 0 && (
        <div className={styles.filter}>
          <Select
            ariaLabel="Filtrar por mês"
            options={monthOptions}
            value={selectedMonthKey}
            onChange={setSelectedMonthKey}
          />
        </div>
      )}

      <div className={styles.scrollArea}>
        {transactions.length === 0 ? (
          <p className={styles.empty}>Nenhum gasto registrado ainda.</p>
        ) : (
          visibleMonthKeys.map((key) => {
            const items = transactions.filter((t) => getMonthKey(t.date) === key)
            if (items.length === 0) return null

            return (
              <div key={key} className={styles.group}>
                {selectedMonthKey === 'all' && (
                  <p className={styles.groupLabel}>{formatMonthYear(key)}</p>
                )}
                <div className={styles.list}>
                  {items.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      onClick={() => onSelectTransaction(transaction.id)}
                    />
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </Modal>
  )
}
