'use client'

import { InteractiveTarget } from '@/components/interactive-target'
import { ArcherStats } from '@/components/archer-stats'
import { ExportModal } from '@/components/export-modal'
import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Delete, Grid, Target as TargetIcon, BarChart2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Keypad } from '@/components/keypad'
import { DISCIPLINES } from '@/lib/disciplines'
import { arrowKey, computeStats, endTotal } from '@/lib/scoring'
import type { Tournament } from '@/lib/types'

export function ScoringScreen({
  tournament,
  activeArcher,
  onActiveArcherChange,
  setArrow,
}: {
  tournament: Tournament
  activeArcher: number
  onActiveArcherChange: (index: number) => void
  setArrow: (
    archerId: string,
    endIndex: number,
    arrowIndex: number,
    label: string | null,
  ) => void
}) {
  const config = DISCIPLINES[tournament.disciplineId]
  const archer = tournament.archers[activeArcher]
  const [currentEnd, setCurrentEnd] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  
  // Estado para alternar entre Teclado, Diana y Estadísticas
  const [activeTab, setActiveTab] = useState<'keypad' | 'target' | 'stats'>('keypad')
  
  // Estado para abrir/cerrar el modal de exportación
  const [isExportOpen, setIsExportOpen] = useState(false)

  const end = archer.ends[currentEnd]
  const stats = useMemo(() => computeStats(config, archer), [config, archer])

  const firstEmptySlot = end.findIndex((a) => a == null)
  const targetSlot = selectedSlot ?? (firstEmptySlot === -1 ? null : firstEmptySlot)

  const recorded = end
    .map((label, slot) => ({ label, slot }))
    .filter((x) => x.label != null)
    .sort((a, b) => arrowKeyValue(b.label) - arrowKeyValue(a.label))

  function arrowKeyValue(label: string | null) {
    const k = arrowKey(config, label)
    return k ? k.value : -1
  }

  function pressKey(label: string) {
    if (targetSlot == null) return

    setArrow(archer.id, currentEnd, targetSlot, String(label))
    setSelectedSlot(null)

    const updatedEnd = [...end]
    updatedEnd[targetSlot] = String(label)
    const isEndComplete = updatedEnd.every((val) => val != null)

    if (isEndComplete && selectedSlot == null) {
      const isLastArcher = activeArcher === tournament.archers.length - 1

      if (!isLastArcher) {
        onActiveArcherChange(activeArcher + 1)
      } else {
        if (currentEnd < config.ends - 1) {
          onActiveArcherChange(0)
          setCurrentEnd((e) => e + 1)
        }
      }
    }
  }

  function deleteLast() {
    let lastSlot = -1
    for (let i = 0; i < end.length; i++) if (end[i] != null) lastSlot = i
    if (lastSlot === -1) return
    setArrow(archer.id, currentEnd, lastSlot, null)
    setSelectedSlot(null)
  }

  function goEnd(delta: number) {
    setCurrentEnd((e) => Math.min(config.ends - 1, Math.max(0, e + delta)))
    setSelectedSlot(null)
  }

  const currentEndTotal = endTotal(config, end)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 pt-3">
      {/* Pestañas de Selección de Arquero */}
      <div className="mb-3 grid grid-cols-4 gap-1.5">
        {tournament.archers.map((a, i) => {
          const active = i === activeArcher
          const letter = a.targetLetter || String.fromCharCode(65 + i)
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                onActiveArcherChange(i)
                setSelectedSlot(null)
              }}
              aria-pressed={active}
              className={`flex flex-col items-center rounded-lg border px-1 py-2 transition-colors ${
                active
                  ? 'border-primary-bright bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground'
              }`}
            >
              <span className="font-display text-xs font-bold uppercase">
                {letter}
              </span>
              <span className="max-w-full truncate text-[11px]">
                {a.name.split(' ')[0]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Menú de Modos / Vistas + Botón Exportar */}
      <div className="mb-3 flex items-center gap-1.5 rounded-xl border border-border bg-card p-1.5">
        <div className="flex flex-1 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('keypad')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold uppercase transition-colors ${
              activeTab === 'keypad'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Grid className="size-4" /> Teclado
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('target')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold uppercase transition-colors ${
              activeTab === 'target'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <TargetIcon className="size-4" /> Diana
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold uppercase transition-colors ${
              activeTab === 'stats'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <BarChart2 className="size-4" /> Stats
          </button>
        </div>

        {/* Botón de Exportación */}
        <button
          type="button"
          onClick={() => setIsExportOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-500 transition-colors hover:bg-amber-500/20"
        >
          <Download className="size-4" /> Exportar
        </button>
      </div>

      {/* Vista de Estadísticas */}
      {activeTab === 'stats' ? (
        <ArcherStats
          archer={archer}
          disciplineId={tournament.disciplineId}
        />
      ) : (
        <>
          {/* Info del Arquero y Promedio */}
          <div className="mb-3 flex items-stretch gap-3">
            <div className="flex-1 rounded-xl border border-border bg-card p-3">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-amber-500/20 font-display text-xs font-black text-amber-500 border border-amber-500/30">
                  {archer.targetLetter || String.fromCharCode(65 + activeArcher)}
                </span>
                <p className="truncate font-display text-base font-bold uppercase tracking-wide">
                  {archer.name}
                </p>
              </div>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {archer.category ? `${archer.category} · ` : ''}
                {archer.bowType}
              </p>
              <div className="mt-2 flex gap-4 text-xs">
                <Stat label="Total" value={stats.total} />
                <Stat label="Flechas" value={stats.arrows} />
              </div>
            </div>
            <div className="flex w-28 shrink-0 flex-col items-center justify-center rounded-xl border border-primary-bright/40 bg-primary/20 p-3 text-center">
              <span className="text-[10px] font-medium uppercase tracking-wide text-primary-bright">
                Promedio
              </span>
              <span className="font-display text-3xl font-bold tabular-nums text-foreground">
                {stats.average.toFixed(2)}
              </span>
              <span className="text-[10px] text-muted-foreground">por flecha</span>
            </div>
          </div>

          {/* Navegación por Tandas */}
          <div className="mb-3 flex items-center justify-between rounded-xl border border-border bg-card px-2 py-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => goEnd(-1)}
              disabled={currentEnd === 0}
            >
              <ChevronLeft className="size-5" />
            </Button>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {config.endLabel} {currentEnd + 1} / {config.ends}
              </p>
              <p className="font-display text-lg font-bold tabular-nums">
                {currentEndTotal} pts
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => goEnd(1)}
              disabled={currentEnd === config.ends - 1}
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>

          {/* Visor de Flechas */}
          <div className="mb-3 min-h-16 rounded-xl border border-border bg-card p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Flechas de la tanda
              </span>
              <button
                type="button"
                onClick={deleteLast}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-destructive"
              >
                <Delete className="size-4" /> Borrar última
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {recorded.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  {activeTab === 'keypad'
                    ? 'Toca un valor abajo para anotar.'
                    : 'Toca en la diana para anotar.'}
                </span>
              )}
              {recorded.map(({ label, slot }) => {
                const k = arrowKey(config, label)
                const isSelected = slot === selectedSlot
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(isSelected ? null : slot)}
                    style={{ backgroundColor: k?.bg, color: k?.fg }}
                    className={`flex size-12 items-center justify-center rounded-lg border font-display text-xl font-bold tabular-nums ${
                      isSelected ? 'border-primary-bright ring-2 ring-primary-bright' : 'border-black/20'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
              {targetSlot != null && (
                <div className="flex size-12 items-center justify-center rounded-lg border-2 border-dashed border-primary-bright/60 text-xs text-primary-bright">
                  {selectedSlot != null ? 'editar' : 'sig.'}
                </div>
              )}
            </div>
          </div>

          {/* Renderizado de Teclado o Diana (Soporta 3D, JJCC e Indoor/Outdoor) */}
          {activeTab === 'keypad' ? (
            <Keypad
              keys={config.keypad}
              onPress={pressKey}
              disabled={targetSlot == null}
            />
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-border bg-card p-4">
              <InteractiveTarget
                disciplineId={tournament.disciplineId}
                onScoreSelect={(score) => pressKey(String(score))}
              />
            </div>
          )}
        </>
      )}

      {/* Modal de Exportación (PDF / PNG) */}
      <ExportModal
        archer={archer}
        disciplineId={tournament.disciplineId}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="font-display text-lg font-bold tabular-nums leading-none">
        {value}
      </span>
    </span>
  )
}
