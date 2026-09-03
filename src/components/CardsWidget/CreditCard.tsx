import chipIcon from '../../assets/chip.svg'
import { formatCurrencyBRL } from '../../lib/currency'
import { cardGradients } from '../../theme/colors'
import type { CardData } from './types'
import styles from './CreditCard.module.css'

interface CreditCardProps {
  card: CardData
  style?: React.CSSProperties
  onClick?: () => void
}

export function CreditCard({ card, style, onClick }: CreditCardProps) {
  return (
    <div
      className={styles.card}
      style={{ background: cardGradients[card.colorway], ...style }}
      onClick={onClick}
    >
      <div className={styles.shine} />

      <div className={styles.topRow}>
        <div className={styles.bankInfo}>
          <p className={styles.bankName}>{card.bankName}</p>
          <p className={styles.cardType}>{card.cardType}</p>
        </div>
        <NetworkIcon />
      </div>

      <div className={styles.chipRow}>
        <img src={chipIcon} alt="" className={styles.chip} />
        <ContactlessIcon />
      </div>

      <div className={styles.digitsRow}>
        <div className={styles.numberGroup}>
          <span className={styles.digits}>•••• •••• ••••</span>
          <span className={styles.lastDigits}>{card.lastDigits}</span>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <p className={styles.limitLabel}>Limite disponível</p>
        <p className={styles.limitValue}>
          {formatCurrencyBRL(card.availableLimit)}
        </p>
      </div>
    </div>
  )
}

function ContactlessIcon() {
  return (
    <svg
      className={styles.contactless}
      viewBox="0 0 24 24"
      role="presentation"
      aria-hidden="true"
    >
      <circle cx="4" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <path d="M6.83 9.17 A4 4 0 0 1 6.83 14.83" />
      <path d="M9.66 6.34 A8 8 0 0 1 9.66 17.66" />
      <path d="M12.49 3.51 A12 12 0 0 1 12.49 20.49" />
    </svg>
  )
}

function NetworkIcon() {
  return (
    <div className={styles.network} aria-hidden="true">
      <span className={styles.networkCircleYellow} />
      <span className={styles.networkCircleRed} />
    </div>
  )
}
