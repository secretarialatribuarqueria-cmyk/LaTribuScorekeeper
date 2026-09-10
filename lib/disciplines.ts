import type { DisciplineConfig, DisciplineId, KeypadKey } from './types'

// Official World Archery target colors
const WA = {
  gold: { bg: '#FFD54A', fg: '#1a1a1a' }, // X, 10, 9
  red: { bg: '#E4002B', fg: '#ffffff' }, // 8, 7
  blue: { bg: '#0072CE', fg: '#ffffff' }, // 6, 5
  black: { bg: '#1a1a1a', fg: '#ffffff' }, // 4, 3
  white: { bg: '#f4f1e6', fg: '#1a1a1a' }, // 2, 1
  miss: { bg: '#5a6b60', fg: '#ffffff' }, // M
}

// Clean high-contrast keys for Field / 3D
const CLEAN = { bg: '#1c2b21', fg: '#f4f1e6' }
const CLEAN_MISS = { bg: '#5a6b60', fg: '#ffffff' }
const CLEAN_TOP = { bg: '#2f9e57', fg: '#0b140d' }

function key(label: string, value: number, c: { bg: string; fg: string }): KeypadKey {
  return { label, value, bg: c.bg, fg: c.fg }
}

// World Archery keypad shared by Indoor and Outdoor
const WA_KEYPAD: KeypadKey[] = [
  key('X', 10, WA.gold),
  key('10', 10, WA.gold),
  key('9', 9, WA.gold),
  key('8', 8, WA.red),
  key('7', 7, WA.red),
  key('6', 6, WA.blue),
  key('5', 5, WA.blue),
  key('4', 4, WA.black),
  key('3', 3, WA.black),
  key('2', 2, WA.white),
  key('1', 1, WA.white),
  key('M', 0, WA.miss),
]

const FIELD_KEYPAD: KeypadKey[] = [
  key('6', 6, CLEAN_TOP),
  key('5', 5, CLEAN_TOP),
  key('4', 4, CLEAN),
  key('3', 3, CLEAN),
  key('2', 2, CLEAN),
  key('1', 1, CLEAN),
  key('M', 0, CLEAN_MISS),
]

const THREED_KEYPAD: KeypadKey[] = [
  key('11', 11, CLEAN_TOP),
  key('10', 10, CLEAN_TOP),
  key('8', 8, CLEAN),
  key('5', 5, CLEAN),
  key('M', 0, CLEAN_MISS),
]

export const DISCIPLINES: Record<DisciplineId, DisciplineConfig> = {
  indoor: {
    id: 'indoor',
    name: 'Sala / Indoor',
    endLabel: 'Tanda',
    ends: 10,
    arrowsPerEnd: 3,
    fixedArrows: true,
    keypad: WA_KEYPAD,
  },
  outdoor: {
    id: 'outdoor',
    name: 'Aire Libre / Outdoor',
    endLabel: 'Tanda',
    ends: 12,
    arrowsPerEnd: 6,
    fixedArrows: true,
    keypad: WA_KEYPAD,
  },
  field: {
    id: 'field',
    name: 'Juegos de Campo / Field',
    endLabel: 'Diana',
    ends: 24,
    arrowsPerEnd: 3,
    fixedArrows: true,
    keypad: FIELD_KEYPAD,
  },
  '3d': {
    id: '3d',
    name: '3D',
    endLabel: 'Diana',
    ends: 24,
    arrowsPerEnd: 2,
    fixedArrows: false,
    keypad: THREED_KEYPAD,
  },
}

export const DISCIPLINE_LIST = Object.values(DISCIPLINES)
