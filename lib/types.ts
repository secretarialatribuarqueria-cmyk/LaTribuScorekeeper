export type BowType = 
  | 'Recurvo' 
  | 'Compuesto' 
  | 'Raso' 
  | 'Tradicional' 
  | 'Longbow'

export const BOW_TYPES: BowType[] = [
  'Recurvo',
  'Compuesto',
  'Raso',
  'Tradicional',
  'Longbow',
]

// Lista oficial de categorías
export const CATEGORIES = [
  'Escuela',
  'Juvenil',
  'U12',
  'U15',
  'U18',
  'U21',
  'Senior',
  'Master',
] as const

export type Category = (typeof CATEGORIES)[number]

export type ScoringType = 'set' | 'cumulative'

export type DisciplineId = 'indoor_18m' | 'outdoor_70m' | 'field_24' | '3d_24'

export interface Discipline {
  id: DisciplineId
  name: string
  ends: number
  arrowsPerEnd: number
  scoringType: ScoringType
  targetType: 'standard' | 'field' | '3d'
}

export interface ArrowScore {
  value: number // 0-10 (11 para X)
  display: string // 'X', '10', '9', ..., 'M'
}

export interface EndScore {
  endNumber: number
  arrows: ArrowScore[]
  total: number
}

export interface Archer {
  id: string
  name: string
  category: string
  bowType: BowType
  targetNumber?: number
  scores: EndScore[]
}

export interface BracketMatch {
  id: string // e.g. 'QF1', 'SF1', 'GOLD'
  round: 'QF' | 'SF' | 'BRONZE' | 'GOLD'
  archer1Id: string | null
  archer2Id: string | null
  archer1Sets: number
  archer2Sets: number
  archer1Cumulative: number
  archer2Cumulative: number
  winnerId: string | null
  ends: {
    a1Arrows: ArrowScore[]
    a2Arrows: ArrowScore[]
    a1EndTotal: number
    a2EndTotal: number
    a1Points: number
    a2Points: number
  }[]
  isFinished: boolean
}
