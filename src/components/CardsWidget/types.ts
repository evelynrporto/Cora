import type { CardColorway } from '../../theme/colors'

export interface CardData {
  id: string
  bankName: string
  cardType: 'Crédito' | 'Débito'
  lastDigits: string
  availableLimit: number
  colorway: CardColorway
}
