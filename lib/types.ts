export type BowType = 'Recurvo' | 'Compuesto' | 'Raso' | 'Tradicional' | 'Longbow'

export type Category = 'Escuela' | 'Juvenil' | 'U12' | 'U15' | 'U18' | 'U21' | 'Senior' | 'Master'

export type ScoringType = 'set' | 'cumulative'

export type DisciplineId = 'indoor_18m' | 'wa_720' | '3d' | 'campo'

export interface ArrowScore {
  value: number
  display: string
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
  scores: EndScore[]
}

export interface BracketMatch {
  id: string
  round: 'QF' | 'SF' | 'BRONZE' | 'GOLD'
  archer1Id: string | null
  archer2Id: string | null
  archer1Sets: number
  archer2Sets: number
  archer1Cumulative: number
  archer2Cumulative: number
  winnerId: string | null
  ends: EndScore[]
  isFinished: boolean
}

export interface Discipline {
  id: DisciplineId
  name: string
  distance: string
  targetSize: string
  totalEnds: number
  arrowsPerEnd: number
  scoringType: ScoringType
}
