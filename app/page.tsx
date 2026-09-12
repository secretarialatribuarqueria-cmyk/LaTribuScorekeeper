'use client'

import React, { useState } from 'react'
import { SetupForm } from '@/components/setup-form'
import { ScoringScreen } from '@/components/scoring-screen'
import { RankingTable } from '@/components/ranking-table'
import { DISCIPLINES } from '@/lib/disciplines'

export default function Home() {
  const [currentView, setCurrentView] = useState<'setup' | 'scoring' | 'ranking'>('setup')
  const [tournament, setTournament] = useState<any>(null)
  const [activeArcher, setActiveArcher] = useState<number>(0)

  const prepareTournamentData = (mode: 'patrulla' | 'match', disciplineInput: any, archersInput: any[]) => {
    const disciplineId = typeof disciplineInput === 'string' 
      ? disciplineInput 
      : (disciplineInput?.id || 'indoor')

    const config = (DISCIPLINES as Record<string, any>)[disciplineId] || DISCIPLINES['indoor'] || {
      ends: 10,
      arrowsPerEnd: 3,
    }

    const numEnds = config.ends || 10
    const arrowsPerEnd = config.arrowsPerEnd || 3

    const rawArchers = Array.isArray(archersInput) && archersInput.length > 0 
      ? archersInput 
      : [{ id: '1', name: 'Arquero 1', category: 'Senior', bowType: 'Raso' }]

    const formattedArchers = rawArchers.map((archer: any, index: number) => {
      if (archer.ends && Array.isArray(archer.ends)) {
        return archer
      }

      // Matriz simple de strings/nulls exacta para ScoringScreen
      const emptyEnds = Array.from({ length: numEnds }, () =>
        Array.from({ length: arrowsPerEnd }, () => null)
      )

      return {
        id: archer.id || String(index + 1),
        name: archer.name || archer.archerName || `Arquero ${index + 1}`,
        category: archer.category || 'Senior',
        bowType: archer.bowType || archer.bowtype || 'Raso',
        targetLetter: archer.targetLetter || String.fromCharCode(65 + index),
        ends: emptyEnds,
      }
    })

    return {
      mode,
      disciplineId,
      discipline: config,
      archers: formattedArchers,
      date: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    }
  }

  const handleStartPatrulla = (disciplineInput: any, archersInput: any) => {
    const tournamentData = prepareTournamentData('patrulla', disciplineInput, archersInput)
    setTournament(tournamentData)
    setActiveArcher(0)
    setCurrentView('scoring')
  }

  const handleStartMatch = (disciplineInput: any, archersInput: any) => {
    const tournamentData = prepareTournamentData('match', disciplineInput, archersInput)
    setTournament(tournamentData)
    setActiveArcher(0)
    setCurrentView('scoring')
  }

  const handleSetArrow = (
    archerId: string,
    endIndex: number,
    arrowIndex: number,
    label: string | null
  ) => {
    if (!tournament) return

    setTournament((prev: any) => {
      if (!prev) return prev
      const updatedArchers = prev.archers.map((archer: any) => {
        if (archer.id === archerId) {
          const newEnds = archer.ends.map((end: (string | null)[]) => [...end])
          if (newEnds[endIndex]) {
            newEnds[endIndex][arrowIndex] = label
          }
          return { ...archer, ends: newEnds }
        }
        return archer
      })
      return { ...prev, archers: updatedArchers }
    })
  }

  const handleReset = () => {
    setTournament(null)
    setActiveArcher(0)
    setCurrentView('setup')
  }

  return (
    <main className="min-h-screen bg-[#0a120c] text-white">
      {currentView === 'setup' && (
        <SetupForm
          onStartPatrulla={handleStartPatrulla}
          onStartMatch={handleStartMatch}
        />
      )}

      {currentView === 'scoring' && tournament && (
        <ScoringScreen
          tournament={tournament}
          activeArcher={activeArcher}
          onActiveArcherChange={setActiveArcher}
          setArrow={handleSetArrow}
        />
      )}

      {currentView === 'ranking' && (
        <RankingTable
          onBack={() => setCurrentView(tournament ? 'scoring' : 'setup')}
        />
      )}
    </main>
  )
}
