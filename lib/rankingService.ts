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
  saveScore: (entry: any) => {
    try {
      const currentRanking = rankingService.getRanking()
      
      const formattedDate = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })

      const newEntry: RankingEntry = {
        ...entry,
        id: String(Date.now()),
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

      // 1. Intentar recuperar claves antiguas si existen
      const oldKeys = ['ranking', 'rankings', 'latribu_rankings', 'scores']
      let recoveredEntries: RankingEntry[] = []

      oldKeys.forEach((key) => {
        const oldData = localStorage.getItem(key)
        if (oldData) {
          try {
            const parsed = JSON.parse(oldData)
            if (Array.isArray(parsed)) {
              // Normalizar estructura antigua a la nueva
              const formatted = parsed.map((item: any, idx: number) => ({
                id: item.id || `old-${key}-${idx}-${Date.now()}`,
                archerName: item.archerName || item.name || item.archer || 'Arquero',
                category: item.category || 'General',
                bowType: item.bowType || item.bowtype || 'Raso',
                score: Number(item.score || item.total || 0),
                xs: Number(item.xs || 0),
                tens: Number(item.tens || 0),
                disciplineId: item.disciplineId || 'indoor',
                date: item.date || 'Anterior',
              }))
              recoveredEntries = [...recoveredEntries, ...formatted]
            }
          } catch (e) {
            console.error(`Error migrando clave antigua ${key}:`, e)
          }
          // Limpiar la clave antigua para no duplicar en el futuro
          localStorage.removeItem(key)
        }
      })

      // 2. Obtener datos de la clave actual
      const saved = localStorage.getItem('latribu_ranking')
      const currentEntries: RankingEntry[] = saved ? JSON.parse(saved) : []

      // 3. Fusionar evitando duplicados por ID
      if (recoveredEntries.length > 0) {
        const mergedMap = new Map<string, RankingEntry>()
        
        [...currentEntries, ...recoveredEntries].forEach((entry) => {
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
