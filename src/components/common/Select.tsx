import { useRef } from 'react'
import { CheckIcon, ChevronDownIcon } from './icons'
import { useDropdown } from './useDropdown'
import styles from './Select.module.css'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  variant?: 'field' | 'pill'
  ariaLabel?: string
}

export function Select({
  options,
  value,
  onChange,
  variant = 'field',
  ariaLabel,
}: SelectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const selected = options.find((option) => option.value === value)
  const { isOpen, toggle, close } = useDropdown(containerRef)

  return (
    <div className={styles.wrap} ref={containerRef}>
      <button
        type="button"
        className={`${styles.trigger} ${variant === 'pill' ? styles.triggerPill : styles.triggerField}`}
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <span className={styles.triggerLabel}>{selected?.label}</span>
        <ChevronDownIcon
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
        />
      </button>

      {isOpen && (
        <ul
          className={`${styles.menu} ${variant === 'pill' ? styles.menuPill : styles.menuField}`}
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                  onClick={() => {
                    onChange(option.value)
                    close()
                  }}
                >
                  {option.label}
                  {isSelected && <CheckIcon className={styles.check} />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
