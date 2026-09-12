'use client'

import React, { useState } from 'react'
import { SetupForm } from '@/components/setup-form'
import { ScoringScreen } from '@/components/scoring-screen'
import { RankingTable } from '@/components/ranking-table'
import { DISCIPLINES } from '@/lib/disciplines'

export default function Home() {
  const [currentView, setCurrentView] = useState<'setup' | 'scoring' | 'ranking'>('setup')
  const [tournament, setTournament] = useState<any>(null)

  const resolveDiscipline = (disciplineInput: any) => {
    // Si ya viene como un objeto completo con propiedad ends, lo usamos
    if (disciplineInput && typeof disciplineInput === 'object' && disciplineInput.ends) {
      return disciplineInput
    }

    // Si viene como texto (ej: 'indoor', '3d', 'field'), buscamos en la lista o por clave
    const id = typeof disciplineInput === 'string' ? disciplineInput.toLowerCase() : ''
    
    if (DISCIPLINES) {
      // Si DISCIPLINES es una lista/arreglo
      if (Array.isArray(DISCIPLINES)) {
        const found = DISCIPLINES.find((d: any) => d.id === id || d.id === disciplineInput)
        if (found) return found
      } 
      // Si DISCIPLINES es un objeto diccionario (ej: DISCIPLINES['indoor'])
      else if (typeof DISCIPLINES === 'object' && DISCIPLINES[id]) {
        return DISCIPLINES[id]
      }
    }

    // Fallback completo en caso de no coincidir la clave
    return {
      id: id || 'indoor',
      name: 'Indoor / Sala',
      ends: 10,
      arrowsPerEnd: 3,
      maxScore: 300,
    }
  }

  const handleStartPatrulla = (disciplineInput: any, archers: any) => {
    const fullDiscipline = resolveDiscipline(disciplineInput)

    setTournament({
      mode: 'patrulla',
      discipline: fullDiscipline,
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
    const fullDiscipline = resolveDiscipline(disciplineInput)

    setTournament({
      mode: 'match',
      discipline: fullDiscipline,
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
