'use client'

import { useMemo } from 'react'
import { Target, TrendingUp, Award, Activity, BarChart2 } from 'lucide-react'
import { DISCIPLINES } from '@/lib/disciplines'
import { arrowKey } from '@/lib/scoring'
import type { Archer, DisciplineId } from '@/lib/types'

interface ArcherStatsProps {
  archer: Archer
  disciplineId: DisciplineId
}

export function ArcherStats({ archer, disciplineId }: ArcherStatsProps) {
  const config = DISCIPLINES[disciplineId]

  const is3D = disciplineId.includes('3d')
  const isField = disciplineId.includes('field') || disciplineId.includes('jjcc')

  const stats = useMemo(() => {
    let totalScore = 0
    let totalArrows = 0
    let countTopValues = 0 // 11s/10s en 3D, 6s en JJCC, Xs/10s en Target
    let countHighZone = 0 // Zona de valor alto relativa a la disciplina
    let countMiss = 0
    const scoreDistribution: Record<string, number> = {}
    const endTotals: number[] = []

    archer.ends.forEach((end) => {
      let currentEndTotal = 0
      let arrowsInEnd = 0

      end.forEach((label) => {
        if (!label) return
        totalArrows++
        arrowsInEnd++

        scoreDistribution[label] = (scoreDistribution[label] || 0) + 1

        const key = arrowKey(config, label)
        const val = key ? key.value : 0
        totalScore += val
        currentEndTotal += val

        // Adaptar conteo según reglamento de la disciplina
        if (is3D) {
          if (label === '11' || label === '10') countTopValues++
          if (val >= 8) countHighZone++
        } else if (isField) {
          if (label === '6' || label === '+') countTopValues++
          if (val >= 5) countHighZone++
        } else {
          if (label === 'X' || label === '10') countTopValues++
          if (val >= 9) countHighZone++
        }

        if (val === 0 || label === 'M') countMiss++
      })

      if (arrowsInEnd > 0) {
        endTotals.push(currentEndTotal)
      }
    })

    const averagePerArrow = totalArrows > 0 ? totalScore / totalArrows : 0
    const averagePerEnd = endTotals.length > 0 ? totalScore / endTotals.length : 0

    let stdDev = 0
    if (endTotals.length > 1) {
      const variance =
        endTotals.reduce((acc, score) => acc - averagePerEnd, 2) / endTotals.length
      stdDev = Math.sqrt(Math.abs(variance))
    }

    return {
      totalScore,
      totalArrows,
      averagePerArrow,
      averagePerEnd,
      countTopValues,
      highZonePercentage: totalArrows > 0 ? ((countHighZone / totalArrows) * 100).toFixed(1) : '0',
      scoreDistribution,
      endTotals,
      consistencyScore: stdDev === 0 ? 'N/A' : Math.max(0, Math.min(100, Math.round(100 - stdDev * 4))),
    }
  }, [archer, config, is3D, isField])

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold uppercase">{archer.name}</h3>
            <p className="text-xs text-muted-foreground">
              {archer.category} · {archer.bowType}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase text-muted-foreground">Puntaje Total</span>
            <p className="font-display text-2xl font-black text-primary-bright">
              {stats.totalScore}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MetricCard
          icon={<TrendingUp className="size-4 text-emerald-400" />}
          label="Prom. x Flecha"
          value={stats.averagePerArrow.toFixed(2)}
        />
        <MetricCard
          icon={<Award className="size-4 text-amber-400" />}
          label={is3D ? "Total 11s/10s" : isField ? "Total 6s/+" : "Total 10s/Xs"}
          value={`${stats.countTopValues}`}
        />
        <MetricCard
          icon={<Target className="size-4 text-yellow-400" />}
          label={is3D ? "% Vital (8+)" : isField ? "% Centro (5+)" : "% Oro (9+)"}
          value={`${stats.highZonePercentage}%`}
        />
        <MetricCard
          icon={<Activity className="size-4 text-sky-400" />}
          label="Consistencia"
          value={stats.consistencyScore !== 'N/A' ? `${stats.consistencyScore}/100` : '-'}
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h4 className="mb-3 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <BarChart2 className="size-4 text-primary-bright" /> Distribución de Impactos
        </h4>
        <div className="flex flex-col gap-2">
          {Object.entries(stats.scoreDistribution)
            .sort((a, b) => b[1] - a[1])
            .map(([label, count]) => {
              const pct = stats.totalArrows > 0 ? ((count / stats.totalArrows) * 100).toFixed(0) : 0
              return (
                <div key={label} className="flex items-center gap-3 text-xs">
                  <span className="w-6 font-bold text-center">{label}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary-bright transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-muted-foreground">
                    {count} ({pct}%)
                  </span>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <span className="font-display text-xl font-bold tabular-nums text-foreground">
        {value}
      </span>
    </div>
  )
}
