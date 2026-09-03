import {
  SiAdidas,
  SiAirbnb,
  SiAliexpress,
  SiIfood,
  SiNetflix,
  SiNike,
  SiNubank,
  SiPaypal,
  SiPicpay,
  SiShopee,
  SiSpotify,
  SiUber,
  SiUbereats,
  SiYoutube,
} from 'react-icons/si'
import type { IconType } from 'react-icons'
import type { TransactionIconType } from './types'
import styles from './TransactionIcon.module.css'

type GlyphProps = { className?: string; color?: string }
type Glyph = IconType | ((props: GlyphProps) => React.JSX.Element)

interface IconConfig {
  background: string
  glyphColor: string
  Glyph: Glyph
}

const iconConfig: Record<TransactionIconType, IconConfig> = {
  spotify: { background: '#1DB954', glyphColor: '#ffffff', Glyph: SiSpotify },
  ifood: { background: '#EA1D2C', glyphColor: '#ffffff', Glyph: SiIfood },
  netflix: { background: '#141414', glyphColor: '#E50914', Glyph: SiNetflix },
  uber: { background: '#000000', glyphColor: '#ffffff', Glyph: SiUber },
  ubereats: { background: '#06C167', glyphColor: '#ffffff', Glyph: SiUbereats },
  shopee: { background: '#EE4D2D', glyphColor: '#ffffff', Glyph: SiShopee },
  aliexpress: { background: '#FF4747', glyphColor: '#ffffff', Glyph: SiAliexpress },
  paypal: { background: '#0070BA', glyphColor: '#ffffff', Glyph: SiPaypal },
  picpay: { background: '#21C25E', glyphColor: '#ffffff', Glyph: SiPicpay },
  nubank: { background: '#8A05BE', glyphColor: '#ffffff', Glyph: SiNubank },
  airbnb: { background: '#FF385C', glyphColor: '#ffffff', Glyph: SiAirbnb },
  youtube: { background: '#FF0000', glyphColor: '#ffffff', Glyph: SiYoutube },
  nike: { background: '#111111', glyphColor: '#ffffff', Glyph: SiNike },
  adidas: { background: '#000000', glyphColor: '#ffffff', Glyph: SiAdidas },
  amazon: { background: '#131921', glyphColor: '#FF9900', Glyph: AmazonGlyph },
  shein: { background: '#000000', glyphColor: '#ffffff', Glyph: LetterGlyph },
  sephora: { background: '#F7CBE0', glyphColor: '#ffffff', Glyph: SephoraGlyph },
  olx: { background: '#8B6FF7', glyphColor: '#ffffff', Glyph: TagGlyph },
  makeup: { background: '#FF8BC5', glyphColor: '#ffffff', Glyph: MakeupGlyph },
  pharmacy: { background: '#FFE0E0', glyphColor: '#E63946', Glyph: PharmacyGlyph },
  gym: { background: '#F5B93D', glyphColor: '#ffffff', Glyph: GymGlyph },
  house: { background: '#FFE9BE', glyphColor: '#F5B93D', Glyph: HouseGlyph },
  transport: { background: '#CBE0FF', glyphColor: '#4A86E8', Glyph: TransportGlyph },
  entertainment: { background: '#FFE5F2', glyphColor: '#F4519E', Glyph: EntertainmentGlyph },
  utilities: { background: '#FFD36A', glyphColor: '#ffffff', Glyph: UtilitiesGlyph },
  travel: { background: '#6EA8FF', glyphColor: '#ffffff', Glyph: TravelGlyph },
  health: { background: '#BFF0E2', glyphColor: '#2FBE95', Glyph: HealthGlyph },
  cart: { background: '#EDE8FF', glyphColor: '#8B6FF7', Glyph: CartGlyph },
}

interface TransactionIconProps {
  type: TransactionIconType
}

export function TransactionIcon({ type }: TransactionIconProps) {
  const config = iconConfig[type]

  return (
    <div className={styles.icon} style={{ background: config.background }}>
      <config.Glyph className={styles.glyph} color={config.glyphColor} />
    </div>
  )
}

/** Shared wrapper so custom glyphs only need to declare their inner shapes. */
function IconSvg({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {children}
    </svg>
  )
}

function CartGlyph({ className, color }: GlyphProps) {
  return (
    <IconSvg className={className}>
      <path
        d="M4 5h2l1.8 9.3a2 2 0 0 0 2 1.7h6.6a2 2 0 0 0 2-1.6L19.5 9H7"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="19" r="1.3" fill={color} />
      <circle cx="16.5" cy="19" r="1.3" fill={color} />
    </IconSvg>
  )
}

function AmazonGlyph({ className, color }: GlyphProps) {
  return (
    <IconSvg className={className}>
      <rect
        x="4"
        y="5"
        width="16"
        height="10"
        rx="2"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.6"
      />
      <path d="M4 8.5H20" stroke="#ffffff" strokeWidth="1.6" />
      <path
        d="M6 18.5c3 2 9 2 12 0"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </IconSvg>
  )
}

function LetterGlyph({ className, color }: GlyphProps) {
  return (
    <IconSvg className={className}>
      <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="700" fill={color}>
        S
      </text>
    </IconSvg>
  )
}

function SephoraGlyph({ className, color }: GlyphProps) {
  return (
    <IconSvg className={className}>
      <path
        d="M13.2 2.5c-1.6 1.8-3 3.4-3 5.4 0 1.6.9 2.5 1.9 3.4 1.1 1 2.3 2 2.3 4 0 1.9-1.3 3.4-2.9 4.2 2.6 0 5.7-1.9 5.7-5.2 0-1.9-1.1-3-2.2-4-1-.9-2-1.8-2-3.2 0-1.6 1-2.9 2-4.1-.6-.2-1.2-.4-1.8-.5Z"
        fill={color}
        stroke="none"
      />
    </IconSvg>
  )
}

function TagGlyph({ className, color }: GlyphProps) {
  return (
    <IconSvg className={className}>
      <path
        d="M12 4h6a2 2 0 0 1 2 2v6a2 2 0 0 1-.6 1.4l-8 8a2 2 0 0 1-2.8 0l-6-6a2 2 0 0 1 0-2.8l8-8A2 2 0 0 1 12 4Z"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="15.5" cy="8.5" r="1.4" fill={color} stroke="none" />
    </IconSvg>
  )
}

function MakeupGlyph({ className, color }: GlyphProps) {
  return (
    <IconSvg className={className}>
      <path d="M9 3h6l1 5H8l1-5Z" fill={color} stroke="none" />
      <rect x="8" y="8" width="8" height="11" rx="2" fill="none" stroke={color} strokeWidth="1.6" />
      <line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth="1.2" />
    </IconSvg>
  )
}

function PharmacyGlyph({ className, color }: GlyphProps) {
  return (
    <IconSvg className={className}>
      <g transform="rotate(45 12 12)">
        <rect x="4" y="9" width="16" height="6" rx="3" fill="none" stroke={color} strokeWidth="1.8" />
        <line x1="12" y1="9" x2="12" y2="15" stroke={color} strokeWidth="1.8" />
      </g>
    </IconSvg>
  )
}

function GymGlyph({ className, color }: GlyphProps) {
  return (
    <IconSvg className={className}>
      <rect x="1.5" y="10" width="3" height="4" rx="1" fill={color} stroke="none" />
      <rect x="19.5" y="10" width="3" height="4" rx="1" fill={color} stroke="none" />
      <line x1="5.5" y1="12" x2="18.5" y2="12" stroke={color} strokeWidth="2" />
      <rect x="6" y="8" width="2.5" height="8" rx="1" fill={color} stroke="none" />
      <rect x="15.5" y="8" width="2.5" height="8" rx="1" fill={color} stroke="none" />
    </IconSvg>
  )
}

function HouseGlyph({ className, color }: GlyphProps) {
  return (
    <IconSvg className={className}>
      <path
        d="M4 11 12 4l8 7"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <rect x="10" y="14" width="4" height="6" fill={color} stroke="none" />
    </IconSvg>
  )
}

function TransportGlyph({ className, color }: GlyphProps) {
  return (
    <IconSvg className={className}>
      <rect x="5" y="6" width="8" height="14" rx="1.5" fill="none" stroke={color} strokeWidth="1.6" />
      <line x1="5" y1="11" x2="13" y2="11" stroke={color} strokeWidth="1.6" />
      <path
        d="M13 10h2a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0v-5.5L18 8"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconSvg>
  )
}

function EntertainmentGlyph({ className, color }: GlyphProps) {
  return (
    <IconSvg className={className}>
      <path
        d="M4 9a2 2 0 1 0 0 6v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a2 2 0 1 1 0-6V6a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v3Z"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <line x1="14" y1="5" x2="14" y2="19" stroke={color} strokeWidth="1.4" strokeDasharray="2 2" />
    </IconSvg>
  )
}

function UtilitiesGlyph({ className, color }: GlyphProps) {
  return (
    <IconSvg className={className}>
      <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" fill={color} stroke="none" />
    </IconSvg>
  )
}

function TravelGlyph({ className, color }: GlyphProps) {
  return (
    <IconSvg className={className}>
      <path
        d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
        fill={color}
        stroke="none"
      />
    </IconSvg>
  )
}

function HealthGlyph({ className, color }: GlyphProps) {
  return (
    <IconSvg className={className}>
      <rect x="9" y="4" width="6" height="16" rx="1.5" fill={color} stroke="none" />
      <rect x="4" y="9" width="16" height="6" rx="1.5" fill={color} stroke="none" />
    </IconSvg>
  )
}
