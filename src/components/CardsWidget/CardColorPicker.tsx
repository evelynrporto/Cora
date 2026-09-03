import { cardGradients } from '../../theme/colors'
import type { CardColorway } from '../../theme/colors'
import styles from './CardColorPicker.module.css'

const colorOptions: { value: CardColorway; label: string }[] = [
  { value: 'pink', label: 'Rosa' },
  { value: 'purple', label: 'Roxo' },
  { value: 'blue', label: 'Azul' },
  { value: 'green', label: 'Verde' },
  { value: 'yellow', label: 'Amarelo' },
]

interface CardColorPickerProps {
  value: CardColorway
  onChange: (value: CardColorway) => void
}

export function CardColorPicker({ value, onChange }: CardColorPickerProps) {
  return (
    <div className={styles.wrap} role="radiogroup" aria-label="Cor do cartão">
      {colorOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          aria-label={option.label}
          className={`${styles.swatch} ${value === option.value ? styles.swatchSelected : ''}`}
          style={{ background: cardGradients[option.value] }}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  )
}
