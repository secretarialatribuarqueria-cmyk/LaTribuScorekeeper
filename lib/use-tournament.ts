'use client'

import { useCallback, useEffect, useState } from 'react'
import { buildMatch, type MatchDraft } from './match'
import { createEmptyEnds, configFor } from './scoring'
import type { Archer, BowType, DisciplineId, Match, Session, Tournament } from './types'

const STORAGE_KEY = 'la-tribu-session-v2'
const TARGET_LETTERS = ['A', 'B', 'C', 'D']

function loadSession(): Session | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export interface ArcherDraft {
  name: string
  category: string
  bowType: BowType
}

export function useTournament() {
  const [session, setSession] = useState<Session | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setSession(loadSession())
    setLoaded(true)
  }, [])

  // Auto-save to localStorage on every change (offline persistence).
  useEffect(() => {
    if (!loaded) return
    try {
      if (session) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
      } else {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // storage full / unavailable — ignore, app keeps working in memory
    }
  }, [session, loaded])

  const startTournament = useCallback(
    (disciplineId: DisciplineId, drafts: ArcherDraft[]) => {
      const config = configFor(disciplineId)
      const archers: Archer[] = drafts.map((d, i) => ({
        id: `archer-${Date.now()}-${i}`,
        name: d.name.trim() || `Arquero ${i + 1}`,
        category: d.category.trim(),
        bowType: d.bowType,
        targetLetter: TARGET_LETTERS[i % 4], // Asigna A, B, C o D según el índice
        ends: createEmptyEnds(config),
      }))
      setSession({ kind: 'patrulla', disciplineId, archers, createdAt: Date.now() })
    },
    [],
  )

  const startMatch = useCallback(
    (disciplineId: DisciplineId, drafts: [MatchDraft, MatchDraft]) => {
      setSession(buildMatch(disciplineId, drafts))
    },
    [],
  )

  const setArrow = useCallback(
    (archerId: string, endIndex: number, arrowIndex: number, label: string | null) => {
      setSession((prev) => {
        if (!prev || prev.kind !== 'patrulla') return prev
        return {
          ...prev,
          archers: prev.archers.map((a) => {
            if (a.id !== archerId) return a
            const ends = a.ends.map((end, ei) => {
              if (ei !== endIndex) return end
              const next = [...end]
              next[arrowIndex] = label
              return next
            })
            return { ...a, ends }
          }),
        }
      })
    },
    [],
  )

  const setMatchArrow = useCallback(
    (
      archerIndex: 0 | 1,
      endIndex: number,
      arrowIndex: number,
      label: string | null,
    ) => {
      setSession((prev) => {
        if (!prev || prev.kind !== 'match') return prev
        const ends = prev.ends.map((end, ei) => {
          if (ei !== endIndex) return end
          const pair = [end[0].slice(), end[1].slice()] as Match['ends'][number]
          pair[archerIndex][arrowIndex] = label
          return pair
        })
        return { ...prev, ends }
      })
    },
    [],
  )

  const setShootOffArrow = useCallback(
    (archerIndex: 0 | 1, label: string | null) => {
      setSession((prev) => {
        if (!prev || prev.kind !== 'match') return prev
        const current = prev.shootOff ?? [null, null]
        const next = [current[0], current[1]] as [string | null, string | null]
        next[archerIndex] = label
        return { ...prev, shootOff: next }
      })
    },
    [],
  )

  const resetTournament = useCallback(() => {
    setSession(null)
  }, [])

  const tournament: Tournament | null =
    session && session.kind === 'patrulla' ? session : null
  const match: Match | null = session && session.kind === 'match' ? session : null

  return {
    session,
    tournament,
    match,
    loaded,
    startTournament,
    startMatch,
    setArrow,
    setMatchArrow,
    setShootOffArrow,
    resetTournament,
  }
}