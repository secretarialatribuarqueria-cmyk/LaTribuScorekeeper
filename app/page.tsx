'use client'

import { useEffect, useState } from 'react'
import { ClipboardList, RotateCcw, Target, Trophy } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { MatchScreen } from '@/components/match-screen'
import { ScoringScreen } from '@/components/scoring-screen'
import { SetupForm } from '@/components/setup-form'
import { SummaryView } from '@/components/summary-view'
import { RankingTable } from '@/components/RankingTable'
import { Button } from '@/components/ui/button'
import { useTournament } from '@/lib/use-tournament'

type View = 'scoring' | 'summary' | 'ranking'

export default function Page() {
  const {
    tournament,
    match,
    loaded,
    startTournament,
    startMatch,
    setArrow,
    setMatchArrow,
    setShootOffArrow,
    resetTournament,
  } = useTournament()
  const [view, setView] = useState<View>('scoring')
  const [activeArcher, setActiveArcher] = useState(0)

  useEffect(() => {
    setActiveArcher(0)
    setView('scoring')
  }, [tournament?.createdAt])

  function handleReset() {
    if (window.confirm('¿Iniciar una nueva sesión? Se borrará la anotación actual.')) {
      resetTournament()
      setView('scoring')
    }
  }

  if (!loaded) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-sm text-muted-foreground">Cargando…</p>
      </main>
    )
  }

  if (!tournament && !match) {
    return (
      <main className="min-h-dvh pb-20">
        <AppHeader />
        
        {view === 'ranking' ? (
          <RankingTable />
        ) : (
          <SetupForm onStartPatrulla={startTournament} onStartMatch={startMatch} />
        )}

        {/* Menú de navegación inferior cuando no hay torneo activo */}
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur">
          <div className="mx-auto grid w-full max-w-3xl grid-cols-2">
            <NavButton
              active={view !== 'ranking'}
              onClick={() => setView('scoring')}
              icon={<Target className="size-5" />}
              label="Nuevo Torneo"
            />
            <NavButton
              active={view === 'ranking'}
              onClick={() => setView('ranking')}
              icon={<Trophy className="size-5" />}
              label="Ranking Global"
            />
          </div>
        </nav>
      </main>
    )
  }

  const resetButton = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleReset}
      aria-label="Nueva sesión"
    >
      <RotateCcw className="size-5" />
    </Button>
  )

  // Match Play (Cruces Eliminatorios / Finales)
  if (match) {
    return (
      <main className="min-h-dvh">
        <AppHeader right={resetButton} />
        <MatchScreen
          match={match}
          setMatchArrow={setMatchArrow}
          setShootOffArrow={setShootOffArrow}
        />
      </main>
    )
  }

  // Patrulla / Entrenamiento
  return (
    <main className="min-h-dvh pb-16">
      <AppHeader right={resetButton} />

      {view === 'scoring' && (
        <ScoringScreen
          tournament={tournament!}
          activeArcher={activeArcher}
          onActiveArcherChange={setActiveArcher}
          setArrow={setArrow}
        />
      )}

      {view === 'summary' && <SummaryView tournament={tournament!} />}

      {view === 'ranking' && <RankingTable />}

      {/* Bottom navigation con 3 opciones */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-3">
          <NavButton
            active={view === 'scoring'}
            onClick={() => setView('scoring')}
            icon={<Target className="size-5" />}
            label="Anotar"
          />
          <NavButton
            active={view === 'summary'}
            onClick={() => setView('summary')}
            icon={<ClipboardList className="size-5" />}
            label="Planilla"
          />
          <NavButton
            active={view === 'ranking'}
            onClick={() => setView('ranking')}
            icon={<Trophy className="size-5" />}
            label="Ranking"
          />
        </div>
      </nav>
    </main>
  )
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
        active
          ? 'text-primary-bright'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {icon}
      <span className="uppercase tracking-wide">{label}</span>
    </button>
  )
}