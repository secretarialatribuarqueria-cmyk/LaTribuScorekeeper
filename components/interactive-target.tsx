'use client'

import React from 'react'

interface InteractiveTargetProps {
  onScoreSelect: (score: string | number) => void
  disciplineId?: string
}

export function InteractiveTarget({ onScoreSelect, disciplineId = 'indoor_18m' }: InteractiveTargetProps) {
  // Ajuste visual y de puntuación según la disciplina
  const is3D = disciplineId.includes('3d')
  const isField = disciplineId.includes('field') || disciplineId.includes('jjcc')

  if (is3D) {
    return (
      <div className="flex flex-col items-center gap-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Silueta 3D (Zonas de Impacto)
        </span>
        <svg viewBox="0 0 300 300" className="size-64 cursor-pointer select-none drop-shadow-md">
          {/* Silueta / Zona Cuerpo (5 Pts) */}
          <circle cx="150" cy="150" r="130" fill="#78350f" stroke="#451a03" strokeWidth="4" onClick={() => onScoreSelect('5')} />
          {/* Zona Vital (8 Pts) */}
          <circle cx="150" cy="150" r="80" fill="#b45309" stroke="#78350f" strokeWidth="3" onClick={() => onScoreSelect('8')} />
          {/* Zona 10 Pts */}
          <circle cx="150" cy="150" r="45" fill="#d97706" stroke="#b45309" strokeWidth="2" onClick={() => onScoreSelect('10')} />
          {/* Centro 11 / 12 Pts */}
          <circle cx="150" cy="150" r="20" fill="#fef08a" stroke="#d97706" strokeWidth="2" onClick={() => onScoreSelect('11')} />
          <text x="150" y="154" textAnchor="middle" fill="#451a03" fontSize="12" fontWeight="bold" pointerEvents="none">11</text>
        </svg>
        <div className="flex gap-2">
          <button type="button" onClick={() => onScoreSelect('M')} className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-lg">
            M (Cero)
          </button>
        </div>
      </div>
    )
  }

  if (isField) {
    return (
      <div className="flex flex-col items-center gap-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Diana de Campo / JJCC (6 a 1)
        </span>
        <svg viewBox="0 0 300 300" className="size-64 cursor-pointer select-none drop-shadow-md">
          {/* Anillos Negros (1 a 4 pts) */}
          <circle cx="150" cy="150" r="140" fill="#18181b" stroke="#3f3f46" strokeWidth="2" onClick={() => onScoreSelect('1')} />
          <circle cx="150" cy="150" r="115" fill="#18181b" stroke="#3f3f46" strokeWidth="2" onClick={() => onScoreSelect('2')} />
          <circle cx="150" cy="150" r="90" fill="#18181b" stroke="#3f3f46" strokeWidth="2" onClick={() => onScoreSelect('3')} />
          <circle cx="150" cy="150" r="65" fill="#18181b" stroke="#3f3f46" strokeWidth="2" onClick={() => onScoreSelect('4')} />
          {/* Centro Amarillo (5 y 6 pts) */}
          <circle cx="150" cy="150" r="40" fill="#eab308" stroke="#ca8a04" strokeWidth="2" onClick={() => onScoreSelect('5')} />
          <circle cx="150" cy="150" r="18" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" onClick={() => onScoreSelect('6')} />
          <circle cx="150" cy="150" r="8" fill="#eab308" stroke="#ca8a04" strokeWidth="1" onClick={() => onScoreSelect('+')} />
        </svg>
        <button type="button" onClick={() => onScoreSelect('M')} className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-lg">
          M (Miss)
        </button>
      </div>
    )
  }

  // Diana Target Estándar (Indoor / Outdoor 10 a 1)
  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 300 300" className="size-64 cursor-pointer select-none drop-shadow-md">
        <circle cx="150" cy="150" r="140" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" onClick={() => onScoreSelect('1')} />
        <circle cx="150" cy="150" r="126" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" onClick={() => onScoreSelect('2')} />
        <circle cx="150" cy="150" r="112" fill="#000000" stroke="#334155" strokeWidth="2" onClick={() => onScoreSelect('3')} />
        <circle cx="150" cy="150" r="98" fill="#000000" stroke="#334155" strokeWidth="2" onClick={() => onScoreSelect('4')} />
        <circle cx="150" cy="150" r="84" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" onClick={() => onScoreSelect('5')} />
        <circle cx="150" cy="150" r="70" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" onClick={() => onScoreSelect('6')} />
        <circle cx="150" cy="150" r="56" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" onClick={() => onScoreSelect('7')} />
        <circle cx="150" cy="150" r="42" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" onClick={() => onScoreSelect('8')} />
        <circle cx="150" cy="150" r="28" fill="#eab308" stroke="#ca8a04" strokeWidth="2" onClick={() => onScoreSelect('9')} />
        <circle cx="150" cy="150" r="14" fill="#eab308" stroke="#ca8a04" strokeWidth="2" onClick={() => onScoreSelect('10')} />
        <circle cx="150" cy="150" r="6" fill="#eab308" stroke="#ca8a04" strokeWidth="1" onClick={() => onScoreSelect('X')} />
      </svg>
      <button type="button" onClick={() => onScoreSelect('M')} className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-lg">
        M (Miss)
      </button>
    </div>
  )
}
