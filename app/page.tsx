'use client'

import React, { useState, useEffect } from 'react'
import { SetupForm } from '@/components/setup-form'
import { ScoringScreen } from '@/components/scoring-screen'
import { RankingTable } from '@/components/ranking-table'
import { DISCIPLINES } from '@/lib/disciplines'
import { endTotal } from '@/lib/scoring'
import { rankingService } from '@/lib/rankingService'
import { Trophy, Home as HomeIcon, FileText, Target, Save } from 'lucide-react'

export default function Home() {
  const [currentView, setCurrentView] = useState<'setup' | 'scoring' | 'planilla' | 'ranking'>('setup')
  const [tournament, setTournament] = useState<any>(null)
  const [activeArcher, setActiveArcher] = useState<number>(0)
  const [savedRankings, setSavedRankings] = useState<any[]>([])

  // --- 1. PERSISTENCIA: Cargar sesión previa desde localStorage al iniciar ---
  useEffect(() => {
    const saved = localStorage.getItem('tribuscore_active_tournament')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.archers) {
          const restore = window.confirm('Se encontró una tirada en curso sin finalizar. ¿Deseas continuar anotando?')
          if (restore) {
            setTournament(parsed)
            setCurrentView('scoring')
          } else {
            localStorage.removeItem('tribuscore_active_tournament')
          }
        }
      } catch (e) {
        console.error('Error al restaurar sesión guardada', e)
      }
    }
  }, [])

  // --- 2. PERSISTENCIA Y SINCRONIZACIÓN AUTOMÁTICA EN TIEMPO REAL ---
  useEffect(() => {
    if (tournament) {
      // Respaldo local
      localStorage.setItem('tribuscore_active_tournament', JSON.stringify(tournament))

      // Enviar actualización en vivo a Supabase
      const tournamentId = tournament.tournamentId || 'torneo-demo'
      const targetNumber = tournament.targetNumber || `Diana ${tournament.archers?.[0]?.targetLetter || '01'}`

      rankingService.syncTargetScore(
        tournamentId,
        targetNumber,
        tournament.archers
      )
    }
  }, [tournament])

  const prepareTournamentData = (mode: 'patrulla' | 'match', disciplineInput: any, archersInput: any[]) => {
    const disciplineId = typeof disciplineInput === 'string' 
      ? disciplineInput 
      : (disciplineInput?.id || 'indoor')

    const config = (DISCIPLINES as Record<string, any>)[disciplineId] || DISCIPLINES['indoor'] || {
      ends: 10,
      arrowsPerEnd: 3,
    }

    const numEnds = config.ends || 10
    const arrowsPerEnd = config.arrowsPerEnd || 3

    const rawArchers = Array.isArray(archersInput) && archersInput.length > 0 
      ? archersInput 
      : [{ id: '1', name: 'Arquero 1', category: 'Senior', bowType: 'Raso' }]

    const formattedArchers = rawArchers.map((archer: any, index: number) => {
      if (archer.ends && Array.isArray(archer.ends)) {
        return archer
      }

      const emptyEnds = Array.from({ length: numEnds }, () =>
        Array.from({ length: arrowsPerEnd }, () => null)
      )

      return {
        id: archer.id || String(index + 1),
        name: archer.name || archer.archerName || `Arquero ${index + 1}`,
        category: archer.category || 'Senior',
        bowType: archer.bowType || archer.bowtype || 'Raso',
        targetLetter: archer.targetLetter || String.fromCharCode(65 + index),
        ends: emptyEnds,
      }
    })

    return {
      mode,
      tournamentId: `torneo-${Date.now()}`,
      targetNumber: `Diana ${formattedArchers[0]?.targetLetter || '1'}`,
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
    setActiveArcher(0)
    setCurrentView('scoring')
  }

  const handleStartMatch = (disciplineInput: any, archersInput: any) => {
    const tournamentData = prepareTournamentData('match', disciplineInput, archersInput)
    setTournament(tournamentData)
    setActiveArcher(0)
    setCurrentView('scoring')
  }

  const handleSetArrow = (
    archerId: string,
    endIndex: number,
    arrowIndex: number,
    label: string | null
  ) => {
    if (!tournament) return

    setTournament((prev: any) => {
      if (!prev) return prev
      const updatedArchers = prev.archers.map((archer: any) => {
        if (archer.id === archerId) {
          const newEnds = archer.ends.map((end: (string | null)[]) => [...end])
          if (newEnds[endIndex]) {
            newEnds[endIndex][arrowIndex] = label
          }
          return { ...archer, ends: newEnds }
        }
        return archer
      })
      return { ...prev, archers: updatedArchers }
    })
  }

  // --- 3. GUARDADO PARCIAL: Notifica guardado manual y fuerza sync con Supabase ---
  const handleSavePartial = async () => {
    if (!tournament) return
    localStorage.setItem('tribuscore_active_tournament', JSON.stringify(tournament))

    const tournamentId = tournament.tournamentId || 'torneo-demo'
    const targetNumber = tournament.targetNumber || 'Diana 01'

    await rankingService.syncTargetScore(
      tournamentId,
      targetNumber,
      tournament.archers
    )

    alert('✓ Avance sincronizado en tiempo real y guardado localmente.')
  }

  // --- 4. FINALIZAR DEFINITIVO: Envia a Supabase, actualiza Ranking y limpia local ---
  const handleSaveAndFinish = async () => {
    if (!tournament) return

    if (!confirm('¿Deseas finalizar la tirada y enviar todos los puntajes al Ranking?')) return

    for (const archer of tournament.archers) {
      let totalScore = 0
      let totalXs = 0
      let totalTens = 0

      archer.ends.forEach((end: (string | null)[]) => {
        totalScore += endTotal(tournament.discipline, end)
        end.forEach((val) => {
          if (val === 'X') totalXs++
          if (val === '10' || val === 'X') totalTens++
        })
      })

      const entry = {
        archerName: archer.name,
        category: archer.category,
        bowType: archer.bowType,
        score: totalScore,
        xs: totalXs,
        tens: totalTens,
        disciplineId: tournament.disciplineId,
        date: tournament.date,
      }

      await rankingService.saveScore(entry)
    }

    // Limpiar respaldo en el navegador
    localStorage.removeItem('tribuscore_active_tournament')

    // Cargar rankings actualizados desde Supabase
    const rankings = await rankingService.getRanking()
    setSavedRankings(rankings)

    alert('¡Tirada finalizada y enviada al Ranking con éxito!')
    setCurrentView('ranking')
  }

  const handleReset = () => {
    if (confirm('¿Seguro que deseas salir al inicio? Se perderá el torneo no guardado.')) {
      localStorage.removeItem('tribuscore_active_tournament')
      setTournament(null)
      setActiveArcher(0)
      setCurrentView('setup')
    }
  }

  const loadRankings = async () => {
    const data = await rankingService.getRanking()
    setSavedRankings(data)
    setCurrentView('ranking')
  }

  return (
    <main className="min-h-screen bg-[#0a120c] text-white pb-20">
      {/* Botón rápido superior para ir al Ranking cuando estamos en la pantalla de Inicio */}
      {currentView === 'setup' && (
        <div className="max-w-3xl mx-auto px-4 pt-4 flex justify-end">
          <button
            type="button"
            onClick={loadRankings}
            className="flex items-center gap-2 bg-[#122216] border border-amber-500/30 text-amber-400 hover:bg-[#182e1e] font-semibold text-xs py-2 px-3 rounded-lg transition-all"
          >
            <Trophy className="size-4" />
            <span>Ver Ranking General</span>
          </button>
        </div>
      )}

      {currentView === 'setup' && (
        <SetupForm
          onStartPatrulla={handleStartPatrulla}
          onStartMatch={handleStartMatch}
        />
      )}

      {currentView === 'scoring' && tournament && (
        <ScoringScreen
          tournament={tournament}
          activeArcher={activeArcher}
          onActiveArcherChange={setActiveArcher}
          setArrow={handleSetArrow}
        />
      )}

      {currentView === 'planilla' && tournament && (
        <div className="mx-auto w-full max-w-3xl px-4 py-4">
          <h2 className="mb-4 text-xl font-bold">Planilla Completa de Tiro</h2>
          
          {tournament.archers.map((archer: any) => {
            let runningTotal = 0
            return (
              <div key={archer.id} className="mb-6 rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
                  <h3 className="font-display text-lg font-bold text-amber-500">
                    {archer.targetLetter ? `${archer.targetLetter} · ` : ''}{archer.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">{archer.bowType} · {archer.category}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-center text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="py-2">Tanda</th>
                        <th className="py-2">Flechas</th>
                        <th className="py-2">Pts Tanda</th>
                        <th className="py-2">Total Acum.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {archer.ends.map((end: (string | null)[], idx: number) => {
                        const endPts = endTotal(tournament.discipline, end)
                        runningTotal += endPts
                        return (
                          <tr key={idx} className="border-b border-border/50">
                            <td className="py-2 font-bold text-muted-foreground">#{idx + 1}</td>
                            <td className="py-2 font-mono">
                              {end.map((val) => val || '-').join('   ')}
                            </td>
                            <td className="py-2 font-bold">{endPts}</td>
                            <td className="py-2 font-bold text-amber-500">{runningTotal}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {currentView === 'ranking' && (
        <RankingTable
          rankings={savedRankings}
          onBack={() => setCurrentView(tournament ? 'scoring' : 'setup')}
        />
      )}

      {/* Barra de Navegación Inferior (Siempre visible cuando hay torneo activo) */}
      {tournament && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-[#0d160f]/95 p-2 backdrop-blur max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => setCurrentView('scoring')}
            className={`flex flex-col items-center gap-1 text-xs font-semibold ${
              currentView === 'scoring' ? 'text-amber-500' : 'text-muted-foreground hover:text-white'
            }`}
          >
            <Target className="size-5" />
            <span>Anotar</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('planilla')}
            className={`flex flex-col items-center gap-1 text-xs font-semibold ${
              currentView === 'planilla' ? 'text-amber-500' : 'text-muted-foreground hover:text-white'
            }`}
          >
            <FileText className="size-5" />
            <span>Planilla</span>
          </button>

          <button
            type="button"
            onClick={loadRankings}
            className={`flex flex-col items-center gap-1 text-xs font-semibold ${
              currentView === 'ranking' ? 'text-amber-500' : 'text-muted-foreground hover:text-white'
            }`}
          >
            <Trophy className="size-5" />
            <span>Ranking</span>
          </button>

          <button
            type="button"
            onClick={handleSavePartial}
            className="flex flex-col items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            <Save className="size-5" />
            <span>Avance</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAndFinish}
            className="flex flex-col items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
          >
            <Save className="size-5" />
            <span>Finalizar</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex flex-col items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive"
          >
            <HomeIcon className="size-5" />
            <span>Inicio</span>
          </button>
        </div>
      )}
    </main>
  )
}