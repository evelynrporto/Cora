import { useRef, useState } from 'react'
import { formatFullDate, monthNames, parseISODate, toISODate } from '../../lib/date'
import { useDropdown } from './useDropdown'
import styles from './DatePicker.module.css'

const weekdayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function getMonthGrid(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1)
  const gridStart = new Date(year, month, 1 - firstDay.getDay())
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + i)
    return date
  })
}

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  ariaLabel?: string
}

export function DatePicker({ value, onChange, ariaLabel }: DatePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isOpen, toggle, close } = useDropdown(containerRef)
  const selectedDate = parseISODate(value)
  const today = new Date()
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth())

  const cells = getMonthGrid(viewYear, viewMonth)

  function goToPreviousMonth() {
    const next = new Date(viewYear, viewMonth - 1, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  function goToNextMonth() {
    const next = new Date(viewYear, viewMonth + 1, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  return (
    <div className={styles.wrap} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <svg className={styles.calendarIcon} viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="4"
            y="5.5"
            width="16"
            height="15"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1.6" />
          <line x1="8" y1="3.5" x2="8" y2="7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="16" y1="3.5" x2="16" y2="7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className={styles.triggerLabel}>{formatFullDate(value)}</span>
      </button>

      {isOpen && (
        <div className={styles.panel} role="dialog" aria-label="Selecionar data">
          <div className={styles.panelHeader}>
            <button
              type="button"
              className={styles.navButton}
              onClick={goToPreviousMonth}
              aria-label="Mês anterior"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M15 6l-6 6 6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className={styles.panelTitle}>
              {monthNames[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              className={styles.navButton}
              onClick={goToNextMonth}
              aria-label="Próximo mês"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M9 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className={styles.weekdays}>
            {weekdayLabels.map((label, index) => (
              <span key={index} className={styles.weekday}>
                {label}
              </span>
            ))}
          </div>

          <div className={styles.grid}>
            {cells.map((cellDate) => {
              const iso = toISODate(cellDate)
              const inCurrentMonth = cellDate.getMonth() === viewMonth
              const isSelected = iso === value
              const isToday = iso === toISODate(today)

              return (
                <button
                  key={iso}
                  type="button"
                  className={`${styles.day} ${!inCurrentMonth ? styles.dayMuted : ''} ${isSelected ? styles.daySelected : ''} ${isToday && !isSelected ? styles.dayToday : ''}`}
                  onClick={() => {
                    onChange(iso)
                    close()
                  }}
                >
                  {cellDate.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
