'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Delete, Trophy, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Keypad } from '@/components/keypad'
import { DISCIPLINES } from '@/lib/disciplines'
import { computeMatch, SET_POINTS_TO_WIN, type Side } from '@/lib/match'
import { arrowKey, endTotal } from '@/lib/scoring'
import type { ArrowValue, Match } from '@/lib/types'

export function MatchScreen({
  match,
  setMatchArrow,
  setShootOffArrow,
}: {
  match: Match
  setMatchArrow: (
    archerIndex: 0 | 1,
    endIndex: number,
    arrowIndex: number,
    label: string | null,
  ) => void
  setShootOffArrow: (archerIndex: 0 | 1, label: string | null) => void
}) {
  const config = DISCIPLINES[match.disciplineId]
  const result = useMemo(() => computeMatch(match), [match])

  const [currentEnd, setCurrentEnd] = useState(0)
  const [activeArcher, setActiveArcher] = useState<0 | 1>(0)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [shootOffActive, setShootOffActive] = useState<0 | 1>(0)

  const inShootOff = result.status === 'needs-shootoff' || match.shootOff != null
  const complete = result.status === 'complete'

  const end = match.ends[currentEnd]
  const activeArrows = end[activeArcher]

  const firstEmptySlot = activeArrows.findIndex((a) => a == null)
  const targetSlot = selectedSlot ?? (firstEmptySlot === -1 ? null : firstEmptySlot)

  function pressKey(label: string) {
    if (inShootOff) {
      setShootOffArrow(shootOffActive, label)
      setShootOffActive((s) => (s === 0 ? 1 : 0))
      return
    }
    if (targetSlot == null) return
    setMatchArrow(activeArcher, currentEnd, targetSlot, label)
    setSelectedSlot(null)
  }

  function deleteLast() {
    if (inShootOff) {
      setShootOffArrow(shootOffActive, null)
      return
    }
    let lastSlot = -1
    for (let i = 0; i < activeArrows.length; i++) if (activeArrows[i] != null) lastSlot = i
    if (lastSlot === -1) return
    setMatchArrow(activeArcher, currentEnd, lastSlot, null)
    setSelectedSlot(null)
  }

  function goEnd(delta: number) {
    setCurrentEnd((e) => Math.min(match.numEnds - 1, Math.max(0, e + delta)))
    setSelectedSlot(null)
  }

  const [a, b] = match.archers
  const nameA = a.name.split(' ')[0]
  const nameB = b.name.split(' ')[0]
  const bigA = result.format === 'sets' ? result.aSetPoints : result.aTotal
  const bigB = result.format === 'sets' ? result.bSetPoints : result.bTotal

  const keypadDisabled = inShootOff
    ? match.shootOff?.[shootOffActive] != null && result.status === 'complete'
    : complete || targetSlot == null

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-3">
      {/* Scoreboard */}
      <div className="mb-3 rounded-2xl border border-border bg-card p-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <ScoreSide
            name={a.name}
            sub={`${a.category ? a.category + ' · ' : ''}${a.bowType}`}
            big={bigA}
            winning={result.winner === 'a'}
            align="left"
          />
          <div className="flex flex-col items-center px-1">
            <span className="font-display text-xs font-bold uppercase text-muted-foreground">
              vs
            </span>
            <span className="mt-0.5 text-[10px] uppercase tracking-wide text-primary-bright">
              {result.format === 'sets' ? 'Pts. Set' : 'Total'}
            </span>
          </div>
          <ScoreSide
            name={b.name}
            sub={`${b.category ? b.category + ' · ' : ''}${b.bowType}`}
            big={bigB}
            winning={result.winner === 'b'}
            align="right"
          />
        </div>

        <div className="mt-2 border-t border-border pt-2 text-center">
          <StatusLine
            match={match}
            result={result}
            nameA={nameA}
            nameB={nameB}
          />
        </div>
      </div>

      {/* Set-point pips (sets format only) */}
      {result.format === 'sets' && (
        <div className="mb-3 flex items-center justify-center gap-1.5">
          {Array.from({ length: SET_POINTS_TO_WIN }, (_, i) => (
            <Pip key={`a${i}`} filled={result.aSetPoints > i} side="a" />
          ))}
          <span className="mx-1 text-xs font-medium text-muted-foreground">
            {result.aSetPoints}–{result.bSetPoints}
          </span>
          {Array.from({ length: SET_POINTS_TO_WIN }, (_, i) => (
            <Pip key={`b${i}`} filled={result.bSetPoints > i} side="b" />
          ))}
        </div>
      )}

      {/* Shoot-off panel */}
      {inShootOff ? (
        <ShootOffPanel
          match={match}
          result={result}
          nameA={nameA}
          nameB={nameB}
          active={shootOffActive}
          onSelect={setShootOffActive}
          onClear={() => {
            setShootOffArrow(0, null)
            setShootOffArrow(1, null)
          }}
        />
      ) : (
        <>
          {/* End navigation */}
          <div className="mb-3 flex items-center justify-between rounded-xl border border-border bg-card px-2 py-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => goEnd(-1)}
              disabled={currentEnd === 0}
              aria-label={`${match.endLabel} anterior`}
            >
              <ChevronLeft className="size-5" />
            </Button>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {match.endLabel} {currentEnd + 1} / {match.numEnds}
              </p>
              <SetOutcome result={result} endIndex={currentEnd} format={result.format} />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => goEnd(1)}
              disabled={currentEnd === match.numEnds - 1}
              aria-label={`${match.endLabel} siguiente`}
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>

          {/* Two archer panels */}
          <div className="mb-3 grid grid-cols-2 gap-2">
            <ArcherPanel
              label="A"
              name={nameA}
              arrows={end[0]}
              endSum={endTotal(config, end[0])}
              active={activeArcher === 0}
              config={config}
              selectedSlot={activeArcher === 0 ? selectedSlot : null}
              onActivate={() => {
                setActiveArcher(0)
                setSelectedSlot(null)
              }}
              onSelectSlot={(slot) =>
                setSelectedSlot((s) => (s === slot ? null : slot))
              }
            />
            <ArcherPanel
              label="B"
              name={nameB}
              arrows={end[1]}
              endSum={endTotal(config, end[1])}
              active={activeArcher === 1}
              config={config}
              selectedSlot={activeArcher === 1 ? selectedSlot : null}
              onActivate={() => {
                setActiveArcher(1)
                setSelectedSlot(null)
              }}
              onSelectSlot={(slot) =>
                setSelectedSlot((s) => (s === slot ? null : slot))
              }
            />
          </div>
        </>
      )}

      {/* Delete + keypad */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {inShootOff
            ? `Desempate · Arquero ${shootOffActive === 0 ? 'A' : 'B'}`
            : `Anotando · Arquero ${activeArcher === 0 ? 'A' : 'B'} (${
                activeArcher === 0 ? nameA : nameB
              })`}
        </span>
        <button
          type="button"
          onClick={deleteLast}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
        >
          <Delete className="size-4" /> Borrar
        </button>
      </div>

      <Keypad keys={config.keypad} onPress={pressKey} disabled={keypadDisabled} />

      {complete && (
        <p className="mt-3 text-center text-sm font-medium text-primary-bright">
          Match finalizado. Usa el botón de reinicio para un nuevo cruce.
        </p>
      )}
    </div>
  )
}

function ScoreSide({
  name,
  sub,
  big,
  winning,
  align,
}: {
  name: string
  sub: string
  big: number
  winning: boolean
  align: 'left' | 'right'
}) {
  return (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
      <div
        className={`flex items-center gap-1.5 ${
          align === 'right' ? 'flex-row-reverse' : ''
        }`}
      >
        {winning && <Trophy className="size-4 shrink-0 text-chart-3" aria-label="Ganando" />}
        <p className="truncate font-display text-sm font-bold uppercase tracking-wide">
          {name}
        </p>
      </div>
      <p className="truncate text-[11px] text-muted-foreground">{sub}</p>
      <p
        className={`mt-1 font-display text-4xl font-bold tabular-nums leading-none ${
          winning ? 'text-primary-bright' : 'text-foreground'
        }`}
      >
        {big}
      </p>
    </div>
  )
}

function StatusLine({
  match,
  result,
  nameA,
  nameB,
}: {
  match: Match
  result: ReturnType<typeof computeMatch>
  nameA: string
  nameB: string
}) {
  if (result.status === 'complete') {
    if (result.winner === 'tie') {
      return (
        <span className="font-display text-sm font-bold uppercase text-accent">
          Empate — definir por juez
        </span>
      )
    }
    const winnerName = result.winner === 'a' ? nameA : nameB
    const via = result.shootOffWinner ? ' por flecha de desempate' : ''
    return (
      <span className="font-display text-sm font-bold uppercase text-primary-bright">
        Gana {winnerName}
        {via}
      </span>
    )
  }
  if (result.status === 'needs-shootoff') {
    return (
      <span className="flex items-center justify-center gap-1 font-display text-sm font-bold uppercase text-accent">
        <Zap className="size-4" />
        {result.format === 'sets' ? 'Empate 5-5 · Flecha de Oro' : 'Empate · Shoot-off'}
      </span>
    )
  }
  return (
    <span className="text-xs text-muted-foreground">
      {result.format === 'sets'
        ? `Primero a ${SET_POINTS_TO_WIN} puntos de set`
        : `Suma total · ${match.numEnds} ${match.endLabel.toLowerCase()}s`}
    </span>
  )
}

function SetOutcome({
  result,
  endIndex,
  format,
}: {
  result: ReturnType<typeof computeMatch>
  endIndex: number
  format: 'sets' | 'cumulative'
}) {
  const e = result.ends[endIndex]
  if (!e.complete) {
    return (
      <p className="font-display text-lg font-bold tabular-nums">
        {e.aSum} <span className="text-xs text-muted-foreground">–</span> {e.bSum}
      </p>
    )
  }
  const chip =
    format === 'sets'
      ? e.winner === 'tie'
        ? '+1 / +1'
        : e.winner === 'a'
          ? 'A +2'
          : 'B +2'
      : null
  return (
    <div>
      <p className="font-display text-lg font-bold tabular-nums">
        {e.aSum} <span className="text-xs text-muted-foreground">–</span> {e.bSum}
      </p>
      {chip && (
        <span className="text-[10px] font-semibold uppercase tracking-wide text-primary-bright">
          {chip}
        </span>
      )}
    </div>
  )
}

function ArcherPanel({
  label,
  name,
  arrows,
  endSum,
  active,
  config,
  selectedSlot,
  onActivate,
  onSelectSlot,
}: {
  label: string
  name: string
  arrows: ArrowValue[]
  endSum: number
  active: boolean
  config: (typeof DISCIPLINES)[keyof typeof DISCIPLINES]
  selectedSlot: number | null
  onActivate: () => void
  onSelectSlot: (slot: number) => void
}) {
  const recorded = arrows
    .map((label, slot) => ({ label, slot }))
    .filter((x) => x.label != null)
    .sort((x, y) => arrowVal(config, y.label) - arrowVal(config, x.label))

  return (
    <div
      className={`rounded-xl border p-2.5 transition-colors ${
        active
          ? 'border-primary-bright bg-primary/10'
          : 'border-border bg-card'
      }`}
    >
      <button
        type="button"
        onClick={onActivate}
        aria-pressed={active}
        className="mb-2 flex w-full items-center justify-between"
      >
        <span className="flex items-center gap-1.5">
          <span
            className={`flex size-6 items-center justify-center rounded-full font-display text-xs font-bold ${
              active
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {label}
          </span>
          <span className="truncate font-display text-xs font-bold uppercase">
            {name}
          </span>
        </span>
        <span className="font-display text-lg font-bold tabular-nums">{endSum}</span>
      </button>

      <div className="flex min-h-12 flex-wrap items-center gap-1.5">
        {recorded.length === 0 && (
          <span className="text-[11px] text-muted-foreground">
            {active ? 'Toca un valor abajo' : 'Toca para anotar'}
          </span>
        )}
        {recorded.map(({ label, slot }) => {
          const k = arrowKey(config, label)
          const isSel = active && slot === selectedSlot
          return (
            <button
              key={slot}
              type="button"
              onClick={() => {
                if (!active) onActivate()
                onSelectSlot(slot)
              }}
              style={{ backgroundColor: k?.bg, color: k?.fg }}
              className={`flex size-10 items-center justify-center rounded-lg border font-display text-lg font-bold tabular-nums transition-all ${
                isSel
                  ? 'border-primary-bright ring-2 ring-primary-bright'
                  : 'border-black/20'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ShootOffPanel({
  match,
  result,
  nameA,
  nameB,
  active,
  onSelect,
  onClear,
}: {
  match: Match
  result: ReturnType<typeof computeMatch>
  nameA: string
  nameB: string
  active: 0 | 1
  onSelect: (i: 0 | 1) => void
  onClear: () => void
}) {
  const config = DISCIPLINES[match.disciplineId]
  const so = match.shootOff ?? [null, null]

  return (
    <div className="mb-3 rounded-2xl border-2 border-accent/60 bg-accent/10 p-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-display text-sm font-bold uppercase tracking-wide text-accent">
          <Zap className="size-4" />
          {result.format === 'sets' ? 'Flecha de Oro' : 'Flecha de Desempate'}
        </span>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-destructive"
        >
          Reiniciar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {([0, 1] as const).map((i) => {
          const label = so[i]
          const k = arrowKey(config, label)
          const isActive = active === i
          const isWinner = result.shootOffWinner === (i === 0 ? 'a' : 'b')
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              aria-pressed={isActive}
              className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition-colors ${
                isActive
                  ? 'border-primary-bright bg-primary/10'
                  : 'border-border bg-card'
              }`}
            >
              <span className="truncate font-display text-xs font-bold uppercase">
                {i === 0 ? nameA : nameB}
              </span>
              <span
                style={label ? { backgroundColor: k?.bg, color: k?.fg } : undefined}
                className={`flex size-14 items-center justify-center rounded-lg border font-display text-2xl font-bold tabular-nums ${
                  label
                    ? 'border-black/20'
                    : 'border-dashed border-muted-foreground/40 text-muted-foreground'
                } ${isWinner ? 'ring-2 ring-chart-3' : ''}`}
              >
                {label ?? '—'}
              </span>
            </button>
          )
        })}
      </div>

      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Registra una flecha por arquero. Gana el valor más alto; si empatan, la más
        cercana al centro (decide el juez).
      </p>
    </div>
  )
}

function Pip({ filled, side }: { filled: boolean; side: Side }) {
  return (
    <span
      className={`size-2.5 rounded-full ${
        filled
          ? side === 'a'
            ? 'bg-primary-bright'
            : 'bg-accent'
          : 'bg-border'
      }`}
    />
  )
}

function arrowVal(
  config: (typeof DISCIPLINES)[keyof typeof DISCIPLINES],
  label: ArrowValue,
): number {
  const k = arrowKey(config, label)
  return k ? k.value : -1
}
