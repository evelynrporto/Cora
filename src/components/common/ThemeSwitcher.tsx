import { useRef } from 'react'
import { themePalettes } from '../../theme/palettes'
import type { ThemeName } from '../../theme/palettes'
import { CheckIcon, PaletteIcon } from './icons'
import { useDropdown } from './useDropdown'
import styles from './ThemeSwitcher.module.css'

interface ThemeSwitcherProps {
  value: ThemeName
  onChange: (theme: ThemeName) => void
}

export function ThemeSwitcher({ value, onChange }: ThemeSwitcherProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isOpen, toggle, close } = useDropdown(containerRef)

  return (
    <div className={styles.wrap} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Escolher paleta de cores"
      >
        <PaletteIcon className={styles.icon} />
      </button>

      {isOpen && (
        <div className={styles.menu} role="menu" aria-label="Paletas de cores">
          {themePalettes.map((palette) => {
            const isSelected = palette.id === value
            return (
              <button
                key={palette.id}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                onClick={() => {
                  onChange(palette.id)
                  close()
                }}
              >
                <span className={styles.optionLabel}>
                  <span
                    className={styles.swatch}
                    style={{ background: palette.swatch }}
                  />
                  {palette.label}
                </span>
                {isSelected && <CheckIcon className={styles.check} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
