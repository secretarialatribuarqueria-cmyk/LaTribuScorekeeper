'use client'

import React, { useState } from 'react'
import { Plus, Trash2, Trophy } from 'lucide-react'
import type { BowType, DisciplineId } from '@/lib/types'

interface SetupFormProps {
  onStart: (data: {
    format: 'patrulla' | 'cruces' | 'torneo'
    disciplineId: DisciplineId
    archers: Array<{ name: string; category: string; bowType: BowType }>
  }) => void
}

const CATEGORIES = ['Escuela', 'Juvenil', 'U12', 'U15', 'U18', 'U21', 'Senior', 'Master']
const BOW_TYPES: BowType[] = ['Recurvo', 'Compuesto', 'Raso', 'Tradicional', 'Longbow']

export function SetupForm({ onStart }: SetupFormProps) {
  const [format, setFormat] = useState<'patrulla' | 'cruces' | 'torneo'>('torneo')
  const [disciplineId, setDisciplineId] = useState<DisciplineId>('indoor_18m')
  const [archers, setArchers] = useState<Array<{ name: string; category: string; bowType: BowType }>>([
    { name: '', category: 'Senior', bowType: 'Recurvo' },
  ])

  const addArcher = () => {
    if (archers.length < 16) {
      setArchers([...archers, { name: '', category: 'Senior', bowType: 'Recurvo' }])
    }
  }

  const removeArcher = (index: number) => {
    if (archers.length > 1) {
      setArchers(archers.filter((_, i) => i !== index))
    }
  }

  const updateArcher = (index: number, field: string, value: string) => {
    const updated = [...archers]
    updated[index] = { ...updated[index], [field]: value }
    setArchers(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validArchers = archers.filter((a) => a.name.trim() !== '')
    if (validArchers.length === 0) return
    onStart({ format, disciplineId, archers: validArchers })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl mx-auto p-4 text-white">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Modalidad</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as any)}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm font-semibold"
        >
          <option value="torneo">Torneo WA (Clasificación + Eliminatorias)</option>
          <option value="patrulla">Tirada de Patrulla / Practica</option>
          <option value="cruces">Encuentros 1v1 Directos</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Disciplina</label>
        <select
          value={disciplineId}
          onChange={(e) => setDisciplineId(e.target.value as DisciplineId)}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm font-semibold"
        >
          <option value="indoor_18m">Sala 18m (60 Flechas)</option>
          <option value="wa_720">WA 720 (72 Flechas)</option>
          <option value="3d">Recorrido 3D</option>
          <option value="campo">Campo</option>
        </select>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Arqueros ({archers.length}/16)
          </label>
          <button
            type="button"
            onClick={addArcher}
            disabled={archers.length >= 16}
            className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Agregar Arquero
          </button>
        </div>

        {archers.map((archer, idx) => (
          <div key={idx} className="flex gap-2 items-center rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <input
              type="text"
              placeholder={`Nombre Arquero ${idx + 1}`}
              value={archer.name}
              onChange={(e) => updateArcher(idx, 'name', e.target.value)}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-semibold text-white placeholder-zinc-500"
              required
            />
            <select
              value={archer.category}
              onChange={(e) => updateArcher(idx, 'category', e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-2 text-xs font-semibold text-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={archer.bowType}
              onChange={(e) => updateArcher(idx, 'bowType', e.target.value as BowType)}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-2 text-xs font-semibold text-white"
            >
              {BOW_TYPES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            {archers.length > 1 && (
              <button
                type="button"
                onClick={() => removeArcher(idx)}
                className="text-zinc-500 hover:text-red-400 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="mt-8 mb-20 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg hover:bg-emerald-500 transition-all active:scale-95"
      >
        <Trophy className="w-5 h-5" /> Comenzar Torneo
      </button>
    </form>
  )
}
