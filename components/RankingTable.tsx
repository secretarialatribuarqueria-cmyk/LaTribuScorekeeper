'use client'

import { useEffect, useState } from 'react'
import { Trophy, Medal, Award } from 'lucide-react'
import { getGlobalRanking } from '@/lib/rankingService'

export function RankingTable() {
  const [ranking, setRanking] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRanking() {
      const data = await getGlobalRanking()
      setRanking(data)
      setLoading(false)
    }
    loadRanking()
  }, [])

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12 text-center text-sm text-muted-foreground">
        Cargando posiciones del ranking...
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-4">
      <div className="mb-6 text-center">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
          Ranking Global
        </h2>
        <p className="text-sm text-muted-foreground">
          Los mejores puntajes registrados en la nube
        </p>
      </div>

      {ranking.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          Aún no hay puntajes registrados. ¡Completa un torneo y guárdalo!
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2.5 font-medium">#</th>
                <th className="px-2 py-2.5 font-medium">Arquero</th>
                <th className="px-2 py-2.5 font-medium">Modalidad</th>
                <th className="px-2 py-2.5 text-right font-medium">Total</th>
                <th className="px-3 py-2.5 text-right font-medium">10s / Xs</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((item, i) => (
                <tr key={item.id || i} className="border-b border-border/60 last:border-0 hover:bg-muted/50">
                  <td className="px-3 py-3">
                    {i === 0 ? (
                      <Trophy className="size-4 text-amber-400" aria-label="1° Lugar" />
                    ) : i === 1 ? (
                      <Medal className="size-4 text-slate-300" aria-label="2° Lugar" />
                    ) : i === 2 ? (
                      <Award className="size-4 text-amber-700" aria-label="3° Lugar" />
                    ) : (
                      <span className="text-muted-foreground tabular-nums">{i + 1}</span>
                    )}
                  </td>
                  <td className="px-2 py-3">
                    <span className="block font-medium">{item.archer_name}</span>
                    <span className="block text-[11px] text-muted-foreground">
                      {item.category ? `${item.category} · ` : ''}{item.bow_type}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-xs text-muted-foreground">
                    {item.tournament_type}
                  </td>
                  <td className="px-2 py-3 text-right font-display text-base font-bold tabular-nums text-primary-bright">
                    {item.total_score}
                  </td>
                  <td className="px-3 py-3 text-right text-xs tabular-nums text-muted-foreground">
                    {item.tens_count} / {item.x_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}