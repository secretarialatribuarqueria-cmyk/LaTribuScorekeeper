import type { Archer, ArrowScore } from './types'

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

export function calculateTotalScore(archer: Archer): number {
  if (!archer || !archer.scores) return 0
  return archer.scores.reduce((sum, end) => sum + (end.total || 0), 0)
}

export function calculateXs(archer: Archer): number {
  if (!archer || !archer.scores) return 0
  return archer.scores.reduce(
    (sum, end) => sum + (end.arrows ? end.arrows.filter((a) => a.display === 'X').length : 0),
    0
  )
}

export function calculateTens(archer: Archer): number {
  if (!archer || !archer.scores) return 0
  return archer.scores.reduce(
    (sum, end) => sum + (end.arrows ? end.arrows.filter((a) => a.value === 10).length : 0),
    0
  )
}
