'use client'

import React, { useState } from 'react'
import { SetupForm } from '@/components/setup-form'
import { ScoringScreen } from '@/components/scoring-screen'
import { RankingTable } from '@/components/ranking-table'

export default function Home() {
  const [currentView, setCurrentView] = useState<'setup' | 'scoring' | 'ranking'>('setup')
  const [tournament, setTournament] = useState<any>(null)

  const handleStartPatrulla = (discipline: any, archers: any) => {
    setTournament({
      mode: 'patrulla',
      discipline,
      archers,
      date: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    })
    setCurrentView('scoring')
  }

  const handleStartMatch = (discipline: any, archers: any) => {
    setTournament({
      mode: 'match',
      discipline,
      archers,
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
