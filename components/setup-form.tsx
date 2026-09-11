'use client'

import React, { useState } from 'react'
import { Users, Swords, Target, Sun, Trees, Footprints, Plus, Trash2, ArrowRight } from 'lucide-react'

interface SetupFormProps {
  onStart: (data: any) => void
}

export function SetupForm({ onStart }: SetupFormProps) {
  const [format, setFormat] = useState('patrulla')
  const [disciplineId, setDisciplineId] = useState('indoor_18m')
  const [archers, setArchers] = useState([
    { name: '', category: 'Senior', bowType: 'Recurvo Olímpico' },
  ])

  const addArcher = () => {
    if (archers.length < 4) {
      setArchers([...archers, { name: '', category: 'Senior', bowType: 'Recurvo Olímpico' }])
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

  const isValid = archers.every((a) => a.name.trim() !== '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onStart({ format, disciplineId, archers })
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-[#0a120c] text-white p-4 pb-28 max-w-3xl mx-auto flex flex-col gap-6 font-sans">
      {/* Header Logo */}
      <div className="flex flex-col items-center gap-2 text-center pt-2">
        <div className="w-16 h-16 bg-white rounded-xl p-2 flex items-center justify-center">
          <img src="/logo.png" alt="La Tribu" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none' }} />
        </div>
        <h1 className="text-xl font-black tracking-wider uppercase text-emerald-100">NUEVA SESIÓN</h1>
        <p className="text-xs text-emerald-400/70">Elige el formato de competición y registra a los arqueros.</p>
      </div>

      {/* Formato */}
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
                : 'bg-[#111c14] border-emerald-900/40 text-zinc-400 hover:border-emerald-800'
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
                : 'bg-[#111c14] border-emerald-900/40 text-zinc-400 hover:border-emerald-800'
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

      {/* Disciplina */}
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

      {/* Arqueros */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> ARQUEROS ({archers.length}/4)
          </label>
          <button
            type="button"
            onClick={addArcher}
            disabled={archers.length >= 4}
            className="flex items-center gap-1 text-xs font-bold bg-[#111c14] border border-emerald-900/50 text-white px-3 py-1 rounded-lg hover:bg-emerald-900/40 disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" /> Añadir
          </button>
        </div>

        {archers.map((archer, idx) => (
          <div key={idx} className="bg-[#111c14] border border-emerald-900/40 rounded-xl p-4 flex flex-col gap-3 relative">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center">
                {idx + 1}
              </span>
              <div className="flex-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">NOMBRE</label>
                <input
                  type="text"
                  placeholder="Nombre del arquero"
                  value={archer.name}
                  onChange={(e) => updateArcher(idx, 'name', e.target.value)}
                  className="w-full bg-[#0a120c] border border-emerald-900/60 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
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
                  onChange={(e) => updateArcher(idx, 'bowType', e.target.value)}
                  className="w-full bg-[#0a120c] border border-emerald-900/60 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                >
                  {['Recurvo Olímpico', 'Compuesto', 'Raso', 'Tradicional', 'Longbow'].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón inferior flotante/fijo sin tapar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a120c]/90 backdrop-blur-md border-t border-emerald-900/40 z-50">
        <div className="max-w-3xl mx-auto">
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3.5 px-4 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
              isValid
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                : 'bg-emerald-950/60 text-emerald-600/70 cursor-not-allowed border border-emerald-900/30'
            }`}
          >
            {isValid ? (
              <>
                INICIAR SESIÓN <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              'Ingresa el nombre de cada arquero'
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
