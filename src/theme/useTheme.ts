import { useEffect, useState } from 'react'
import type { ThemeName } from './palettes'

const STORAGE_KEY = 'financeapp-theme'
const DEFAULT_THEME: ThemeName = 'pink'

function readStoredTheme(): ThemeName {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'teal' ? 'teal' : DEFAULT_THEME
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>(readStoredTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return { theme, setTheme }
}
