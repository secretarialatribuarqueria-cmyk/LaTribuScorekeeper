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
  const getArcherName = (id?: string) => {
    if (!id) return 'Por definir'
    return archers.find((a) => a.id === id)?.name || 'Desconocido'
  }

  const renderMatchCard = (match: BracketMatch, label: string) => {
    const archer1 = getArcherName(match.archer1Id)
    const archer2 = getArcherName(match.archer2Id)
    const isReady = match.archer1Id && match.archer2Id

    return (
      <div
        onClick={() => isReady && onSelectMatch(match)}
        className={`flex flex-col gap-2 rounded-xl border p-3 transition-all ${
          isReady
            ? 'cursor-pointer border-border bg-card hover:border-primary shadow-sm'
            : 'border-dashed border-border/50 bg-card/40 opacity-60'
        }`}
      >
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>{label}</span>
          {match.winnerId && <span className="text-emerald-400">Finalizado</span>}
        </div>

        {/* Arquero 1 */}
        <div
          className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold ${
            match.winnerId === match.archer1Id ? 'bg-primary/20 text-primary' : 'bg-muted/50'
          }`}
        >
          <span className="truncate">{archer1}</span>
          <span className="font-mono font-bold">{match.archer1Score}</span>
        </div>

        {/* Arquero 2 */}
        <div
          className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold ${
            match.winnerId === match.archer2Id ? 'bg-primary/20 text-primary' : 'bg-muted/50'
          }`}
        >
          <span className="truncate">{archer2}</span>
          <span className="font-mono font-bold">{match.archer2Score}</span>
        </div>
      </div>
    )
  }

  const quarterMatches = matches.filter((m) => m.stage === 'quarter')
  const semiMatches = matches.filter((m) => m.stage === 'semi')
  const bronzeMatch = matches.find((m) => m.stage === 'bronze')
  const goldMatch = matches.find((m) => m.stage === 'gold')

  return (
    <div className="flex flex-col gap-6 p-2 overflow-x-auto">
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Swords className="size-5 text-primary" />
        <h2 className="font-display text-base font-bold uppercase">Llaves Eliminatorias (Top 8)</h2>
        <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
          {scoringType === 'sets' ? 'Por Sets (WA Recurvo)' : 'Puntaje Acumulado (WA Compuesto)'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[700px]">
        {/* Cuartos de Final */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cuartos de Final</h3>
          {quarterMatches.map((m, idx) => (
            <React.Fragment key={m.id}>{renderMatchCard(m, `Match Q${idx + 1}`)}</React.Fragment>
          ))}
        </div>

        {/* Semifinales */}
        <div className="flex flex-col justify-around gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Semifinales</h3>
          {semiMatches.map((m, idx) => (
            <React.Fragment key={m.id}>{renderMatchCard(m, `Semifinal ${idx + 1}`)}</React.Fragment>
          ))}
        </div>

        {/* Finales */}
        <div className="flex flex-col justify-between gap-6">
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Trophy className="size-4" /> Final de Oro
            </h3>
            {goldMatch && renderMatchCard(goldMatch, 'Oro / Plata')}
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
              <Trophy className="size-4" /> Final de Bronce
            </h3>
            {bronzeMatch && renderMatchCard(bronzeMatch, '3º / 4º Puesto')}
          </div>
        </div>
      </div>
    </div>
  )
}
