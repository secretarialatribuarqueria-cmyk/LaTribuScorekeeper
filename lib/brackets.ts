import type { Archer, BracketMatch } from './types'

export function createTop8Brackets(archers: Archer[]): BracketMatch[] {
  const ranked = [...archers].sort((a, b) => {
    const scoreA = calculateTotalScore(a)
    const scoreB = calculateTotalScore(b)
    return scoreB - scoreA
  })

  const top8 = ranked.slice(0, 8)
  const getArcherId = (idx: number) => top8[idx]?.id || null

  return [
    { id: 'QF1', round: 'QF', archer1Id: getArcherId(0), archer2Id: getArcherId(7), archer1Sets: 0, archer2Sets: 0, archer1Cumulative: 0, archer2Cumulative: 0, winnerId: null, ends: [], isFinished: false },
    { id: 'QF2', round: 'QF', archer1Id: getArcherId(3), archer2Id: getArcherId(4), archer1Sets: 0, archer2Sets: 0, archer1Cumulative: 0, archer2Cumulative: 0, winnerId: null, ends: [], isFinished: false },
    { id: 'QF3', round: 'QF', archer1Id: getArcherId(1), archer2Id: getArcherId(6), archer1Sets: 0, archer2Sets: 0, archer1Cumulative: 0, archer2Cumulative: 0, winnerId: null, ends: [], isFinished: false },
    { id: 'QF4', round: 'QF', archer1Id: getArcherId(2), archer2Id: getArcherId(5), archer1Sets: 0, archer2Sets: 0, archer1Cumulative: 0, archer2Cumulative: 0, winnerId: null, ends: [], isFinished: false },
    { id: 'SF1', round: 'SF', archer1Id: null, archer2Id: null, archer1Sets: 0, archer2Sets: 0, archer1Cumulative: 0, archer2Cumulative: 0, winnerId: null, ends: [], isFinished: false },
    { id: 'SF2', round: 'SF', archer1Id: null, archer2Id: null, archer1Sets: 0, archer2Sets: 0, archer1Cumulative: 0, archer2Cumulative: 0, winnerId: null, ends: [], isFinished: false },
    { id: 'BRONZE', round: 'BRONZE', archer1Id: null, archer2Id: null, archer1Sets: 0, archer2Sets: 0, archer1Cumulative: 0, archer2Cumulative: 0, winnerId: null, ends: [], isFinished: false },
    { id: 'GOLD', round: 'GOLD', archer1Id: null, archer2Id: null, archer1Sets: 0, archer2Sets: 0, archer1Cumulative: 0, archer2Cumulative: 0, winnerId: null, ends: [], isFinished: false },
  ]
}

function calculateTotalScore(archer: Archer): number {
  if (!archer.scores) return 0
  return archer.scores.reduce((acc, end) => acc + end.total, 0)
}

export function updateBracketProgression(matches: BracketMatch[]): BracketMatch[] {
  const updated = matches.map((m) => ({ ...m }))
  const getMatch = (id: string) => updated.find((m) => m.id === id)

  const qf1 = getMatch('QF1')
  const qf2 = getMatch('QF2')
  const qf3 = getMatch('QF3')
  const qf4 = getMatch('QF4')
  const sf1 = getMatch('SF1')
  const sf2 = getMatch('SF2')

  if (sf1) {
    sf1.archer1Id = qf1?.winnerId || null
    sf1.archer2Id = qf2?.winnerId || null
  }
  if (sf2) {
    sf2.archer1Id = qf3?.winnerId || null
    sf2.archer2Id = qf4?.winnerId || null
  }

  const bronze = getMatch('BRONZE')
  const gold = getMatch('GOLD')

  if (sf1 && sf2) {
    if (gold) {
      gold.archer1Id = sf1.winnerId
      gold.archer2Id = sf2.winnerId
    }
    if (bronze) {
      const sf1Loser = sf1.winnerId ? (sf1.winnerId === sf1.archer1Id ? sf1.archer2Id : sf1.archer1Id) : null
      const sf2Loser = sf2.winnerId ? (sf2.winnerId === sf2.archer1Id ? sf2.archer2Id : sf2.archer1Id) : null
      bronze.archer1Id = sf1Loser
      bronze.archer2Id = sf2Loser
    }
  }

  return updated
}
