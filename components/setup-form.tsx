'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Plus, Swords, Target, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DISCIPLINE_LIST, DISCIPLINES } from '@/lib/disciplines'
import { matchFormatFor, type MatchDraft } from '@/lib/match'
import {
  BOW_TYPES,
  CATEGORIES,
  type BowType,
  type DisciplineId,
} from '@/lib/types'
import type { ArcherDraft } from '@/lib/use-tournament'

type Mode = 'patrulla' | 'match'

function emptyArcher(): ArcherDraft {
  return { name: '', category: 'Senior', bowType: 'Recurvo Olímpico' }
}

export function SetupForm({
  onStartPatrulla,
  onStartMatch,
}: {
  onStartPatrulla: (discipline: DisciplineId, archers: ArcherDraft[]) => void
  onStartMatch: (discipline: DisciplineId, archers: [MatchDraft, MatchDraft]) => void
}) {
  const [mode, setMode] = useState<Mode>('patrulla')
  const [discipline, setDiscipline] = useState<DisciplineId>('indoor')
  const [archers, setArchers] = useState<ArcherDraft[]>([emptyArcher()])
  const [duel, setDuel] = useState<[ArcherDraft, ArcherDraft]>([
    { name: '', category: 'Senior', bowType: 'Recurvo Olímpico' },
    { name: '', category: 'Senior', bowType: 'Recurvo Olímpico' },
  ])

  function updateArcher(index: number, patch: Partial<ArcherDraft>) {
    setArchers((prev) => prev.map((a, i) => (i === index ? { ...a, ...patch } : a)))
  }

  function updateDuel(index: 0 | 1, patch: Partial<ArcherDraft>) {
    setDuel((prev) => {
      const next: [ArcherDraft, ArcherDraft] = [prev[0], prev[1]]
      next[index] = { ...prev[index], ...patch }
      return next
    })
  }

  function addArcher() {
    setArchers((prev) => (prev.length >= 4 ? prev : [...prev, emptyArcher()]))
  }

  function removeArcher(index: number) {
    setArchers((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)))
  }

  const canStartPatrulla = archers.every((a) => a.name.trim().length > 0)
  const canStartMatch = duel.every((a) => a.name.trim().length > 0)
  const canStart = mode === 'patrulla' ? canStartPatrulla : canStartMatch

  // Preview of the derived match format.
  const compound = duel[0].bowType === 'Compuesto' || duel[1].bowType === 'Compuesto'
  const matchInfo = matchFormatFor(discipline, compound ? 'Compuesto' : duel[0].bowType)

  function handleStart() {
    if (mode === 'patrulla') {
      onStartPatrulla(discipline, archers)
    } else {
      onStartMatch(discipline, [duel[0], duel[1]])
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex size-24 items-center justify-center overflow-hidden rounded-2xl bg-foreground shadow-lg">
          <Image
            src="/logo-la-tribu.jpg"
            alt="Logo La Tribu Arquería"
            width={96}
            height={96}
            className="size-full object-contain"
            priority
          />
        </div>
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-balance">
          Nueva Sesión
        </h2>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">
          Elige el formato de competición y registra a los arqueros.
        </p>
      </div>

      {/* Mode selection */}
      <section className="mb-6">
        <SectionTitle icon={<Swords className="size-4" />}>Formato</SectionTitle>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ModeCard
            active={mode === 'patrulla'}
            onClick={() => setMode('patrulla')}
            icon={<Users className="size-5" />}
            title="Patrulla / Entrenamiento"
            desc="Hasta 4 arqueros anotando en la misma diana."
          />
          <ModeCard
            active={mode === 'match'}
            onClick={() => setMode('match')}
            icon={<Swords className="size-5" />}
            title="Cruces Eliminatorios / Finales"
            desc="Enfrentamiento directo 1 vs 1 (Match Play)."
          />
        </div>
      </section>

      {/* Discipline selection */}
      <section className="mb-6">
        <SectionTitle icon={<Target className="size-4" />}>Disciplina</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          {DISCIPLINE_LIST.map((d) => {
            const active = d.id === discipline
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDiscipline(d.id)}
                aria-pressed={active}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  active
                    ? 'border-primary-bright bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground hover:border-primary-bright/60'
                }`}
              >
                <span className="block font-display text-sm font-semibold uppercase tracking-wide">
                  {d.name}
                </span>
                <span
                  className={`mt-0.5 block text-xs ${
                    active ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}
                >
                  {mode === 'patrulla'
                    ? `${d.ends} ${d.endLabel.toLowerCase()}s · ${
                        d.fixedArrows ? `${d.arrowsPerEnd}` : `1-${d.arrowsPerEnd}`
                      } flechas`
                    : matchDisciplineHint(d.id)}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {mode === 'patrulla' ? (
        <PatrullaArchers
          archers={archers}
          onUpdate={updateArcher}
          onAdd={addArcher}
          onRemove={removeArcher}
        />
      ) : (
        <MatchArchers
          duel={duel}
          onUpdate={updateDuel}
          format={matchInfo.format}
          numEnds={matchInfo.numEnds}
          arrowsPerEnd={matchInfo.arrowsPerEnd}
          endLabel={matchInfo.endLabel}
        />
      )}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl">
          <Button
            type="button"
            className="h-12 w-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary-bright"
            disabled={!canStart}
            onClick={handleStart}
          >
            {canStart
              ? mode === 'patrulla'
                ? 'Comenzar a Anotar'
                : 'Comenzar el Cruce'
              : 'Ingresa el nombre de cada arquero'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function matchDisciplineHint(id: DisciplineId): string {
  if (id === 'field' || id === '3d') return '4 blancos · suma total'
  return 'Sets (o suma total en Compuesto)'
}

function PatrullaArchers({
  archers,
  onUpdate,
  onAdd,
  onRemove,
}: {
  archers: ArcherDraft[]
  onUpdate: (i: number, patch: Partial<ArcherDraft>) => void
  onAdd: () => void
  onRemove: (i: number) => void
}) {
  return (
    <section className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <SectionTitle icon={<Users className="size-4" />} className="mb-0">
          Arqueros ({archers.length}/4)
        </SectionTitle>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={onAdd}
          disabled={archers.length >= 4}
        >
          <Plus className="size-4" /> Añadir
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {archers.map((archer, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex size-7 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-accent-foreground">
                {i + 1}
              </span>
              {archers.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-destructive"
                  aria-label={`Eliminar arquero ${i + 1}`}
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
            <ArcherFields
              archer={archer}
              onChange={(patch) => onUpdate(i, patch)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

function MatchArchers({
  duel,
  onUpdate,
  format,
  numEnds,
  arrowsPerEnd,
  endLabel,
}: {
  duel: [ArcherDraft, ArcherDraft]
  onUpdate: (i: 0 | 1, patch: Partial<ArcherDraft>) => void
  format: 'sets' | 'cumulative'
  numEnds: number
  arrowsPerEnd: number
  endLabel: string
}) {
  return (
    <section className="mb-6">
      <SectionTitle icon={<Swords className="size-4" />}>
        Enfrentamiento 1 vs 1
      </SectionTitle>

      <div className="mb-3 rounded-lg border border-accent/40 bg-accent/10 p-3 text-xs text-foreground">
        <p className="font-semibold uppercase tracking-wide text-accent">
          {format === 'sets' ? 'Sistema por Sets' : 'Sistema Acumulado'}
        </p>
        <p className="mt-1 text-muted-foreground text-pretty">
          {format === 'sets'
            ? `Hasta ${numEnds} sets de ${arrowsPerEnd} flechas. Gana el set: +2 pts; empate: +1 pt cada uno. Primero en llegar a 6 puntos de set gana. Empate 5-5 → Flecha de Oro (desempate).`
            : `${numEnds} ${endLabel.toLowerCase()}s de ${arrowsPerEnd} flechas por suma total de puntos. Empate → flecha de desempate (shoot-off).`}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {duel.map((archer, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-accent-foreground">
                {i === 0 ? 'A' : 'B'}
              </span>
              <span className="font-display text-sm font-semibold uppercase tracking-wide">
                Arquero {i === 0 ? 'A' : 'B'}
              </span>
            </div>
            <ArcherFields
              archer={archer}
              onChange={(patch) => onUpdate(i as 0 | 1, patch)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

function ArcherFields({
  archer,
  onChange,
}: {
  archer: ArcherDraft
  onChange: (patch: Partial<ArcherDraft>) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Field label="Nombre">
        <input
          value={archer.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Nombre del arquero"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-primary-bright"
        />
      </Field>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Categoría">
          <SelectBox
            value={archer.category}
            onChange={(v) => onChange({ category: v })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectBox>
        </Field>

        <Field label="Tipo de arco">
          <SelectBox
            value={archer.bowType}
            onChange={(v) => onChange({ bowType: v as BowType })}
          >
            {BOW_TYPES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </SelectBox>
        </Field>
      </div>
    </div>
  )
}

function ModeCard({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
        active
          ? 'border-primary-bright bg-primary text-primary-foreground'
          : 'border-border bg-card text-foreground hover:border-primary-bright/60'
      }`}
    >
      <span
        className={`mt-0.5 shrink-0 ${
          active ? 'text-primary-foreground' : 'text-primary-bright'
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-sm font-semibold uppercase tracking-wide">
          {title}
        </span>
        <span
          className={`mt-0.5 block text-xs ${
            active ? 'text-primary-foreground/80' : 'text-muted-foreground'
          }`}
        >
          {desc}
        </span>
      </span>
    </button>
  )
}

function SectionTitle({
  icon,
  children,
  className = '',
}: {
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <h3
      className={`mb-3 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-primary-bright ${className}`}
    >
      {icon}
      {children}
    </h3>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}

function SelectBox({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground outline-none focus:border-primary-bright"
    >
      {children}
    </select>
  )
}
