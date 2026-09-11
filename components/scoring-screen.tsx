'use client'

import React, { useState } from 'react'
import { Target, RotateCcw, Award } from 'lucide-react'

interface ScoringScreenProps {
  tournament: any
  activeArcher?: number
  setActiveArcher?: (index: number) => void
  onSetArrow?: (archerIdx: number, end: number, arrowIdx: number, val: string | number) => void
  onReset?: () => void
  onViewSummary?: () => void
  onViewRanking?: () => void
}

export function ScoringScreen({
  tournament,
  activeArcher: externalActiveArcher = 0,
  setActiveArcher: externalSetActiveArcher,
  onSetArrow,
  onReset,
}: ScoringScreenProps) {
  const [internalActiveArcher, setInternalActiveArcher] = useState(0)
  const [currentEnd, setCurrentEnd] = useState(0)

  const activeArcherIdx = externalSetActiveArcher ? externalActiveArcher : internalActiveArcher
  const changeArcher = (idx: number) => {
    if (externalSetActiveArcher) {
      externalSetActiveArcher(idx)
    } else {
      setInternalActiveArcher(idx)
    }
  }

  const session = tournament || {}
  const archers = session.archers || []
  const currentArcher = archers[activeArcherIdx] || { name: 'Arquero', scores: [] }

  const handleKeyClick = (val: string | number) => {
    if (onSetArrow) {
      const arrowIndexInEnd = (currentArcher.scores || []).length % 3
      onSetArrow(activeArcherIdx, currentEnd, arrowIndexInEnd, val)
    }
  }

  const keyValues = ['X', 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'M']

  return (
    <div className="min-h-screen bg-[#0a120c] text-white p-4 max-w-2xl mx-auto flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-900/50 pb-4">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-emerald-400" />
          <h1 className="text-lg font-black uppercase text-emerald-100">Planilla de Anotación</h1>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs bg-red-950/60 border border-red-900/50 text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-900/40 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Salir / Reiniciar
          </button>
        )}
      </div>

      {/* Selector de Arqueros */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {archers.map((archer: any, idx: number) => (
          <button
            key={idx}
            onClick={() => changeArcher(idx)}
            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeArcherIdx === idx
                ? 'bg-emerald-600 border-emerald-400 text-white'
                : 'bg-[#111c14] border-emerald-900/40 text-zinc-400'
            }`}
          >
            {archer.name || `Arquero ${idx + 1}`}
          </button>
        ))}
      </div>

      {/* Tarjeta del Arquero */}
      <div className="bg-[#111c14] border border-emerald-900/40 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">ARQUERO ACTIVO</p>
          <h2 className="text-xl font-extrabold text-white">{currentArcher.name}</h2>
          <p className="text-xs text-zinc-400">
            Tanda <span className="text-emerald-400 font-bold">{currentEnd + 1}</span> / 10
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#0a120c] px-4 py-2 rounded-xl border border-emerald-900/60">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="text-xl font-black text-emerald-300">
            {(currentArcher.scores || []).reduce((acc: number, curr: any) => {
              if (curr === 'X' || curr === 10) return acc + 10
              if (typeof curr === 'number') return acc + curr
              return acc
            }, 0)}
          </span>
        </div>
      </div>

      {/* Teclado de Anotación (Keypad) */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">INGRESAR PUNTUACIÓN</label>
        <div className="grid grid-cols-4 gap-2">
          {keyValues.map((val) => (
            <button
              key={val}
              onClick={() => handleKeyClick(val)}
              className="py-4 rounded-xl bg-[#111c14] border border-emerald-900/60 text-lg font-black text-emerald-100 hover:bg-emerald-900/50 hover:border-emerald-500 active:scale-95 transition-all cursor-pointer"
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* Control de Tandas */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setCurrentEnd((prev) => Math.max(0, prev - 1))}
          disabled={currentEnd === 0}
          className="px-4 py-2 rounded-lg bg-[#111c14] border border-emerald-900/40 text-xs text-zinc-300 disabled:opacity-40"
        >
          Tanda Anterior
        </button>
        <button
          onClick={() => setCurrentEnd((prev) => prev + 1)}
          className="px-4 py-2 rounded-lg bg-emerald-700 text-xs font-bold text-white hover:bg-emerald-600"
        >
          Siguiente Tanda
        </button>
      </div>
    </div>
  )
}
