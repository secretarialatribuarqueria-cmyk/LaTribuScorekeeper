'use client'

import { useState } from 'react'
import type { Archer, BracketMatch, Discipline, ScoringType } from '@/lib/types'
import { BracketView } from './bracket-view'
import { MatchScoreSheet } from './match-score-sheet'

interface MatchScreenProps {
  brackets: BracketMatch[]
  archers: Archer[]
  discipline: Discipline
  scoringType: ScoringType
  onUpdateMatch: (match: BracketMatch) => void
}

export function MatchScreen({
  brackets,
  archers,
  discipline,
  scoringType,
  onUpdateMatch,
}: MatchScreenProps) {
  const [selectedMatch, setSelectedMatch] = useState<BracketMatch | null>(null)

  if (selectedMatch) {
    const currentInBrackets = brackets.find((m) => m.id === selectedMatch.id) || selectedMatch
    return (
      <MatchScoreSheet
        match={currentInBrackets}
        archers={archers}
        discipline={discipline}
        scoringType={scoringType}
        onSaveMatch={(updated) => {
          onUpdateMatch(updated)
        }}
        onBack={() => setSelectedMatch(null)}
      />
    )
  }

  return (
    <BracketView
      matches={brackets}
      archers={archers}
      scoringType={scoringType}
      onSelectMatch={(match) => setSelectedMatch(match)}
    />
  )
}
