'use client'

import { Trophy, RefreshCw } from 'lucide-react'
import type { Archer } from '@/lib/types'
import { RankingTable } from './RankingTable'

interface SummaryViewProps {
  archers: Archer[]
  onReset: () => void
}

export function SummaryView({ archers, onReset }: SummaryViewProps) {
  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-emerald-400" />
          <h1 className="text-xl font-bold uppercase text-white">Resumen del Torneo</h1>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Nueva Sesión
        </button>
      </div>

      <RankingTable archers={archers} />
    </div>
  )
}
