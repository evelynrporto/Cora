import { useEffect } from 'react'
import type { RefObject } from 'react'

export function useOutsideClick(
  containerRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void,
) {
  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    // Capture phase + pointerdown fires before any bubble-phase click
    // handler downstream can stopPropagation() and swallow the event.
    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [isOpen, containerRef, onClose])
}
