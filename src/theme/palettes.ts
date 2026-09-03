export type ThemeName = 'pink' | 'teal'

export interface ThemePalette {
  id: ThemeName
  label: string
  swatch: string
}

export const themePalettes: ThemePalette[] = [
  {
    id: 'pink',
    label: 'Rosa',
    swatch: 'linear-gradient(135deg, #F4519E 0%, #8B6FF7 100%)',
  },
  {
    id: 'teal',
    label: 'Verde-água',
    swatch: 'linear-gradient(135deg, #2BB3AE 0%, #6EA8FF 100%)',
  },
]
