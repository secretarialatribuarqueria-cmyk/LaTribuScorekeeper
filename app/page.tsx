'use client'

import React, { useState } from 'react'
import { SetupForm } from '@/components/setup-form'
import { ScoringScreen } from '@/components/scoring-screen'
import { RankingTable } from '@/components/ranking-table'
import { DISCIPLINE_LIST } from '@/lib/disciplines'

export default function Home() {
  const [currentView, setCurrentView] = useState<'setup' | 'scoring' | 'ranking'>('setup')
  const [tournament, setTournament] = useState<any>(null)

  const getFullDiscipline = (disciplineInput: any) => {
    // Si ya es un objeto válido con propiedad 'ends', lo usamos directamente
    if (disciplineInput && typeof disciplineInput === 'object' && 'ends' in disciplineInput) {
      return disciplineInput
    }

    // Si es un ID string, lo buscamos en el catálogo de disciplinas
    if (typeof disciplineInput === 'string' && Array.isArray(DISCIPLINE_LIST)) {
      const found = DISCIPLINE_LIST.find((d) => d.id === disciplineInput)
      if (found) return found
    }

    // Objeto por defecto para evitar caídas si la disciplina no coincide
    return {
      id: 'sala',
      name: 'Sala / Indoor',
      ends: 10,
      arrowsPerEnd: 3,
      maxScore: 300
    }
  }

  const handleStartPatrulla = (disciplineInput: any, archers: any) => {
    setTournament({
      mode: 'patrulla',
      discipline: getFullDiscipline(disciplineInput),
      archers,
      date: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    })
    setCurrentView('scoring')
  }

  const handleStartMatch = (disciplineInput: any, archers: any) => {
    setTournament({
      mode: 'match',
      discipline: getFullDiscipline(disciplineInput),
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
