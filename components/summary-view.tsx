'use client'

import { useMemo, useState } from 'react'
import { Trophy, CloudUpload, Loader2 } from 'lucide-react'
import { DISCIPLINES } from '@/lib/disciplines'
import { computeStats, endTotal } from '@/lib/scoring'
import { saveMatchResults } from '@/lib/rankingService'
import type { Tournament } from '@/lib/types'

export function SummaryView({ tournament }: { tournament: Tournament }) {
  const config = DISCIPLINES[tournament.disciplineId]
  const is3d = tournament.disciplineId === '3d'

  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const ranked = useMemo(() => {
    return tournament.archers
      .map((a) => ({ archer: a, stats: computeStats(config, a) }))
      .sort((a, b) => b.stats.total - a.stats.total)
  }, [config, tournament.archers])

  const [openId, setOpenId] = useState<string | null>(
    tournament.archers[0]?.id ?? null,
  )

  const handleSaveToRanking = async () => {
    setIsSaving(true)

    // Formateamos los arqueros de este torneo para enviarlos a Supabase
    const dataToSave = ranked.map(({ archer, stats }) => ({
      archer_name: archer.name || 'Arquero sin nombre',
      bow_type: archer.bowType || 'No especificado',
      category: archer.category || 'General',
      tournament_type: config.name || 'Torneo',
      total_score: stats.total,
      tens_count: stats.count10,
      x_count: stats.countX,
    }))

    const result = await saveMatchResults(dataToSave)
    setIsSaving(false)

    if (result.success) {
      setIsSaved(true)
      alert('¡Resultados guardados exitosamente en el Ranking Global!')
    } else {
      alert('Hubo un problema al guardar en la nube. Revisa tu conexión.')
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-xl font-bold uppercase tracking-wide">
            Planilla
          </h2>
          <p className="text-sm text-muted-foreground">{config.name}</p>
        </div>

        {/* Botón para subir resultados a Supabase */}
        <button
          type="button"
          onClick={handleSaveToRanking}
          disabled={isSaving || isSaved}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 font-display text-xs font-bold uppercase tracking-wider transition-colors ${
            isSaved
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50 cursor-default'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Guardando...
            </>
          ) : isSaved ? (
            <>
              ✓ Guardado en Ranking
            </>
          ) : (
            <>
              <CloudUpload className="size-4" />
              Guardar en Ranking
            </>
          )}
        </button>
      </div>

      {/* Comparison table */}
      <div className="mb-6 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-2 py-2 font-medium">Arquero</th>
              <th className="px-2 py-2 text-right font-medium">Total</th>
              <th className="px-2 py-2 text-right font-medium">Prom.</th>
              {is3d && <th className="px-2 py-2 text-right font-medium">11</th>}
              <th className="px-2 py-2 text-right font-medium">10</th>
              <th className="px-3 py-2 text-right font-medium">X</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map(({ archer, stats }, i) => (
              <tr key={archer.id} className="border-b border-border/60 last:border-0">
                <td className="px-3 py-2.5">
                  {i === 0 ? (
                    <Trophy className="size-4 text-chart-3" aria-label="Líder" />
                  ) : (
                    <span className="text-muted-foreground">{i + 1}</span>
                  )}
                </td>
                <td className="px-2 py-2.5">
                  <span className="block truncate font-medium">{archer.name}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {archer.bowType}
                  </span>
                </td>
                <td className="px-2 py-2.5 text-right font-display text-base font-bold tabular-nums">
                  {stats.total}
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums">
                  {stats.average.toFixed(2)}
                </td>
                {is3d && (
                  <td className="px-2 py-2.5 text-right tabular-nums">
                    {stats.count11}
                  </td>
                )}
                <td className="px-2 py-2.5 text-right tabular-nums">
                  {stats.count10}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums">{stats.countX}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Individual breakdowns */}
      <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-primary-bright">
        Desglose individual
      </h3>
      <div className="flex flex-col gap-2">
        {tournament.archers.map((archer) => {
          const stats = computeStats(config, archer)
          const open = openId === archer.id
          return (
            <div
              key={archer.id}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : archer.id)}
                className="flex w-full items-center justify-between px-3 py-3 text-left"
                aria-expanded={open}
              >
                <span className="min-w-0">
                  <span className="block truncate font-display font-bold uppercase tracking-wide">
                    {archer.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {archer.category ? `${archer.category} · ` : ''}
                    {archer.bowType}
                  </span>
                </span>
                <span className="text-right">
                  <span className="block font-display text-lg font-bold tabular-nums">
                    {stats.total}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    prom {stats.average.toFixed(2)}
                  </span>
                </span>
              </button>

              {open && (
                <div className="border-t border-border px-3 py-3">
                  <div className="mb-3 grid grid-cols-4 gap-2 text-center">
                    <MiniStat label="Total" value={stats.total} />
                    <MiniStat label="Xs" value={stats.countX} />
                    <MiniStat label="10s" value={stats.count10} />
                    {is3d ? (
                      <MiniStat label="11s" value={stats.count11} />
                    ) : (
                      <MiniStat label="Flechas" value={stats.arrows} />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
                    <div className="col-span-full grid grid-cols-[auto_1fr_auto_auto] gap-x-3 border-b border-border pb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                      <span>{config.endLabel}</span>
                      <span>Flechas</span>
                      <span className="text-right">Sub</span>
                      <span className="text-right">Acum</span>
                    </div>
                    {archer.ends.map((end, ei) => {
                      const arrows = end.filter((a) => a != null)
                      if (arrows.length === 0) return null
                      return (
                        <div
                          key={ei}
                          className="col-span-full grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-3 border-b border-border/40 py-1 text-sm last:border-0"
                        >
                          <span className="w-6 text-muted-foreground tabular-nums">
                            {ei + 1}
                          </span>
                          <span className="truncate font-mono text-xs tracking-wide">
                            {arrows.join('  ')}
                          </span>
                          <span className="text-right tabular-nums">
                            {endTotal(config, end)}
                          </span>
                          <span className="text-right font-medium tabular-nums">
                            {stats.runningTotals[ei]}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-secondary p-2">
      <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="block font-display text-lg font-bold tabular-nums">
        {value}
      </span>
    </div>
  )
}