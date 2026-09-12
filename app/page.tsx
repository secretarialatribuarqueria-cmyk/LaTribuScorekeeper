'use client'

import React, { useState } from 'react'
import { SetupForm } from '@/components/setup-form'
import { ScoringScreen } from '@/components/scoring-screen'
import { RankingTable } from '@/components/ranking-table'
import { DISCIPLINES } from '@/lib/disciplines'

export default function Home() {
  const [currentView, setCurrentView] = useState<'setup' | 'scoring' | 'ranking'>('setup')
  const [tournament, setTournament] = useState<any>(null)

  const prepareTournamentData = (mode: 'patrulla' | 'match', disciplineInput: any, archersInput: any[]) => {
    // 1. Determinar el ID de la disciplina
    const disciplineId = typeof disciplineInput === 'string' 
      ? disciplineInput 
      : (disciplineInput?.id || 'indoor')

    // 2. Obtener la configuración de la disciplina para saber cuántas tandas y flechas crear
    const config = (DISCIPLINES as Record<string, any>)[disciplineId] || DISCIPLINES['indoor'] || {
      ends: 10,
      arrowsPerEnd: 3,
    }

    const numEnds = config.ends || 10
    const arrowsPerEnd = config.arrowsPerEnd || 3

    // 3. Formatear cada arquero inicializando su propiedad 'ends' requerida por ScoringScreen
    const rawArchers = Array.isArray(archersInput) ? archersInput : []
    const formattedArchers = rawArchers.map((archer: any, index: number) => {
      // Si el arquero ya tiene 'ends', lo dejamos tal cual
      if (archer.ends && Array.isArray(archer.ends)) {
        return archer
      }

      // Creamos la estructura de tandas vacías necesarias
      const emptyEnds = Array.from({ length: numEnds }, () =>
        Array.from({ length: arrowsPerEnd }, () => ({ label: null }))
      )

      return {
        id: archer.id || String(index + 1),
        name: archer.name || archer.archerName || `Arquero ${index + 1}`,
        category: archer.category || 'Senior',
        bowType: archer.bowType || archer.bowtype || 'Raso',
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
    setCurrentView('scoring')
  }

  const handleStartMatch = (disciplineInput: any, archersInput: any) => {
    const tournamentData = prepareTournamentData('match', disciplineInput, archersInput)
    setTournament(tournamentData)
    setCurrentView('scoring')
  }

  const handleReset = () => {
    setTournament(null)
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
          onReset={handleReset}
          onViewRanking={() => setCurrentView('ranking')}
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
