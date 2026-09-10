import { supabase } from './supabase'

// Guardar los resultados de la partida en Supabase
export async function saveMatchResults(archersResults: any[]) {
  const { data, error } = await supabase
    .from('matches')
    .insert(archersResults)

  if (error) {
    console.error('Error al guardar en Supabase:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

// Obtener el ranking global (mejores puntajes primero)
export async function getGlobalRanking() {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('total_score', { ascending: false })
    .order('tens_count', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error al obtener el ranking:', error)
    return []
  }

  return data
}
