import { DISCIPLINES } from './disciplines'
import type { Archer, ArrowValue, DisciplineConfig, KeypadKey } from './types'

/** Look up the point value of an arrow label within a discipline's keypad. */
export function arrowValue(config: DisciplineConfig, label: ArrowValue): number {
  if (label == null) return 0
  const k = config.keypad.find((key) => key.label === label)
  return k ? k.value : 0
}

/** Look up the full keypad key (for coloring) for an arrow label. */
export function arrowKey(
  config: DisciplineConfig,
  label: ArrowValue,
): KeypadKey | undefined {
  if (label == null) return undefined
  return config.keypad.find((key) => key.label === label)
}

/** Total points for a single end. */
export function endTotal(config: DisciplineConfig, end: ArrowValue[]): number {
  return end.reduce<number>((sum, a) => sum + arrowValue(config, a), 0)
}

/** Number of arrows actually recorded (non-null) in an end. */
export function endArrowCount(end: ArrowValue[]): number {
  return end.filter((a) => a != null).length
}

export interface ArcherStats {
  total: number
  arrows: number
  average: number
  countX: number
  count10: number
  count11: number
  endTotals: number[]
  runningTotals: number[]
}

export function computeStats(config: DisciplineConfig, archer: Archer): ArcherStats {
  let total = 0
  let arrows = 0
  let countX = 0
  let count10 = 0
  let count11 = 0
  const endTotals: number[] = []
  const runningTotals: number[] = []

  for (const end of archer.ends) {
    let et = 0
    for (const a of end) {
      if (a == null) continue
      arrows += 1
      const v = arrowValue(config, a)
      et += v
      if (a === 'X') countX += 1
      if (a === '10') count10 += 1
      if (a === '11') count11 += 1
    }
    total += et
    endTotals.push(et)
    runningTotals.push(total)
  }

  const average = arrows > 0 ? total / arrows : 0
  return { total, arrows, average, countX, count10, count11, endTotals, runningTotals }
}

/** Sort an end's recorded arrows high → low for display. Nulls dropped. */
export function sortedArrows(
  config: DisciplineConfig,
  end: ArrowValue[],
): ArrowValue[] {
  return end
    .filter((a) => a != null)
    .sort((a, b) => arrowValue(config, b) - arrowValue(config, a))
}

export function createEmptyEnds(config: DisciplineConfig): ArrowValue[][] {
  return Array.from({ length: config.ends }, () =>
    Array.from({ length: config.arrowsPerEnd }, () => null),
  )
}

export function configFor(id: keyof typeof DISCIPLINES) {
  return DISCIPLINES[id]
}
