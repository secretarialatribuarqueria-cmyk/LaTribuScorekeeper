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

    let newScore1 = currentMatch.archer1Score
    let newScore2 = currentMatch.archer2Score

    if (scoringType === 'sets') {
      if (sum1 > sum2) newScore1 += 2
      else if (sum2 > sum1) newScore2 += 2
      else {
        newScore1 += 1
        newScore2 += 1
      }
    } else {
      newScore1 += sum1
      newScore2 += sum2
    }

    let winnerId = currentMatch.winnerId

    if (scoringType === 'sets' && (newScore1 >= 6 || newScore2 >= 6)) {
      if (newScore1 > newScore2) winnerId = currentMatch.archer1Id
      else if (newScore2 > newScore1) winnerId = currentMatch.archer2Id
    }

    const updated: BracketMatch = {
      ...currentMatch,
      archer1Score: newScore1,
      archer2Score: newScore2,
      archer1ArrowScores: [...currentMatch.archer1ArrowScores, ...a1Set],
      archer2ArrowScores: [...currentMatch.archer2ArrowScores, ...a2Set],
      winnerId,
    }

    setCurrentMatch(updated)
    setA1Set(['', '', ''])
    setA2Set(['', '', ''])
    onSaveMatch(updated)
  }

  return (
    <div className="flex flex-col gap-4 p-2">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver al Cuadro
      </button>

      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-4 text-center shadow-md">
        <div className={`flex flex-col gap-1 ${currentMatch.winnerId === archer1?.id ? 'text-primary' : ''}`}>
          <span className="text-xs font-bold uppercase text-muted-foreground">{archer1?.name || 'Arquero 1'}</span>
          <span className="font-display text-4xl font-black">{currentMatch.archer1Score}</span>
          {scoringType === 'sets' && <span className="text-[10px] uppercase text-muted-foreground">Puntos de Set</span>}
        </div>

        <div className={`flex flex-col gap-1 ${currentMatch.winnerId === archer2?.id ? 'text-primary' : ''}`}>
          <span className="text-xs font-bold uppercase text-muted-foreground">{archer2?.name || 'Arquero 2'}</span>
          <span className="font-display text-4xl font-black">{currentMatch.archer2Score}</span>
          {scoringType === 'sets' && <span className="text-[10px] uppercase text-muted-foreground">Puntos de Set</span>}
        </div>
      </div>

      {currentMatch.winnerId ? (
        <div className="flex flex-col items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
          <Award className="size-8 text-emerald-400" />
          <h3 className="font-display text-base font-bold text-emerald-400">Match Finalizado</h3>
          <p className="text-xs text-muted-foreground">
            Ganador:{' '}
            <strong className="text-foreground">
              {currentMatch.winnerId === archer1?.id ? archer1?.name : archer2?.name}
            </strong>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ingreso de Tanda Actual</h4>

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
                  className="size-10 rounded-lg border border-border bg-muted text-center font-bold"
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
                  className="size-10 rounded-lg border border-border bg-muted text-center font-bold"
                  placeholder="-"
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleConfirmEnd}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 font-bold text-primary-foreground shadow-md transition-all active:scale-95"
          >
            <CheckCircle2 className="size-4" /> Confirmar Tanda
          </button>
        </div>
      )}
    </div>
  )
}
