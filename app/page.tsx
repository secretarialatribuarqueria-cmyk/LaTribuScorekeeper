'use client'

import React, { useState } from 'react'
import { SetupForm } from '@/components/setup-form'
import { ScoringScreen } from '@/components/scoring-screen'
import { RankingTable } from '@/components/ranking-table'

export default function Home() {
  const [currentView, setCurrentView] = useState<'setup' | 'scoring' | 'ranking'>('setup')
  const [tournament, setTournament] = useState<any>(null)

  const handleStartPatrulla = (...args: any[]) => {
    console.log('Datos recibidos en Patrulla:', args)
    
    // Si el primer parámetro ya trae archers o disciplina internamente
    const firstArg = args[0] || {}
    const secondArg = args[1] || []

    let disciplineObj = {
      id: 'sala',
      name: 'Sala / Indoor',
      ends: 10,
      arrowsPerEnd: 3,
      maxScore: 300,
    }

    let archersList = []

    if (typeof firstArg === 'object' && firstArg.ends) {
      disciplineObj = firstArg
      archersList = secondArg
    } else if (typeof firstArg === 'object' && firstArg.discipline) {
      disciplineObj = typeof firstArg.discipline === 'object' ? firstArg.discipline : disciplineObj
      archersList = firstArg.archers || []
    } else {
      archersList = Array.isArray(secondArg) ? secondArg : (Array.isArray(firstArg) ? firstArg : [])
    }

    setTournament({
      mode: 'patrulla',
      discipline: disciplineObj,
      archers: archersList,
      date: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    })
    setCurrentView('scoring')
  }

  const handleStartMatch = (...args: any[]) => {
    const firstArg = args[0] || {}
    const secondArg = args[1] || []

    let disciplineObj = {
      id: 'sala',
      name: 'Sala / Indoor',
      ends: 5,
      arrowsPerEnd: 3,
      maxScore: 150,
    }

    let archersList = []

    if (typeof firstArg === 'object' && firstArg.ends) {
      disciplineObj = firstArg
      archersList = secondArg
    } else if (typeof firstArg === 'object' && firstArg.discipline) {
      disciplineObj = typeof firstArg.discipline === 'object' ? firstArg.discipline : disciplineObj
      archersList = firstArg.archers || []
    } else {
      archersList = Array.isArray(secondArg) ? secondArg : (Array.isArray(firstArg) ? firstArg : [])
    }

    setTournament({
      mode: 'match',
      discipline: disciplineObj,
      archers: archersList,
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
