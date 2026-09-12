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
      const saved = typeof window !== 'undefined' ? localStorage.getItem('latribu_ranking') : null
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      console.error('Error al obtener el ranking:', e)
      return []
    }
  },
}
