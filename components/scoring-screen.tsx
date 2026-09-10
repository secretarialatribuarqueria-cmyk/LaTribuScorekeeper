'use client'

import { useState } from 'react'
import { Trophy, Users, Swords } from 'lucide-react'
import type { Archer, BracketMatch, Discipline } from '@/lib/types'
import { createTop8Brackets, updateBracketProgression } from '@/lib/brackets'
import { BracketView } from '@/components/bracket-view'
import { MatchScoreSheet } from '@/components/match-score-sheet'

interface ScoringScreenProps {
  archers: Archer[]
  discipline: Discipline
  onUpdateArchers: (archers: Archer[]) => void
}

export function ScoringScreen({ archers, discipline, onUpdateArchers }: ScoringScreenProps) {
  const [activeTab, setActiveTab] = useState<'qualification' | 'brackets'>('qualification')
  const [matches, setMatches] = useState<BracketMatch[]>([])
  const [selectedMatch, setSelectedMatch] = useState<BracketMatch | null>(null)

  // Inicializa las llaves con los 8 mejores clasificados
  const handleGenerateBrackets = () => {
    const initialBrackets = createTop8Brackets(archers, discipline.scoringType)
    setMatches(initialBrackets)
    setActiveTab('brackets')
  }

  // Guarda el resultado de un partido y avanza la llave
  const handleSaveMatch = (updatedMatch: BracketMatch) => {
    const updatedList = matches.map((m) => (m.id === updatedMatch.id ? updatedMatch : m))
    const progressedList = updateBracketProgression(updatedList)
    setMatches(progressedList)
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Navegación entre Clasificatoria y Eliminatorias */}
      <div className="flex gap-2 rounded-xl bg-muted p-1">
        <button
          onClick={() => {
            setSelectedMatch(null)
            setActiveTab('qualification')
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold uppercase transition-all ${
            activeTab === 'qualification' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
          }`}
        >
          <Users className="size-4" /> Clasificación (720/600)
        </button>

        <button
          onClick={() => {
            if (matches.length === 0) handleGenerateBrackets()
            else setActiveTab('brackets')
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold uppercase transition-all ${
            activeTab === 'brackets' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
          }`}
        >
          <Swords className="size-4" /> Eliminatorias Top 8
        </button>
      </div>

      {/* Vista de Clasificación */}
      {activeTab === 'qualification' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase text-muted-foreground">Ronda Clasificatoria</h2>
            <button
              onClick={handleGenerateBrackets}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md transition-all active:scale-95"
            >
              <Trophy className="size-4" /> Generar Brackets (Top 8)
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Ingresa las tandas de la clasificatoria. Una vez completadas, presiona el botón para avanzar a los partidos $1\text{ vs }1$.
          </p>
        </div>
      )}

      {/* Vista de Eliminatorias */}
      {activeTab === 'brackets' && (
        <>
          {selectedMatch ? (
            <MatchScoreSheet
              match={selectedMatch}
              archers={archers}
              discipline={discipline}
              scoringType={discipline.scoringType}
              onSaveMatch={handleSaveMatch}
              onBack={() => setSelectedMatch(null)}
            />
          ) : (
            <BracketView
              matches={matches}
              archers={archers}
              scoringType={discipline.scoringType}
              onSelectMatch={(match) => setSelectedMatch(match)}
            />
          )}
        </>
      )}
    </div>
  )
}
