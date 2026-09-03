import { useMemo, useState } from 'react'
import { formatCurrencyBRL } from '../../lib/currency'
import { Select } from '../common/Select'
import type { MonthlyExpense } from './types'
import styles from './ExpensesChartWidget.module.css'

const CHART_HEIGHT = 190
const MIN_BAR_HEIGHT = 10

interface ExpensesChartWidgetProps {
  data: MonthlyExpense[]
}

export function ExpensesChartWidget({ data }: ExpensesChartWidgetProps) {
  const [selectedIndex, setSelectedIndex] = useState(data.length - 1)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const maxValue = useMemo(
    () => Math.max(...data.map((item) => item.value)) || 1,
    [data],
  )

  const activeIndex = hoveredIndex ?? selectedIndex

  if (data.length === 0) {
    return (
      <div className={styles.widget}>
        <header className={styles.header}>
          <h2 className={styles.title}>Gastos por mês</h2>
        </header>
        <p className={styles.empty}>Nenhum dado de gastos ainda.</p>
      </div>
    )
  }

  return (
    <div className={styles.widget}>
      <header className={styles.header}>
        <h2 className={styles.title}>Gastos por mês</h2>

        <Select
          variant="pill"
          ariaLabel="Selecionar mês"
          options={data.map((item) => ({
            value: item.id,
            label: item.fullLabel,
          }))}
          value={data[selectedIndex].id}
          onChange={(id) => {
            const index = data.findIndex((item) => item.id === id)
            if (index !== -1) setSelectedIndex(index)
          }}
        />
      </header>

      <div className={styles.chartArea}>
        {data.map((item, index) => {
          const barHeight = Math.max(
            (item.value / maxValue) * CHART_HEIGHT,
            MIN_BAR_HEIGHT,
          )
          const isActive = index === activeIndex
          const isSelected = index === selectedIndex

          return (
            <div
              key={item.id}
              className={styles.column}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedIndex(index)}
            >
              <div className={styles.barWrap} style={{ height: CHART_HEIGHT }}>
                {isActive && (
                  <div
                    className={styles.callout}
                    style={{ bottom: barHeight + 12 }}
                  >
                    {formatCurrencyBRL(item.value)}
                  </div>
                )}
                <button
                  type="button"
                  className={`${styles.bar} ${isSelected ? styles.barSelected : ''}`}
                  style={{ height: barHeight }}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                  aria-label={`${item.fullLabel}: ${formatCurrencyBRL(item.value)}`}
                />
              </div>
              <span
                className={`${styles.monthLabel} ${isSelected ? styles.monthLabelSelected : ''}`}
              >
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
