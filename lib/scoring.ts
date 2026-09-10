import type { Archer, EndScore, ArrowScore } from './types'

export function parseArrowValue(input: string): ArrowScore {
  const clean = input.trim().toUpperCase()
  if (clean === 'X') return { value: 10, display: 'X' }
  if (clean === 'M' || clean === '0') return { value: 0, display: 'M' }
  const num = parseInt(clean, 10)
  if (!isNaN(num) && num >= 1 && num <= 10) {
    return { value: num, display: num.toString() }
  }
  return { value: 0, display: 'M' }
}

export function calculateEndTotal(arrows: ArrowScore[]): number {
  return arrows.reduce((sum, a) => sum + a.value, 0)
}

export function calculateTotalScore(archer: Archer): number {
  if (!archer.scores) return 0
  return archer.scores.reduce((sum, end) => sum + end.total, 0)
}

export function calculateXs(archer: Archer): number {
  if (!archer.scores) return 0
  return archer.scores.reduce(
    (sum, end) => sum + end.arrows.filter((a) => a.display === 'X').length,
    0
  )
}

export function calculateTens(archer: Archer): number {
  if (!archer.scores) return 0
  return archer.scores.reduce(
    (sum, end) => sum + end.arrows.filter((a) => a.value === 10).length,
    0
  )
}
