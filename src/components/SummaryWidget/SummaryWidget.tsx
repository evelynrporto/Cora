import { colors } from '../../theme/colors'
import { formatCurrencyBRL } from '../../lib/currency'
import type { CategorySpending } from './types'
import styles from './SummaryWidget.module.css'

const categoryHex: Record<CategorySpending['colorway'], string> = {
  purple: colors.purple,
  blue: colors.blue,
  green: colors.green,
  yellow: colors.yellow,
}

function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace('#', '')
  const r = parseInt(value.substring(0, 2), 16)
  const g = parseInt(value.substring(2, 4), 16)
  const b = parseInt(value.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

interface SummaryWidgetProps {
  total: number
  changePercent: number
  categories: CategorySpending[]
}

export function SummaryWidget({
  total,
  changePercent,
  categories,
}: SummaryWidgetProps) {
  const maxValue =
    categories.length === 0
      ? 1
      : Math.max(...categories.map((category) => category.value)) || 1
  const isPositive = changePercent >= 0

  return (
    <div className={styles.widget}>
      <div className={styles.totalColumn}>
        <p className={styles.label}>Total do mês</p>
        <p className={styles.total}>{formatCurrencyBRL(total)}</p>

        <div className={styles.change}>
          <span
            className={`${styles.changeBadge} ${isPositive ? styles.changeBadgePositive : styles.changeBadgeNegative}`}
          >
            <svg
              className={`${styles.changeIcon} ${isPositive ? '' : styles.changeIconDown}`}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M6 17L17 6M17 6H9M17 6V14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isPositive ? '+' : ''}
            {changePercent.toLocaleString('pt-BR', {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
            %
          </span>
          <span className={styles.changeText}>em relação ao mês anterior</span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.categoriesColumn}>
        <p className={styles.categoriesTitle}>Gastos por categoria</p>

        {categories.length === 0 ? (
          <p className={styles.empty}>Nenhuma categoria com gastos ainda.</p>
        ) : (
          <div className={styles.categoryList}>
            {categories.map((category) => {
              const strong = categoryHex[category.colorway]
              const light = hexToRgba(strong, 0.35)
              const widthPercent = (category.value / maxValue) * 100

              return (
                <div key={category.id} className={styles.categoryRow}>
                  <span className={styles.categoryLabel}>
                    {category.label}
                  </span>
                  <div
                    className={styles.track}
                    style={{ background: hexToRgba(strong, 0.16) }}
                  >
                    <div
                      className={styles.fill}
                      style={{
                        width: `${widthPercent}%`,
                        background: `linear-gradient(90deg, ${light} 0%, ${strong} 100%)`,
                      }}
                    />
                  </div>
                  <span className={styles.categoryValue}>
                    {formatCurrencyBRL(category.value)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
