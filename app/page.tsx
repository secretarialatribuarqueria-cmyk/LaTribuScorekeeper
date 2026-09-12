'use client'

import React, { useState } from 'react'
import { SetupForm } from '@/components/setup-form'
import { ScoringScreen } from '@/components/scoring-screen'
import { RankingTable } from '@/components/ranking-table'

// Estructura explícita de disciplinas para evitar fallos de importación
const DEFAULT_DISCIPLINES: Record<string, any> = {
  indoor: {
    id: 'indoor',
    name: 'Sala / Indoor',
    ends: 10,
    arrowsPerEnd: 3,
    maxScore: 300,
  },
  outdoor: {
    id: 'outdoor',
    name: 'Aire Libre / Outdoor',
    ends: 12,
    arrowsPerEnd: 6,
    maxScore: 720,
  },
  field: {
    id: 'field',
    name: 'Juegos de Campo / Field',
    ends: 24,
    arrowsPerEnd: 3,
    maxScore: 432,
  },
  '3d': {
    id: '3d',
    name: '3D',
    ends: 24,
    arrowsPerEnd: 2,
    maxScore: 528,
  },
}

export default function Home() {
  const [currentView, setCurrentView] = useState<'setup' | 'scoring' | 'ranking'>('setup')
  const [tournament, setTournament] = useState<any>(null)

  const buildDisciplineObject = (input: any) => {
    // Si ya viene como un objeto completo con 'ends'
    if (input && typeof input === 'object' && input.ends) {
      return input
    }
    // Si viene como string ('indoor', '3d', etc.)
    const key = typeof input === 'string' ? input.toLowerCase() : 'indoor'
    return DEFAULT_DISCIPLINES[key] || DEFAULT_DISCIPLINES.indoor
  }

  const handleStartPatrulla = (disciplineInput: any, archers: any) => {
    const disciplineObj = buildDisciplineObject(disciplineInput)

    setTournament({
      mode: 'patrulla',
      discipline: disciplineObj,
      archers: archers || [],
      date: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    })
    setCurrentView('scoring')
  }

  const handleStartMatch = (disciplineInput: any, archers: any) => {
    const disciplineObj = buildDisciplineObject(disciplineInput)

    setTournament({
      mode: 'match',
      discipline: disciplineObj,
      archers: archers || [],
      date: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    })
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

      {currentView === 'scoring' && (
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
