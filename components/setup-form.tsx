'use client'

import { useState } from 'react'
import { Trophy, Users, Swords, Plus, Trash2 } from 'lucide-react'
import { BOW_TYPES, CATEGORIES, type BowType, type DisciplineId } from '@/lib/types'
import { DISCIPLINES } from '@/lib/disciplines'

interface SetupFormProps {
  onStartSession: (data: {
    format: 'patrulla' | 'cruces' | 'torneo'
    disciplineId: DisciplineId
    archers: Array<{ name: string; category: string; bowType: BowType }>
  }) => void
}

export function SetupForm({ onStartSession }: SetupFormProps) {
  const [format, setFormat] = useState<'patrulla' | 'cruces' | 'torneo'>('torneo')
  const [disciplineId, setDisciplineId] = useState<DisciplineId>('indoor_18m')
  const [archers, setArchers] = useState<Array<{ name: string; category: string; bowType: BowType }>>([
    { name: '', category: 'Senior', bowType: 'Recurvo' },
  ])

  const maxArchers = format === 'patrulla' ? 4 : format === 'cruces' ? 2 : 16

  const handleAddArcher = () => {
    if (archers.length < maxArchers) {
      setArchers([...archers, { name: '', category: 'Senior', bowType: 'Recurvo' }])
    }
  }

  const handleRemoveArcher = (index: number) => {
    if (archers.length > 1) {
      setArchers(archers.filter((_, i) => i !== index))
    }
  }

  const handleArcherChange = (index: number, field: string, value: string) => {
    const updated = [...archers]
    updated[index] = { ...updated[index], [field]: value }
    setArchers(updated)
  }

  const isValid = archers.every((a) => a.name.trim().length > 0)

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6 p-4">
      <div className="text-center flex flex-col items-center gap-2">
        <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
          <Trophy className="size-8 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-black uppercase tracking-wide">Nueva Sesión</h1>
        <p className="text-xs text-muted-foreground">Elige el formato de competición y registra a los arqueros.</p>
      </div>

      {/* FORMATO */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Swords className="size-4" /> Formato
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setFormat('torneo')}
            className={`flex flex-col gap-1 p-3 rounded-xl border text-left transition-all ${
              format === 'torneo'
                ? 'border-primary bg-primary/10 text-foreground shadow-sm'
                : 'border-border bg-card/50 text-muted-foreground hover:border-border/80'
            }`}
          >
            <span className="font-bold text-xs uppercase flex items-center gap-1 text-primary">
              <Trophy className="size-3.5" /> Torneo WA
            </span>
            <span className="text-[10px] leading-tight opacity-80">Clasificación 720/600 + Brackets (Top 8).</span>
          </button>

          <button
            type="button"
            onClick={() => setFormat('patrulla')}
            className={`flex flex-col gap-1 p-3 rounded-xl border text-left transition-all ${
              format === 'patrulla'
                ? 'border-primary bg-primary/10 text-foreground shadow-sm'
                : 'border-border bg-card/50 text-muted-foreground hover:border-border/80'
            }`}
          >
            <span className="font-bold text-xs uppercase flex items-center gap-1">
              <Users className="size-3.5" /> Patrulla
            </span>
            <span className="text-[10px] leading-tight opacity-80">Hasta 4 arqueros anotando en la misma diana.</span>
          </button>

          <button
            type="button"
            onClick={() => setFormat('cruces')}
            className={`flex flex-col gap-1 p-3 rounded-xl border text-left transition-all ${
              format === 'cruces'
                ? 'border-primary bg-primary/10 text-foreground shadow-sm'
                : 'border-border bg-card/50 text-muted-foreground hover:border-border/80'
            }`}
          >
            <span className="font-bold text-xs uppercase flex items-center gap-1">
              <Swords className="size-3.5" /> Cruces Directos
            </span>
            <span className="text-[10px] leading-tight opacity-80">Enfrentamiento directo 1 vs 1 (Match Play).</span>
          </button>
        </div>
      </div>

      {/* DISCIPLINA */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Disciplina</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(DISCIPLINES).map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDisciplineId(d.id)}
              className={`flex flex-col p-2.5 rounded-xl border text-left transition-all ${
                disciplineId === d.id
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-card/50 text-muted-foreground'
              }`}
            >
              <span className="font-bold text-xs">{d.name}</span>
              <span className="text-[10px] opacity-70">
                {d.ends} tandas · {d.arrowsPerEnd} flechas
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ARQUEROS */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Users className="size-4" /> Arqueros ({archers.length}/{maxArchers})
          </label>
          {archers.length < maxArchers && (
            <button
              type="button"
              onClick={handleAddArcher}
              className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <Plus className="size-3.5" /> Añadir
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {archers.map((archer, idx) => (
            <div key={idx} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="size-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                {archers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveArcher(idx)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="Nombre del arquero"
                value={archer.name}
                onChange={(e) => handleArcherChange(idx, 'name', e.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={archer.category}
                  onChange={(e) => handleArcherChange(idx, 'category', e.target.value)}
                  className="rounded-lg border border-border bg-muted px-2 py-1.5 text-xs font-medium focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <select
                  value={archer.bowType}
                  onChange={(e) => handleArcherChange(idx, 'bowType', e.target.value as BowType)}
                  className="rounded-lg border border-border bg-muted px-2 py-1.5 text-xs font-medium focus:outline-none"
                >
                  {BOW_TYPES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        disabled={!isValid}
        onClick={() => onStartSession({ format, disciplineId, archers })}
        className={`w-full rounded-xl py-3 font-bold text-xs uppercase tracking-wider shadow-md transition-all ${
          isValid
            ? 'bg-primary text-primary-foreground hover:brightness-110 active:scale-95'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        {isValid ? 'Comenzar Torneo' : 'Ingresa el nombre de cada arquero'}
      </button>
    </div>
  )
}
 
