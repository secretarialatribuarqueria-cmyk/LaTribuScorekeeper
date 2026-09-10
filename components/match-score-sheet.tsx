'use client'

import { useState } from 'react'
import { ArrowLeft, Award, CheckCircle2 } from 'lucide-react'
import type { Archer, BracketMatch, Discipline, ScoringType } from '@/lib/types'

interface MatchScoreSheetProps {
  match: BracketMatch
  archers: Archer[]
  discipline: Discipline
  scoringType: ScoringType
  onSaveMatch: (updatedMatch: BracketMatch) => void
  onBack: () => void
}

export function MatchScoreSheet({
  match,
  archers,
  scoringType,
  onSaveMatch,
  onBack,
}: MatchScoreSheetProps) {
  const archer1 = archers.find((a) => a.id === match.archer1Id)
  const archer2 = archers.find((a) => a.id === match.archer2Id)

  const [a1Set, setA1Set] = useState<string[]>(['', '', ''])
  const [a2Set, setA2Set] = useState<string[]>(['', '', ''])
  const [currentMatch, setCurrentMatch] = useState<BracketMatch>(match)

  const parseValue = (val: string) => {
    if (!val || val === 'M') return 0
    if (val === 'X') return 10
    return parseInt(val, 10) || 0
  }

  const handleConfirmEnd = () => {
    const sum1 = a1Set.reduce((acc, v) => acc + parseValue(v), 0)
    const sum2 = a2Set.reduce((acc, v) => acc + parseValue(v), 0)

    let newSets1 = currentMatch.archer1Sets
    let newSets2 = currentMatch.archer2Sets
    let newCum1 = currentMatch.archer1Cumulative + sum1
    let newCum2 = currentMatch.archer2Cumulative + sum2

    if (scoringType === 'set') {
      if (sum1 > sum2) newSets1 += 2
      else if (sum2 > sum1) newSets2 += 2
      else {
        newSets1 += 1
        newSets2 += 1
      }
    }

    let winnerId = currentMatch.winnerId

    if (scoringType === 'set' && (newSets1 >= 6 || newSets2 >= 6)) {
      if (newSets1 > newSets2) winnerId = currentMatch.archer1Id
      else if (newSets2 > newSets1) winnerId = currentMatch.archer2Id
    }

    const updated: BracketMatch = {
      ...currentMatch,
      archer1Sets: newSets1,
      archer2Sets: newSets2,
      archer1Cumulative: newCum1,
      archer2Cumulative: newCum2,
      winnerId,
      isFinished: !!winnerId,
    }

    setCurrentMatch(updated)
    setA1Set(['', '', ''])
    setA2Set(['', '', ''])
    onSaveMatch(updated)
  }

  const displayScore1 = scoringType === 'set' ? currentMatch.archer1Sets : currentMatch.archer1Cumulative
  const displayScore2 = scoringType === 'set' ? currentMatch.archer2Sets : currentMatch.archer2Cumulative

  return (
    <div className="flex flex-col gap-4 p-2 text-white">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al Cuadro
      </button>

      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-center shadow-md">
        <div className={`flex flex-col gap-1 ${currentMatch.winnerId === archer1?.id ? 'text-emerald-400' : ''}`}>
          <span className="text-xs font-bold uppercase text-zinc-400">{archer1?.name || 'Arquero 1'}</span>
          <span className="font-display text-4xl font-black">{displayScore1}</span>
        </div>

        <div className={`flex flex-col gap-1 ${currentMatch.winnerId === archer2?.id ? 'text-emerald-400' : ''}`}>
          <span className="text-xs font-bold uppercase text-zinc-400">{archer2?.name || 'Arquero 2'}</span>
          <span className="font-display text-4xl font-black">{displayScore2}</span>
        </div>
      </div>

      {currentMatch.winnerId ? (
        <div className="flex flex-col items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
          <Award className="w-8 h-8 text-emerald-400" />
          <h3 className="font-display text-base font-bold text-emerald-400">Match Finalizado</h3>
          <p className="text-xs text-zinc-400">
            Ganador:{' '}
            <strong className="text-white">
              {currentMatch.winnerId === archer1?.id ? archer1?.name : archer2?.name}
            </strong>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Ingreso de Tanda Actual</h4>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold">{archer1?.name}</span>
            <div className="flex gap-2">
              {a1Set.map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={val}
                  onChange={(e) => {
                    const newArr = [...a1Set]
                    newArr[idx] = e.target.value.toUpperCase()
                    setA1Set(newArr)
                  }}
                  className="w-10 h-10 rounded-lg border border-zinc-700 bg-zinc-950 text-center font-bold text-white"
                  placeholder="-"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold">{archer2?.name}</span>
            <div className="flex gap-2">
              {a2Set.map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={val}
                  onChange={(e) => {
                    const newArr = [...a2Set]
                    newArr[idx] = e.target.value.toUpperCase()
                    setA2Set(newArr)
                  }}
                  className="w-10 h-10 rounded-lg border border-zinc-700 bg-zinc-950 text-center font-bold text-white"
                  placeholder="-"
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleConfirmEnd}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 font-bold text-white shadow-md hover:bg-emerald-500 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" /> Confirmar Tanda
          </button>
        </div>
      )}
    </div>
  )
}
