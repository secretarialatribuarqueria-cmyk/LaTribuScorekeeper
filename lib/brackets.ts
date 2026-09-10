import type { Archer, BracketMatch, ScoringType } from './types'

export function createTop8Brackets(archers: Archer[], scoringType: ScoringType): BracketMatch[] {
  const ranked = [...archers].sort((a, b) => {
    const scoreA = calculateTotalScore(a)
    const scoreB = calculateTotalScore(b)
    return scoreB - scoreA
  })

  const top8 = ranked.slice(0, 8)
  const getArcherId = (idx: number) => top8[idx]?.id || undefined

  return [
    { id: 'Q1', stage: 'quarter', archer1Id: getArcherId(0), archer2Id: getArcherId(7), archer1Score: 0, archer2Score: 0, archer1ArrowScores: [], archer2ArrowScores: [] },
    { id: 'Q2', stage: 'quarter', archer1Id: getArcherId(3), archer2Id: getArcherId(4), archer1Score: 0, archer2Score: 0, archer1ArrowScores: [], archer2ArrowScores: [] },
    { id: 'Q3', stage: 'quarter', archer1Id: getArcherId(1), archer2Id: getArcherId(6), archer1Score: 0, archer2Score: 0, archer1ArrowScores: [], archer2ArrowScores: [] },
    { id: 'Q4', stage: 'quarter', archer1Id: getArcherId(2), archer2Id: getArcherId(5), archer1Score: 0, archer2Score: 0, archer1ArrowScores: [], archer2ArrowScores: [] },
    { id: 'S1', stage: 'semi', archer1Score: 0, archer2Score: 0, archer1ArrowScores: [], archer2ArrowScores: [] },
    { id: 'S2', stage: 'semi', archer1Score: 0, archer2Score: 0, archer1ArrowScores: [], archer2ArrowScores: [] },
    { id: 'BRONZE', stage: 'bronze', archer1Score: 0, archer2Score: 0, archer1ArrowScores: [], archer2ArrowScores: [] },
    { id: 'GOLD', stage: 'gold', archer1Score: 0, archer2Score: 0, archer1ArrowScores: [], archer2ArrowScores: [] },
  ]
}

function calculateTotalScore(archer: Archer): number {
  return archer.ends.flat().reduce((acc, val) => {
    if (!val || val === 'M') return acc
    if (val === 'X') return acc + 10
    const num = parseInt(val, 10)
    return acc + (isNaN(num) ? 0 : num)
  }, 0)
}

export function updateBracketProgression(matches: BracketMatch[]): BracketMatch[] {
  const updated = matches.map((m) => ({ ...m }))
  const getMatch = (id: string) => updated.find((m) => m.id === id)

  const q1 = getMatch('Q1')
  const q2 = getMatch('Q2')
  const q3 = getMatch('Q3')
  const q4 = getMatch('Q4')
  const s1 = getMatch('S1')
  const s2 = getMatch('S2')

  if (s1) {
    s1.archer1Id = q1?.winnerId
    s1.archer2Id = q2?.winnerId
  }
  if (s2) {
    s2.archer1Id = q3?.winnerId
    s2.archer2Id = q4?.winnerId
  }

  const bronze = getMatch('BRONZE')
  const gold = getMatch('GOLD')

  if (s1 && s2) {
    if (gold) {
      gold.archer1Id = s1.winnerId
      gold.archer2Id = s2.winnerId
    }
    if (bronze) {
      const s1Loser = s1.winnerId ? (s1.winnerId === s1.archer1Id ? s1.archer2Id : s1.archer1Id) : undefined
      const s2Loser = s2.winnerId ? (s2.winnerId === s2.archer1Id ? s2.archer2Id : s2.archer1Id) : undefined
      bronze.archer1Id = s1Loser
      bronze.archer2Id = s2Loser
    }
  }

  return updated
}
