import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useOutsideClick } from './useOutsideClick'

type CloseListener = () => void

const openListeners = new Map<symbol, CloseListener>()
let activeId: symbol | null = null

function announceOpen(id: symbol) {
  if (activeId && activeId !== id) {
    openListeners.get(activeId)?.()
  }
  activeId = id
}

function announceClose(id: symbol) {
  if (activeId === id) activeId = null
}

/**
 * Tracks open/close state for a dropdown-style popover and ensures only one
 * such popover is open at a time app-wide — opening one force-closes any
 * other, so overlapping menus (e.g. a field's menu covering a sibling field
 * below it) can never both be open at once.
 */
export function useDropdown(containerRef: RefObject<HTMLElement | null>) {
  const [isOpen, setIsOpen] = useState(false)
  const idRef = useRef<symbol | null>(null)
  if (idRef.current === null) idRef.current = Symbol('dropdown')

  useEffect(() => {
    const id = idRef.current!
    openListeners.set(id, () => setIsOpen(false))
    return () => {
      openListeners.delete(id)
      announceClose(id)
    }
  }, [])

  const close = useCallback(() => {
    announceClose(idRef.current!)
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((current) => {
      const next = !current
      if (next) announceOpen(idRef.current!)
      else announceClose(idRef.current!)
      return next
    })
  }, [])

  useOutsideClick(containerRef, isOpen, close)

  return { isOpen, toggle, close }
}
