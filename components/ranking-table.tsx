'use client'

import React, { useEffect, useState } from 'react'
import { Trophy, Calendar } from 'lucide-react'
import { rankingService, RankingEntry } from '@/lib/rankingService'

interface RankingTableProps {
  tournament?: any
  onBack?: () => void
}

export function RankingTable({ onBack }: RankingTableProps) {
  const [rankings, setRankings] = useState<RankingEntry[]>([])

  useEffect(() => {
    const data = rankingService.getRanking()
    const sorted = [...data].sort((a, b) => b.score - a.score)
    setRankings(sorted)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a120c] text-white p-4 max-w-4xl mx-auto font-sans">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-emerald-900/50">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          <h1 className="text-lg font-black uppercase text-emerald-100">RANKING GENERAL</h1>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="text-xs bg-emerald-900/40 border border-emerald-700/50 px-3 py-1.5 rounded-lg text-emerald-300 cursor-pointer"
          >
            Volver
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#111c14] text-emerald-400 uppercase font-bold border-b border-emerald-900/40">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Arquero</th>
              <th className="p-3">Categoría / Arco</th>
              <th className="p-3 text-center">Fecha</th>
              <th className="p-3 text-right">Puntaje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/20">
            {rankings.map((item, idx) => (
              <tr key={item.id || idx} className="hover:bg-emerald-950/30">
                <td className="p-3 font-bold text-amber-400">{idx + 1}</td>
                <td className="p-3 font-semibold text-white">{item.archerName}</td>
                <td className="p-3 text-zinc-400">{item.category} · {item.bowType}</td>
                <td className="p-3 text-center text-zinc-400 flex items-center justify-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                  {item.date || 'Sin fecha'}
                </td>
                <td className="p-3 text-right font-black text-emerald-300">{item.score} pts</td>
              </tr>
            ))}
            {rankings.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-zinc-500">
                  No hay registros en el ranking todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
