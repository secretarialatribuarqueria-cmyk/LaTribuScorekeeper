import type { BracketMatch, ArrowScore } from './types'

export function processMatchEnd(
  match: BracketMatch,
  a1Arrows: ArrowScore[],
  a2Arrows: ArrowScore[],
  scoringType: 'set' | 'cumulative'
): BracketMatch {
  const sum1 = a1Arrows.reduce((sum, a) => sum + a.value, 0)
  const sum2 = a2Arrows.reduce((sum, a) => sum + a.value, 0)

  let sets1 = match.archer1Sets
  let sets2 = match.archer2Sets

  if (scoringType === 'set') {
    if (sum1 > sum2) sets1 += 2
    else if (sum2 > sum1) sets2 += 2
    else {
      sets1 += 1
      sets2 += 1
    }
  }

  let winnerId = match.winnerId
  if (scoringType === 'set' && (sets1 >= 6 || sets2 >= 6)) {
    if (sets1 > sets2) winnerId = match.archer1Id
    else if (sets2 > sets1) winnerId = match.archer2Id
  }

  return {
    ...match,
    archer1Sets: sets1,
    archer2Sets: sets2,
    archer1Cumulative: match.archer1Cumulative + sum1,
    archer2Cumulative: match.archer2Cumulative + sum2,
    winnerId,
    isFinished: !!winnerId,
  }
}
