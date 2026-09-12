'use client'

import React, { useState } from 'react'
import { Trophy, Play } from 'lucide-react'

interface SetupFormProps {
  onStart: (data: any) => void
  onViewRanking: () => void
}

export function SetupForm({ onStart, onViewRanking }: SetupFormProps) {
  const [archerName, setArcherName] = useState('')
  const [category, setCategory] = useState('Senior')
  const [bowType, setBowType] = useState('Raso')
  const [disciplineId, setDisciplineId] = useState('3d')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!archerName.trim()) {
      alert('Por favor ingresa el nombre del arquero')
      return
    }

    onStart({
      archerName: archerName.trim(),
      category,
      bowType,
      disciplineId,
      date: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    })
  }

  return (
    <div className="min-h-screen bg-[#0a120c] text-white p-4 max-w-md mx-auto flex flex-col justify-center font-sans">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-emerald-400 tracking-wider">LA TRIBU</h1>
        <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest">Scorekeeper · Tiro con Arco</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-[#111c14] p-6 rounded-2xl border border-emerald-900/40 shadow-xl">
        <div>
          <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Nombre del Arquero</label>
          <input
            type="text"
            value={archerName}
            onChange={(e) => setArcherName(e.target.value)}
            placeholder="Ej: Juan Pérez"
            className="w-full bg-[#0a120c] border border-emerald-800/60 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Modalidad / Disciplina</label>
          <select
            value={disciplineId}
            onChange={(e) => setDisciplineId(e.target.value)}
            className="w-full bg-[#0a120c] border border-emerald-800/60 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="3d">Tiro 3D</option>
            <option value="field">Tiro de Campo (Field)</option>
            <option value="target">Tiro de Sala / Target</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Tipo de Arco</label>
            <select
              value={bowType}
              onChange={(e) => setBowType(e.target.value)}
              className="w-full bg-[#0a120c] border border-emerald-800/60 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Raso">Raso</option>
              <option value="Recurvo">Recurvo</option>
              <option value="Compuesto">Compuesto</option>
              <option value="Longbow">Longbow</option>
              <option value="Tradicional">Tradicional</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0a120c] border border-emerald-800/60 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Escuela">Escuela</option>
              <option value="Cazador">Cazador</option>
              <option value="Senior">Senior</option>
              <option value="Master">Master</option>
              <option value="Junior">Junior</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-950"
        >
          <Play className="w-4 h-4 fill-current" />
          COMENZAR A ANOTAR
        </button>

        <button
          type="button"
          onClick={onViewRanking}
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/30 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer mt-2"
        >
          <Trophy className="w-4 h-4" />
          VER RANKING GENERAL
        </button>
      </form>
    </div>
  )
}
