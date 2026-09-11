'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { SetupForm } from '@/components/setup-form'
import { ScoringScreen } from '@/components/scoring-screen'
import { RankingTable } from '@/components/ranking-table'
import { SummaryView } from '@/components/summary-view'
import { useTournament } from '@/lib/use-tournament'

type View = 'scoring' | 'summary' | 'ranking'

export default function Page() {
  const {
    tournament,
    loaded,
    startTournament,
    setArrow,
    resetTournament,
  } = useTournament()

  const [view, setView] = useState<View>('scoring')
  const [activeArcher, setActiveArcher] = useState<number>(0)

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
      <AppHeader onReset={resetTournament} />

      {view === 'scoring' && (
        <ScoringScreen
          tournament={tournament}
          activeArcher={activeArcher}
          setActiveArcher={setActiveArcher}
          onSetArrow={setArrow}
          onViewSummary={() => setView('summary')}
          onViewRanking={() => setView('ranking')}
        />
      )}

      {view === 'summary' && (
        <SummaryView
          tournament={tournament}
          onBack={() => setView('scoring')}
        />
      )}

      {view === 'ranking' && (
        <RankingTable
          tournament={tournament}
          onBack={() => setView('scoring')}
        />
      )}
    </main>
  )
}
