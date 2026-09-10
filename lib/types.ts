export type BowType =
  | 'Longbow'
  | 'Tradicional'
  | 'Barebow/Raso'
  | 'Compuesto'
  | 'Recurvo Olímpico'

export const BOW_TYPES: BowType[] = [
  'Longbow',
  'Tradicional',
  'Barebow/Raso',
  'Compuesto',
  'Recurvo Olímpico',
]

export const CATEGORIES: string[] = [
  'Escuela',
  'Junior',
  'U12',
  'U15',
  'U18',
  'U21',
  'Senior',
  'Master',
]

export type DisciplineId = 'indoor' | 'outdoor' | 'field' | '3d'

/** A single key on the numeric keypad. */
export interface KeypadKey {
  /** Text shown to the archer, e.g. "X", "10", "M". */
  label: string
  /** Point value used for totals. */
  value: number
  /** Background color (hex) for the key. */
  bg: string
  /** Foreground/text color (hex) for the key. */
  fg: string
}

export interface DisciplineConfig {
  id: DisciplineId
  name: string
  /** Short label for the group being shot, e.g. "Tanda" or "Diana". */
  endLabel: string
  /** Number of ends (tandas) or targets (dianas). */
  ends: number
  /** Maximum arrows recorded per end. */
  arrowsPerEnd: number
  /** Whether every arrow slot must be filled (false for 3D 1-2 arrows). */
  fixedArrows: boolean
  keypad: KeypadKey[]
}

/** An arrow value is the keypad label, or null when not yet shot. */
export type ArrowValue = string | null

export interface Archer {
  id: string
  name: string
  category: string
  targetLetter?: string
  bowType: BowType
  /** ends[endIndex][arrowIndex] */
  ends: ArrowValue[][]
}

/** Multi-archer patrulla / training session. */
export interface Tournament {
  kind: 'patrulla'
  disciplineId: DisciplineId
  archers: Archer[]
  createdAt: number
}

// ---------------------------------------------------------------------------
// Match Play (Cruces Eliminatorios / Finales — 1 vs 1)
// ---------------------------------------------------------------------------

export type MatchFormat = 'sets' | 'cumulative'

export interface MatchArcher {
  id: string
  name: string
  category: string
  bowType: BowType
}

/** ends[endIndex] = [arrowsArcherA, arrowsArcherB] */
export type MatchEnd = [ArrowValue[], ArrowValue[]]

export interface Match {
  kind: 'match'
  disciplineId: DisciplineId
  format: MatchFormat
  /** Label for each grouping, e.g. "Set" or "Diana". */
  endLabel: string
  numEnds: number
  arrowsPerEnd: number
  fixedArrows: boolean
  archers: [MatchArcher, MatchArcher]
  ends: MatchEnd[]
  /** One tie-breaker arrow per archer, or null if not shot yet. */
  shootOff: [ArrowValue, ArrowValue] | null
  createdAt: number
}

/** The persisted app session is either a patrulla or a match. */
export type Session = Tournament | Match