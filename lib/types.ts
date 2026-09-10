export type DisciplineId =
  | 'indoor_18m'
  | 'outdoor_70m'
  | 'field_24'
  | '3d_standard'
  | 'match_play_sets'

export type ScoringType = 'sets' | 'cumulative'

// Tipos de arco oficiales
export type BowType = 'Longbow' | 'Tradicional' | 'Raso' | 'Recurvo' | 'Compuesto'

// Categorías del club
export const CATEGORIES = [
  'Escuela',
  'Cazador',
  'Senior',
  'Veterano',
  'Juvenil',
] as const

export type Category = (typeof CATEGORIES)[number]

export interface ArrowKeyConfig {
  label: string
  value: number
  bg: string
  fg: string
}

export interface Discipline {
  id: DisciplineId
  name: string
  endLabel: string
  ends: number
  arrowsPerEnd: number
  keypad: ArrowKeyConfig[]
  scoringType: ScoringType
}

export interface Archer {
  id: string
  name: string
  category: string
  bowType: BowType
  targetNumber?: string
  ends: string[][]
}

export interface BracketMatch {
  id: string
  stage: 'quarter' | 'semi' | 'bronze' | 'gold'
  archer1Id?: string
  archer2Id?: string
  archer1Score: number
  archer2Score: number
  archer1ArrowScores: string[]
  archer2ArrowScores: string[]
  winnerId?: string
  isShootOff?: boolean
  shootOffArrow1?: number
  shootOffArrow2?: number
}

export interface Tournament {
  id: string
  name: string
  date: string
  disciplineId: DisciplineId
  stage: 'qualification' | 'brackets' | 'completed'
  archers: Archer[]
  brackets: BracketMatch[]
}
