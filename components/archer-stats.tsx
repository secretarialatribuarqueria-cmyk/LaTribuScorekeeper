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

  const stats = useMemo(() => {
    let totalScore = 0
    let totalArrows = 0
    let countX = 0
    let count10 = 0
    let countGold = 0 // 10s + 9s (o X)
    let countMiss = 0
    const scoreDistribution: Record<string, number> = {}

    // Puntuaciones por tanda para ver la tendencia/consistencia
    const endTotals: number[] = []

    archer.ends.forEach((end) => {
      let currentEndTotal = 0
      let arrowsInEnd = 0

      end.forEach((label) => {
        if (!label) return
        totalArrows++
        arrowsInEnd++

        // Conteo individual por etiqueta (X, 10, 9, M, etc.)
        scoreDistribution[label] = (scoreDistribution[label] || 0) + 1

        const key = arrowKey(config, label)
        const val = key ? key.value : 0
        totalScore += val
        currentEndTotal += val

        if (label === 'X') countX++
        if (label === '10' || label === 'X') count10++
        if (val >= 9) countGold++
        if (val === 0 || label === 'M') countMiss++
      })

      if (arrowsInEnd > 0) {
        endTotals.push(currentEndTotal)
      }
    })

    const averagePerArrow = totalArrows > 0 ? totalScore / totalArrows : 0
    const averagePerEnd = endTotals.length > 0 ? totalScore / endTotals.length : 0

    // Cálculo de Consistencia (Desviación Estándar de las tandas)
    let stdDev = 0
    if (endTotals.length > 1) {
      const variance =
        endTotals.reduce((acc, score) => acc + Math.pow(score - averagePerEnd, 2), 0) /
        endTotals.length
      stdDev = Math.sqrt(variance)
    }

    return {
      totalScore,
      totalArrows,
      averagePerArrow,
      averagePerEnd,
      countX,
      count10,
      goldPercentage: totalArrows > 0 ? ((countGold / totalArrows) * 100).toFixed(1) : '0',
      missPercentage: totalArrows > 0 ? ((countMiss / totalArrows) * 100).toFixed(1) : '0',
      scoreDistribution,
      endTotals,
      consistencyScore: stdDev === 0 ? 'N/A' : (100 - stdDev * 5).toFixed(0), // Score hipotético de consistencia
    }
  }, [archer, config])

  return (
    <div className="flex flex-col gap-4 py-2">
      {/* Encabezado del Arquero */}
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

      {/* Tarjetas de Métricas Clave */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MetricCard
          icon={<TrendingUp className="size-4 text-emerald-400" />}
          label="Prom. x Flecha"
          value={stats.averagePerArrow.toFixed(2)}
        />
        <MetricCard
          icon={<Award className="size-4 text-amber-400" />}
          label="Total Xs / 10s"
          value={`${stats.countX} / ${stats.count10}`}
        />
        <MetricCard
          icon={<Target className="size-4 text-yellow-400" />}
          label="% En la Zona de Oro"
          value={`${stats.goldPercentage}%`}
        />
        <MetricCard
          icon={<Activity className="size-4 text-sky-400" />}
          label="Índice Consistencia"
          value={stats.consistencyScore !== 'N/A' ? `${stats.consistencyScore}/100` : '-'}
        />
      </div>

      {/* Distribución de Flechas */}
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

      {/* Rendimiento por Tanda */}
      {stats.endTotals.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="mb-3 font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Puntaje por Tanda
          </h4>
          <div className="flex items-end gap-1.5 h-24 pt-2">
            {stats.endTotals.map((score, i) => {
              const maxPossible = config.arrowsPerEnd * 10
              const heightPct = Math.max(15, (score / maxPossible) * 100)
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] font-bold">{score}</span>
                  <div
                    className="w-full rounded-t-md bg-primary transition-all hover:bg-primary-bright"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] text-muted-foreground">T{i + 1}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
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
