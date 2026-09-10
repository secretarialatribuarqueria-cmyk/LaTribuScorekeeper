'use client'

import { useState } from 'react'
import type { Archer, BracketMatch, DisciplineId, BowType } from './types'
import { DISCIPLINES } from './disciplines'
import { createTop8Brackets, updateBracketProgression } from './brackets'

export function useTournament() {
  const [format, setFormat] = useState<'patrulla' | 'cruces' | 'torneo'>('torneo')
  const [disciplineId, setDisciplineId] = useState<DisciplineId>('indoor_18m')
  const [archers, setArchers] = useState<Archer[]>([])
  const [brackets, setBrackets] = useState<BracketMatch[]>([])
  const [currentEnd, setCurrentEnd] = useState<number>(1)
  const [isStarted, setIsStarted] = useState<boolean>(false)

  const startSession = (data: {
    format: 'patrulla' | 'cruces' | 'torneo'
    disciplineId: DisciplineId
    archers: Array<{ name: string; category: string; bowType: BowType }>
  }) => {
    const formattedArchers: Archer[] = data.archers.map((a, idx) => ({
      id: `archer-${idx + 1}`,
      name: a.name,
      category: a.category,
      bowType: a.bowType,
      scores: [],
    }))

    setFormat(data.format)
    setDisciplineId(data.disciplineId)
    setArchers(formattedArchers)
    setIsStarted(true)

    if (data.format === 'torneo') {
      const initialBrackets = createTop8Brackets(formattedArchers)
      setBrackets(initialBrackets)
    }
  }

  const addEndScore = (archerId: string, arrows: { value: number; display: string }[]) => {
    setArchers((prev) =>
      prev.map((a) => {
        if (a.id !== archerId) return a
        const endTotal = arrows.reduce((sum, arr) => sum + arr.value, 0)
        const newScore = { endNumber: currentEnd, arrows, total: endTotal }
        return { ...a, scores: [...a.scores, newScore] }
      })
    )
  }

  const updateMatch = (updatedMatch: BracketMatch) => {
    setBrackets((prev) => {
      const nextMatches = prev.map((m) => (m.id === updatedMatch.id ? updatedMatch : m))
      return updateBracketProgression(nextMatches)
    })
  }

  return {
    format,
    discipline: DISCIPLINES[disciplineId],
    archers,
    brackets,
    currentEnd,
    isStarted,
    setCurrentEnd,
    startSession,
    addEndScore,
    updateMatch,
  }
}
