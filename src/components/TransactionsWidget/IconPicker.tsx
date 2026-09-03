import { useRef } from 'react'
import { CheckIcon, ChevronDownIcon } from '../common/icons'
import { useDropdown } from '../common/useDropdown'
import { TransactionIcon } from './TransactionIcon'
import type { TransactionIconType } from './types'
import styles from './IconPicker.module.css'

const iconOptions: { value: TransactionIconType; label: string }[] = [
  { value: 'spotify', label: 'Spotify' },
  { value: 'ifood', label: 'iFood' },
  { value: 'netflix', label: 'Netflix' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'uber', label: 'Uber' },
  { value: 'ubereats', label: 'Uber Eats' },
  { value: 'shopee', label: 'Shopee' },
  { value: 'aliexpress', label: 'AliExpress' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'picpay', label: 'PicPay' },
  { value: 'nubank', label: 'Nubank' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'nike', label: 'Nike' },
  { value: 'adidas', label: 'Adidas' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'shein', label: 'Shein' },
  { value: 'sephora', label: 'Sephora' },
  { value: 'olx', label: 'OLX' },
  { value: 'makeup', label: 'Maquiagem' },
  { value: 'pharmacy', label: 'Remédios' },
  { value: 'gym', label: 'Academia' },
  { value: 'house', label: 'Moradia' },
  { value: 'transport', label: 'Transporte' },
  { value: 'entertainment', label: 'Lazer' },
  { value: 'utilities', label: 'Contas' },
  { value: 'travel', label: 'Viagem' },
  { value: 'health', label: 'Saúde' },
  { value: 'cart', label: 'Mercado' },
]

interface IconPickerProps {
  value: TransactionIconType
  onChange: (value: TransactionIconType) => void
  ariaLabel?: string
}

export function IconPicker({ value, onChange, ariaLabel }: IconPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const selected = iconOptions.find((option) => option.value === value)
  const { isOpen, toggle, close } = useDropdown(containerRef)

  return (
    <div className={styles.wrap} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <TransactionIcon type={value} />
        <span className={styles.triggerLabel}>{selected?.label}</span>
        <ChevronDownIcon
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
        />
      </button>

      {isOpen && (
        <div className={styles.grid} role="listbox">
          {iconOptions.map((option) => {
            const isSelected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`${styles.gridItem} ${isSelected ? styles.gridItemSelected : ''}`}
                onClick={() => {
                  onChange(option.value)
                  close()
                }}
              >
                <TransactionIcon type={option.value} />
                <span className={styles.gridLabel}>{option.label}</span>
                {isSelected && <CheckIcon className={styles.check} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
