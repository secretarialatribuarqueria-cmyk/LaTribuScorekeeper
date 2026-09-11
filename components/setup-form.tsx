'use client'

import React, { useState } from 'react'
import { Users, Swords, Target, Plus, Trash2, ArrowRight } from 'lucide-react'
import type { BowType, DisciplineId } from '@/lib/types'

interface SetupFormProps {
  onStart: (data: {
    format: 'patrulla' | 'cruces' | 'torneo'
    disciplineId: DisciplineId
    archers: Array<{ name: string; category: string; bowType: BowType }>
  }) => void
}

export function SetupForm({ onStart }: SetupFormProps) {
  const [format, setFormat] = useState<'patrulla' | 'cruces' | 'torneo'>('patrulla')
  const [disciplineId, setDisciplineId] = useState<DisciplineId>('indoor_18m')
  const [archers, setArchers] = useState<Array<{ name: string; category: string; bowType: BowType }>>([
    { name: '', category: 'Senior', bowType: 'Recurvo' },
  ])

  const addArcher = () => {
    if (archers.length < 4) {
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

    onStart({
      format,
      disciplineId,
      archers: validArchers,
    })
  }

  const hasName = archers.some((a) => a.name.trim() !== '')

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-[#0a120c] text-white p-4 pb-32 max-w-3xl mx-auto flex flex-col gap-6 font-sans">
      <div className="flex flex-col items-center gap-2 text-center pt-2">
        <div className="w-16 h-16 bg-white/10 rounded-xl p-2 flex items-center justify-center border border-emerald-900/50">
          <Target className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="text-xl font-black tracking-wider uppercase text-emerald-100">NUEVA SESIÓN</h1>
        <p className="text-xs text-emerald-400/70">Elige el formato de competición y registra a los arqueros.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" /> FORMATO
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormat('patrulla')}
            className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
              format === 'patrulla'
                ? 'bg-emerald-950/80 border-emerald-500 text-white'
                : 'bg-[#111c14] border-emerald-900/40 text-zinc-400'
            }`}
          >
            <Users className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase text-white">PATRULLA / ENTRENAMIENTO</div>
              <div className="text-[10px] text-zinc-400">Hasta 4 arqueros anotando en la misma diana.</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFormat('cruces')}
            className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
              format === 'cruces'
                ? 'bg-emerald-950/80 border-emerald-500 text-white'
                : 'bg-[#111c14] border-emerald-900/40 text-zinc-400'
            }`}
          >
            <Swords className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase text-white">CRUCES ELIMINATORIOS / FINALES</div>
              <div className="text-[10px] text-zinc-400">Enfrentamiento directo 1 vs 1 (Match Play).</div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" /> DISCIPLINA
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDisciplineId('indoor_18m')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              disciplineId === 'indoor_18m'
                ? 'bg-emerald-950/80 border-emerald-500 text-white'
                : 'bg-[#111c14] border-emerald-900/40 text-zinc-400'
            }`}
          >
            <div className="text-xs font-bold uppercase text-white">SALA / INDOOR</div>
            <div className="text-[10px] text-zinc-400">10 tandas · 3 flechas</div>
          </button>

          <button
            type="button"
            onClick={() => setDisciplineId('wa_720')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              disciplineId === 'wa_720'
                ? 'bg-emerald-950/80 border-emerald-500 text-white'
                : 'bg-[#111c14] border-emerald-900/40 text-zinc-400'
            }`}
          >
            <div className="text-xs font-bold uppercase text-white">AIRE LIBRE / OUTDOOR</div>
            <div className="text-[10px] text-zinc-400">12 tandas · 6 flechas</div>
          </button>

          <button
            type="button"
            onClick={() => setDisciplineId('campo')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              disciplineId === 'campo'
                ? 'bg-emerald-950/80 border-emerald-500 text-white'
                : 'bg-[#111c14] border-emerald-900/40 text-zinc-400'
            }`}
          >
            <div className="text-xs font-bold uppercase text-white">JUEGOS DE CAMPO / FIELD</div>
            <div className="text-[10px] text-zinc-400">24 dianas · 3 flechas</div>
          </button>

          <button
            type="button"
            onClick={() => setDisciplineId('3d')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              disciplineId === '3d'
                ? 'bg-emerald-950/80 border-emerald-500 text-white'
                : 'bg-[#111c14] border-emerald-900/40 text-zinc-400'
            }`}
          >
            <div className="text-xs font-bold uppercase text-white">3D</div>
            <div className="text-[10px] text-zinc-400">24 dianas · 1-2 flechas</div>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> ARQUEROS ({archers.length}/4)
          </label>
          <button
            type="button"
            onClick={addArcher}
            disabled={archers.length >= 4}
            className="flex items-center gap-1 text-xs font-bold bg-[#111c14] border border-emerald-900/50 text-white px-3 py-1 rounded-lg disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" /> Añadir
          </button>
        </div>

        {archers.map((archer, idx) => (
          <div key={idx} className="bg-[#111c14] border border-emerald-900/40 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Nombre del arquero"
                  value={archer.name}
                  onChange={(e) => updateArcher(idx, 'name', e.target.value)}
                  className="w-full bg-[#0a120c] border border-emerald-900/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              {archers.length > 1 && (
                <button type="button" onClick={() => removeArcher(idx)} className="text-zinc-500 hover:text-red-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">CATEGORÍA</label>
                <select
                  value={archer.category}
                  onChange={(e) => updateArcher(idx, 'category', e.target.value)}
                  className="w-full bg-[#0a120c] border border-emerald-900/60 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                >
                  {['Escuela', 'Juvenil', 'U12', 'U15', 'U18', 'U21', 'Senior', 'Master'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">TIPO DE ARCO</label>
                <select
                  value={archer.bowType}
                  onChange={(e) => updateArcher(idx, 'bowType', e.target.value as BowType)}
                  className="w-full bg-[#0a120c] border border-emerald-900/60 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                >
                  {['Recurvo', 'Compuesto', 'Raso', 'Tradicional', 'Longbow'].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={!hasName}
          className={`w-full py-4 px-4 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
            hasName
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95'
              : 'bg-emerald-950/60 text-emerald-600/70 border border-emerald-900/30 cursor-not-allowed'
          }`}
        >
          {hasName ? (
            <>
              INICIAR SESIÓN <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            'Ingresa el nombre de cada arquero'
          )}
        </button>
      </div>
    </form>
  )
}
