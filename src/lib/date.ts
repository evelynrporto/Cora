export const monthAbbreviations = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
]

export const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

/** Parses a YYYY-MM-DD string as a local date (avoids UTC off-by-one shifts). */
export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** "02 ago" style — no year, for compact absolute dates. */
export function formatShortDate(iso: string): string {
  const date = parseISODate(iso)
  const day = String(date.getDate()).padStart(2, '0')
  return `${day} ${monthAbbreviations[date.getMonth()]}`
}

/** "02 ago 2026" style — includes the year. */
export function formatFullDate(iso: string): string {
  const date = parseISODate(iso)
  return `${formatShortDate(iso)} ${date.getFullYear()}`
}

/** "Hoje" / "Ontem" / "02 ago" relative to the current date. */
export function formatRelativeDate(iso: string): string {
  const date = parseISODate(iso)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const diffDays = Math.round(
    (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  )

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  return formatShortDate(iso)
}

/** True when the ISO date falls in the same calendar month/year as `reference`. */
export function isSameMonth(iso: string, reference: Date = new Date()): boolean {
  const date = parseISODate(iso)
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  )
}

/** "YYYY-MM" grouping key for an ISO date — sorts correctly as a plain string. */
export function getMonthKey(iso: string): string {
  return iso.slice(0, 7)
}

/** "Setembro 2026" from a "YYYY-MM" key. */
export function formatMonthYear(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number)
  return `${monthNames[month - 1]} ${year}`
}
