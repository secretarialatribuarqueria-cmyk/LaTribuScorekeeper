import { DISCIPLINES } from './disciplines'
import { arrowValue, endTotal } from './scoring'
import type {
  ArrowValue,
  BowType,
  DisciplineId,
  Match,
  MatchArcher,
  MatchEnd,
  MatchFormat,
} from './types'

/** Set points needed to win a Set-system match. */
export const SET_POINTS_TO_WIN = 6

export interface MatchFormatInfo {
  format: MatchFormat
  numEnds: number
  arrowsPerEnd: number
  fixedArrows: boolean
  endLabel: string
}

/**
 * Resolve the match format from discipline + bow type.
 *
 * - Indoor / Outdoor (Target):
 *   - Compound  → cumulative total, 5 ends × 3 arrows.
 *   - Recurve / Barebow / Traditional / Longbow → Set system, up to 5 sets × 3 arrows.
 * - Field / 3D (JJCC): cumulative total over exactly 4 targets.
 */
export function matchFormatFor(
  disciplineId: DisciplineId,
  bowType: BowType,
): MatchFormatInfo {
  const config = DISCIPLINES[disciplineId]

  if (disciplineId === 'field' || disciplineId === '3d') {
    return {
      format: 'cumulative',
      numEnds: 4,
      arrowsPerEnd: config.arrowsPerEnd,
      fixedArrows: config.fixedArrows,
      endLabel: config.endLabel,
    }
  }

  if (bowType === 'Compuesto') {
    return {
      format: 'cumulative',
      numEnds: 5,
      arrowsPerEnd: 3,
      fixedArrows: true,
      endLabel: 'Tanda',
    }
  }

  return {
    format: 'sets',
    numEnds: 5,
    arrowsPerEnd: 3,
    fixedArrows: true,
    endLabel: 'Set',
  }
}

export function createEmptyMatchEnds(
  numEnds: number,
  arrowsPerEnd: number,
): MatchEnd[] {
  return Array.from(
    { length: numEnds },
    () =>
      [
        Array.from({ length: arrowsPerEnd }, () => null),
        Array.from({ length: arrowsPerEnd }, () => null),
      ] as MatchEnd,
  )
}

export type Side = 'a' | 'b' | 'tie'

export interface EndScore {
  aSum: number
  bSum: number
  complete: boolean
  winner: Side | null
}

export interface MatchResult {
  format: MatchFormat
  ends: EndScore[]
  aSetPoints: number
  bSetPoints: number
  aTotal: number
  bTotal: number
  status: 'in-progress' | 'needs-shootoff' | 'complete'
  winner: Side | null
  /** End index at which the set match became mathematically decided. */
  decidedEnd: number | null
  shootOffWinner: Side | null
}

function isEndComplete(match: Match, arrows: ArrowValue[]): boolean {
  return match.fixedArrows
    ? arrows.every((a) => a != null)
    : arrows.some((a) => a != null)
}

export function computeMatch(match: Match): MatchResult {
  const config = DISCIPLINES[match.disciplineId]

  const ends: EndScore[] = match.ends.map(([a, b]) => {
    const aSum = endTotal(config, a)
    const bSum = endTotal(config, b)
    const complete = isEndComplete(match, a) && isEndComplete(match, b)
    let winner: Side | null = null
    if (complete) winner = aSum > bSum ? 'a' : bSum > aSum ? 'b' : 'tie'
    return { aSum, bSum, complete, winner }
  })

  const aTotal = ends.reduce((s, e) => s + e.aSum, 0)
  const bTotal = ends.reduce((s, e) => s + e.bSum, 0)

  const so = match.shootOff
  let shootOffWinner: Side | null = null
  if (so && so[0] != null && so[1] != null) {
    const av = arrowValue(config, so[0])
    const bv = arrowValue(config, so[1])
    shootOffWinner = av > bv ? 'a' : bv > av ? 'b' : 'tie'
  }

  if (match.format === 'sets') {
    let aSetPoints = 0
    let bSetPoints = 0
    let decidedEnd: number | null = null

    for (let i = 0; i < ends.length; i++) {
      const e = ends[i]
      if (!e.complete) break
      if (e.winner === 'a') aSetPoints += 2
      else if (e.winner === 'b') bSetPoints += 2
      else {
        aSetPoints += 1
        bSetPoints += 1
      }
      if (
        decidedEnd === null &&
        (aSetPoints >= SET_POINTS_TO_WIN || bSetPoints >= SET_POINTS_TO_WIN)
      ) {
        decidedEnd = i
      }
    }

    let status: MatchResult['status'] = 'in-progress'
    let winner: Side | null = null

    if (aSetPoints >= SET_POINTS_TO_WIN && aSetPoints > bSetPoints) {
      status = 'complete'
      winner = 'a'
    } else if (bSetPoints >= SET_POINTS_TO_WIN && bSetPoints > aSetPoints) {
      status = 'complete'
      winner = 'b'
    } else if (ends.every((e) => e.complete) && aSetPoints === bSetPoints) {
      // Tied 5-5 on set points after all sets → Flecha de Oro (shoot-off).
      if (shootOffWinner) {
        status = 'complete'
        winner = shootOffWinner
      } else {
        status = 'needs-shootoff'
      }
    }

    return {
      format: 'sets',
      ends,
      aSetPoints,
      bSetPoints,
      aTotal,
      bTotal,
      status,
      winner,
      decidedEnd,
      shootOffWinner,
    }
  }

  // Cumulative: decided by total after all ends are complete.
  const allComplete = ends.every((e) => e.complete)
  let status: MatchResult['status'] = 'in-progress'
  let winner: Side | null = null

  if (allComplete) {
    if (aTotal > bTotal) {
      status = 'complete'
      winner = 'a'
    } else if (bTotal > aTotal) {
      status = 'complete'
      winner = 'b'
    } else if (shootOffWinner) {
      status = 'complete'
      winner = shootOffWinner
    } else {
      status = 'needs-shootoff'
    }
  }

  return {
    format: 'cumulative',
    ends,
    aSetPoints: 0,
    bSetPoints: 0,
    aTotal,
    bTotal,
    status,
    winner,
    decidedEnd: null,
    shootOffWinner,
  }
}

export interface MatchDraft {
  name: string
  category: string
  bowType: BowType
}

export function buildMatch(
  disciplineId: DisciplineId,
  drafts: [MatchDraft, MatchDraft],
): Match {
  // Both archers compete in the same division; the compound rule applies when
  // either selected archer shoots compound in a Target discipline.
  const compound =
    drafts[0].bowType === 'Compuesto' || drafts[1].bowType === 'Compuesto'
  const info = matchFormatFor(
    disciplineId,
    compound ? 'Compuesto' : drafts[0].bowType,
  )

  const archers = drafts.map((d, i) => ({
    id: `match-archer-${Date.now()}-${i}`,
    name: d.name.trim() || `Arquero ${i + 1}`,
    category: d.category.trim(),
    bowType: d.bowType,
  })) as [MatchArcher, MatchArcher]

  return {
    kind: 'match',
    disciplineId,
    format: info.format,
    endLabel: info.endLabel,
    numEnds: info.numEnds,
    arrowsPerEnd: info.arrowsPerEnd,
    fixedArrows: info.fixedArrows,
    archers,
    ends: createEmptyMatchEnds(info.numEnds, info.arrowsPerEnd),
    shootOff: null,
    createdAt: Date.now(),
  }
}
