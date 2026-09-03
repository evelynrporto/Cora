import type { ReactNode } from 'react'
import styles from './Field.module.css'

interface FieldProps {
  label: string
  as?: 'label' | 'div'
  className?: string
  children: ReactNode
}

export function Field({ label, as: Tag = 'div', className, children }: FieldProps) {
  return (
    <Tag className={`${styles.field} ${className ?? ''}`}>
      <span className={styles.label}>{label}</span>
      {children}
    </Tag>
  )
}
