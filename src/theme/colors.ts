export const colors = {
  pinkPrimary: '#F4519E',
  pinkLight: '#FF8BC5',
  pinkSoft: '#FFE5F2',
  purple: '#8B6FF7',
  lilac: '#EDE8FF',
  blue: '#6EA8FF',
  green: '#55D6B3',
  yellow: '#FFD36A',
} as const

export type CardColorway = 'pink' | 'purple' | 'blue' | 'green' | 'yellow'

export const cardGradients: Record<CardColorway, string> = {
  pink: `linear-gradient(100deg, ${colors.pinkPrimary} 0%, ${colors.pinkPrimary} 35%, ${colors.pinkLight} 100%)`,
  purple: `linear-gradient(100deg, #6E4FE0 0%, ${colors.purple} 35%, #B9A6FF 100%)`,
  blue: `linear-gradient(100deg, #4A86E8 0%, ${colors.blue} 35%, #A8C8FF 100%)`,
  green: `linear-gradient(100deg, #2FBE95 0%, ${colors.green} 35%, #8FE9D0 100%)`,
  yellow: `linear-gradient(100deg, #F5B93D 0%, ${colors.yellow} 35%, #FFE29A 100%)`,
}
