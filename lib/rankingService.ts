import { supabase } from './supabase'

export interface RankingEntry {
  id?: string
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
  saveScore: async (entry: Partial<RankingEntry>) => {
    try {
      const formattedDate = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })

      const newEntry = {
        archerName: entry.archerName || 'Arquero',
        category: entry.category || 'General',
        bowType: entry.bowType || 'Raso',
        score: Number(entry.score || 0),
        xs: Number(entry.xs || 0),
        tens: Number(entry.tens || 0),
        disciplineId: entry.disciplineId || 'indoor',
        date: entry.date || formattedDate,
      }

      // Guardar en Supabase
      const { data, error } = await supabase.from('rankings').insert([newEntry]).select()

      if (error) {
        console.error('Error insertando en Supabase:', error.message)
        // Respaldo en localStorage si falla Supabase
        const current = rankingService.getLocalRanking()
        localStorage.setItem('latribu_ranking', JSON.stringify([...current, { ...newEntry, id: String(Date.now()) }]))
      }

      return data
    } catch (e) {
      console.error('Error al guardar en el ranking global:', e)
      return null
    }
  },

  getRanking: async (): Promise<RankingEntry[]> => {
    try {
      // Consultar la base de datos global en Supabase
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .order('score', { ascending: false })

      if (error) {
        console.error('Error consultando Supabase:', error.message)
        return rankingService.getLocalRanking()
      }

      return data || []
    } catch (e) {
      console.error('Error al obtener el ranking de Supabase:', e)
      return rankingService.getLocalRanking()
    }
  },

  getLocalRanking: (): RankingEntry[] => {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem('latribu_ranking')
    return saved ? JSON.parse(saved) : []
  }
}
