export type TransactionIconType =
  | 'spotify'
  | 'ifood'
  | 'netflix'
  | 'uber'
  | 'ubereats'
  | 'shopee'
  | 'aliexpress'
  | 'paypal'
  | 'picpay'
  | 'nubank'
  | 'airbnb'
  | 'youtube'
  | 'nike'
  | 'adidas'
  | 'amazon'
  | 'shein'
  | 'sephora'
  | 'olx'
  | 'makeup'
  | 'pharmacy'
  | 'gym'
  | 'house'
  | 'transport'
  | 'entertainment'
  | 'utilities'
  | 'travel'
  | 'health'
  | 'cart'

export interface TransactionData {
  id: string
  title: string
  category: string
  amount: number
  /** ISO date (YYYY-MM-DD) — required by the native date input and the relative-date formatter. */
  date: string
  isRecurring?: boolean
  icon: TransactionIconType
}
