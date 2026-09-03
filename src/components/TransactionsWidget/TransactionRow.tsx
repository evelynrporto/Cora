import { formatCurrencyBRL } from '../../lib/currency'
import { formatRelativeDate } from '../../lib/date'
import { TransactionIcon } from './TransactionIcon'
import type { TransactionData } from './types'
import styles from './TransactionRow.module.css'

interface TransactionRowProps {
  transaction: TransactionData
  onClick?: () => void
}

export function TransactionRow({ transaction, onClick }: TransactionRowProps) {
  return (
    <button type="button" className={styles.row} onClick={onClick}>
      <TransactionIcon type={transaction.icon} />

      <div className={styles.info}>
        <div className={styles.titleLine}>
          <p className={styles.title}>{transaction.title}</p>
          {transaction.isRecurring && (
            <span className={styles.badge}>Recorrente</span>
          )}
        </div>
        <p className={styles.category}>{transaction.category}</p>
      </div>

      <div className={styles.amountInfo}>
        <p className={styles.amount}>
          - {formatCurrencyBRL(transaction.amount)}
        </p>
        <p className={styles.date}>{formatRelativeDate(transaction.date)}</p>
      </div>

      <span className={styles.chevron} aria-hidden="true">
        ›
      </span>
    </button>
  )
}
