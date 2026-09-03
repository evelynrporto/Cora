export function centsToBRL(digits: string): string {
  const numeric = digits.replace(/\D/g, '').padStart(3, '0')
  const cents = numeric.slice(-2)
  const units = String(Number(numeric.slice(0, -2)))
  const withThousands = units.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `R$ ${withThousands},${cents}`
}

export function brlToNumber(masked: string): number {
  const digits = masked.replace(/\D/g, '')
  return Number(digits) / 100
}

export function numberToBRLDigits(value: number): string {
  return String(Math.round(value * 100))
}
