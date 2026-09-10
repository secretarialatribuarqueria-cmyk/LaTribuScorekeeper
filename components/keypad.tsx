'use client'

import type { KeypadKey } from '@/lib/types'

export function Keypad({
  keys,
  onPress,
  disabled,
}: {
  keys: KeypadKey[]
  onPress: (label: string) => void
  disabled?: boolean
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {keys.map((k) => (
        <button
          key={k.label}
          type="button"
          disabled={disabled}
          onClick={() => onPress(k.label)}
          style={{ backgroundColor: k.bg, color: k.fg }}
          className="flex h-14 items-center justify-center rounded-lg border border-black/20 font-display text-2xl font-bold tabular-nums shadow-sm transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {k.label}
        </button>
      ))}
    </div>
  )
}
