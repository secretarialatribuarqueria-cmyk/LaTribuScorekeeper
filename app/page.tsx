'use client'

import React, { useState } from 'react'
import { SetupForm } from '@/components/setup-form'
import { ScoringScreen } from '@/components/scoring-screen'
import { useTournament } from '@/lib/use-tournament'

export default function Page() {
  const { tournament, loaded, startTournament, setArrow, resetTournament } = useTournament()
  const [activeArcher, setActiveArcher] = useState(0)

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#0a120c] flex items-center justify-center text-emerald-400 font-bold">
        Cargando...
      </div>
    )
  }

  if (!tournament) {
    return <SetupForm onStart={startTournament} />
  }

  return (
    <main className="min-h-screen bg-[#0a120c] text-white">
      <ScoringScreen
        tournament={tournament}
        activeArcher={activeArcher}
        setActiveArcher={setActiveArcher}
        onSetArrow={setArrow}
        onReset={resetTournament}
        onViewSummary={() => {}}
        onViewRanking={() => {}}
      />
    </main>
  )
}
