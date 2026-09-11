import { useState, useEffect } from 'react'

export function useTournament() {
  const [tournament, setTournament] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('latribu_tournament')
      if (saved) {
        setTournament(JSON.parse(saved))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoaded(true)
    }
  }, [])

  const startTournament = (data: any) => {
    const newSession = {
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      format: data.format || 'patrulla',
      disciplineId: data.disciplineId || 'indoor_18m',
      archers: (data.archers || []).map((a: any, idx: number) => ({
        id: a.id || String(idx + 1),
        name: a.name || `Arquero ${idx + 1}`,
        category: a.category || 'Senior',
        bowType: a.bowType || 'Recurvo',
        scores: []
      }))
    }
    setTournament(newSession)
    localStorage.setItem('latribu_tournament', JSON.stringify(newSession))
  }

  const setArrow = (archerIndex: number, end: number, arrowIndex: number, value: number | string) => {
    if (!tournament) return
    const updated = { ...tournament }
    if (!updated.archers[archerIndex].scores) {
      updated.archers[archerIndex].scores = []
    }
    updated.archers[archerIndex].scores[end * 3 + arrowIndex] = value
    setTournament(updated)
    localStorage.setItem('latribu_tournament', JSON.stringify(updated))
  }

  const resetTournament = () => {
    setTournament(null)
    localStorage.removeItem('latribu_tournament')
  }

  return {
    tournament,
    loaded,
    startTournament,
    setArrow,
    resetTournament
  }
}
