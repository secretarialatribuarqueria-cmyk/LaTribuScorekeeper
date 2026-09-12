'use client'

import React, { useState } from 'react'
import { SetupForm } from '@/components/setup-form'
import { ScoringScreen } from '@/components/scoring-screen'
import { RankingTable } from '@/components/ranking-table'

export default function Home() {
  const [currentView, setCurrentView] = useState<'setup' | 'scoring' | 'ranking'>('setup')
  const [tournament, setTournament] = useState<any>(null)

  const handleStartSession = (sessionData: any) => {
    // Garantiza que la sesión inicie sin importar si faltaba algún campo opcional
    if (sessionData) {
      setTournament({
        ...sessionData,
        date: sessionData.date || new Date().toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      })
      setCurrentView('scoring')
    }
  }

  const handleReset = () => {
    setTournament(null)
    setCurrentView('setup')
  }

  return (
    <main className="min-h-screen bg-[#0a120c] text-white">
      {currentView === 'setup' && (
        <SetupForm
          onStart={handleStartSession}
          onViewRanking={() => setCurrentView('ranking')}
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
