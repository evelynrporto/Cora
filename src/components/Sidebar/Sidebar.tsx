import type { IconType } from 'react-icons'
import logo from '../../assets/logo.png'
import styles from './Sidebar.module.css'

export interface SidebarItem {
  id: string
  label: string
  icon: IconType
}

interface SidebarProps {
  items: SidebarItem[]
  activeId: string
  onSelect: (id: string) => void
}

export function Sidebar({ items, activeId, onSelect }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img src={logo} alt="" className={styles.brandLogo} />
        <span className={styles.brandName}>Cora</span>
      </div>

      <div className={styles.divider} />

      <nav className={styles.nav} aria-label="Navegação principal">
        {items.map((item) => {
          const isActive = item.id === activeId
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onSelect(item.id)}
            >
              <Icon className={styles.navIcon} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
