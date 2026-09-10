'use client'

import React from 'react'
import { Trophy, Swords } from 'lucide-react'
import type { Archer, BracketMatch, ScoringType } from '@/lib/types'

interface BracketViewProps {
  matches: BracketMatch[]
  archers: Archer[]
  scoringType: ScoringType
  onSelectMatch: (match: BracketMatch) => void
}

export function BracketView({ matches, archers, scoringType, onSelectMatch }: BracketViewProps) {
  const getArcherName = (id: string | null) => {
    if (!id) return 'Por definir'
    return archers.find((a) => a.id === id)?.name || 'Desconocido'
  }

  const renderMatchCard = (match: BracketMatch, label: string) => {
    const archer1 = getArcherName(match.archer1Id)
    const archer2 = getArcherName(match.archer2Id)
    const isReady = match.archer1Id && match.archer2Id

    const score1 = scoringType === 'set' ? match.archer1Sets : match.archer1Cumulative
    const score2 = scoringType === 'set' ? match.archer2Sets : match.archer2Cumulative

    return (
      <div
        onClick={() => isReady && onSelectMatch(match)}
        className={`flex flex-col gap-2 rounded-xl border p-3 transition-all ${
          isReady
            ? 'cursor-pointer border-zinc-800 bg-zinc-900 hover:border-emerald-500 shadow-sm'
            : 'border-dashed border-zinc-800 bg-zinc-900/40 opacity-60'
        }`}
      >
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          <span>{label}</span>
          {match.winnerId && <span className="text-emerald-400">Finalizado</span>}
        </div>

        <div
          className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold ${
            match.winnerId === match.archer1Id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-300'
          }`}
        >
          <span className="truncate">{archer1}</span>
          <span className="font-mono font-bold">{score1}</span>
        </div>

        <div
          className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold ${
            match.winnerId === match.archer2Id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-300'
          }`}
        >
          <span className="truncate">{archer2}</span>
          <span className="font-mono font-bold">{score2}</span>
        </div>
      </div>
    )
  }

  const quarterMatches = matches.filter((m) => m.round === 'QF')
  const semiMatches = matches.filter((m) => m.round === 'SF')
  const bronzeMatch = matches.find((m) => m.round === 'BRONZE')
  const goldMatch = matches.find((m) => m.round === 'GOLD')

  return (
    <div className="flex flex-col gap-6 p-2 overflow-x-auto">
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <Swords className="w-5 h-5 text-emerald-400" />
        <h2 className="font-display text-base font-bold uppercase text-white">Llaves Eliminatorias (Top 8)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[700px]">
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Cuartos de Final</h3>
          {quarterMatches.map((m, idx) => (
            <React.Fragment key={m.id}>{renderMatchCard(m, `Match QF${idx + 1}`)}</React.Fragment>
          ))}
        </div>

        <div className="flex flex-col justify-around gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Semifinales</h3>
          {semiMatches.map((m, idx) => (
            <React.Fragment key={m.id}>{renderMatchCard(m, `Semifinal ${idx + 1}`)}</React.Fragment>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-6">
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Trophy className="w-4 h-4" /> Final de Oro
            </h3>
            {goldMatch && renderMatchCard(goldMatch, 'Oro / Plata')}
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
              <Trophy className="w-4 h-4" /> Final de Bronce
            </h3>
            {bronzeMatch && renderMatchCard(bronzeMatch, '3º / 4º Puesto')}
          </div>
        </div>
      </div>
    </div>
  )
}
