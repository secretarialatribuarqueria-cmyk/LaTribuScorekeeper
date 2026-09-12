export interface RankingEntry {
  id: string
  archerName: string
  category: string
  bowType: string
  score: number
  xs: number
  tens: number
  disciplineId: string
  date?: string
}

export const rankingService = {
  saveScore: (entry: Partial<RankingEntry>) => {
    try {
      const currentRanking = rankingService.getRanking()
      
      const formattedDate = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })

      const newEntry: RankingEntry = {
        id: String(Date.now()),
        archerName: entry.archerName || 'Arquero',
        category: entry.category || 'General',
        bowType: entry.bowType || 'Raso',
        score: Number(entry.score || 0),
        xs: Number(entry.xs || 0),
        tens: Number(entry.tens || 0),
        disciplineId: entry.disciplineId || 'indoor',
        date: entry.date || formattedDate,
      }

      const updatedRanking = [...currentRanking, newEntry]
      localStorage.setItem('latribu_ranking', JSON.stringify(updatedRanking))
      return true
    } catch (e) {
      console.error('Error al guardar en el ranking:', e)
      return false
    }
  },

  getRanking: (): RankingEntry[] => {
    try {
      if (typeof window === 'undefined') return []

      const oldKeys = ['ranking', 'rankings', 'latribu_rankings', 'scores']
      let recoveredEntries: RankingEntry[] = []

      oldKeys.forEach((key) => {
        const oldData = localStorage.getItem(key)
        if (oldData) {
          try {
            const parsed = JSON.parse(oldData)
            if (Array.isArray(parsed)) {
              const formatted: RankingEntry[] = parsed.map((item: Record<string, any>, idx: number) => ({
                id: String(item.id || `old-${key}-${idx}-${Date.now()}`),
                archerName: String(item.archerName || item.name || item.archer || 'Arquero'),
                category: String(item.category || 'General'),
                bowType: String(item.bowType || item.bowtype || 'Raso'),
                score: Number(item.score || item.total || 0),
                xs: Number(item.xs || 0),
                tens: Number(item.tens || 0),
                disciplineId: String(item.disciplineId || 'indoor'),
                date: String(item.date || 'Anterior'),
              }))
              recoveredEntries = recoveredEntries.concat(formatted)
            }
          } catch (e) {
            console.error(`Error migrando clave antigua ${key}:`, e)
          }
          localStorage.removeItem(key)
        }
      })

      const saved = localStorage.getItem('latribu_ranking')
      const currentEntries: RankingEntry[] = saved ? JSON.parse(saved) : []

      if (recoveredEntries.length > 0) {
        const mergedMap = new Map<string, RankingEntry>()
        const allEntries = currentEntries.concat(recoveredEntries)

        allEntries.forEach((entry) => {
          const uniqueKey = entry.id || `${entry.archerName}-${entry.score}-${entry.date}`
          if (!mergedMap.has(uniqueKey)) {
            mergedMap.set(uniqueKey, entry)
          }
        })

        const mergedArray = Array.from(mergedMap.values())
        localStorage.setItem('latribu_ranking', JSON.stringify(mergedArray))
        return mergedArray
      }

      return currentEntries
    } catch (e) {
      console.error('Error al obtener el ranking:', e)
      return []
    }
  },
}
