export type CategoryColorway = 'purple' | 'blue' | 'green' | 'yellow'

export interface CategorySpending {
  id: string
  label: string
  value: number
  colorway: CategoryColorway
}
