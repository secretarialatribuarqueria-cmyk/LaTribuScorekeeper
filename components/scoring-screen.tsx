'use client'

import React from 'react'
import { Target, RotateCcw } from 'lucide-react'

interface ScoringScreenProps {
  tournament: any
  activeArcher?: number
  setActiveArcher?: (index: number) => void
  onSetArrow?: (...args: any[]) => void
  onReset?: () => void
  onViewSummary?: () => void
  onViewRanking?: () => void
  session?: any
}

export function ScoringScreen({
  tournament,
  activeArcher = 0,
  setActiveArcher,
  onReset,
}: ScoringScreenProps) {
  const currentSession = tournament || {}
  const archers = currentSession.archers || []

  return (
    <div className="min-h-screen bg-[#0a120c] text-white p-4 max-w-4xl mx-auto flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-900/50 pb-4">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-emerald-400" />
          <h1 className="text-lg font-black uppercase text-emerald-100">Planilla de Anotación</h1>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs bg-red-950/60 border border-red-900/50 text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-900/40"
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
            onClick={() => setActiveArcher && setActiveArcher(idx)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all whitespace-nowrap ${
              activeArcher === idx
                ? 'bg-emerald-600 border-emerald-400 text-white'
                : 'bg-[#111c14] border-emerald-900/40 text-zinc-400 hover:border-emerald-800'
            }`}
          >
            {archer.name || `Arquero ${idx + 1}`}
          </button>
        ))}
      </div>

      {/* Contenido de Anotación */}
      <div className="bg-[#111c14] border border-emerald-900/40 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] text-center gap-3">
        <Target className="w-12 h-12 text-emerald-400/50" />
        <h2 className="text-base font-bold text-emerald-100">
          Sesión Activa: {archers[activeArcher]?.name || 'Arquero 1'}
        </h2>
        <p className="text-xs text-zinc-400 max-w-sm">
          Formato: <span className="text-emerald-400 uppercase">{currentSession.format || 'Patrulla'}</span> · Disciplina:{' '}
          <span className="text-emerald-400 uppercase">{currentSession.disciplineId || 'Indoor'}</span>
        </p>
      </div>
    </div>
  )
}
