'use client'

import type { Archer } from '@/lib/types'
import { calculateTotalScore, calculateXs, calculateTens } from '@/lib/scoring'

interface RankingTableProps {
  archers: Archer[]
}

export function RankingTable({ archers }: RankingTableProps) {
  const ranked = [...archers].sort((a, b) => {
    const totalA = calculateTotalScore(a)
    const totalB = calculateTotalScore(b)
    if (totalB !== totalA) return totalB - totalA

    const xsA = calculateXs(a)
    const xsB = calculateXs(b)
    if (xsB !== xsA) return xsB - xsA

    const tensA = calculateTens(a)
    const tensB = calculateTens(b)
    return tensB - tensA
  })

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm">
      <table className="w-full text-left text-xs text-zinc-300">
        <thead className="border-b border-zinc-800 uppercase text-zinc-500 font-bold">
          <tr>
            <th className="py-2 px-3">#</th>
            <th className="py-2 px-3">Arquero</th>
            <th className="py-2 px-3">Categoría</th>
            <th className="py-2 px-3">Arco</th>
            <th className="py-2 px-3 text-center">10s</th>
            <th className="py-2 px-3 text-center">Xs</th>
            <th className="py-2 px-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {ranked.map((archer, idx) => (
            <tr key={archer.id} className="hover:bg-zinc-800/30">
              <td className="py-2.5 px-3 font-bold text-emerald-400">{idx + 1}</td>
              <td className="py-2.5 px-3 font-semibold text-white">{archer.name}</td>
              <td className="py-2.5 px-3 text-zinc-400">{archer.category}</td>
              <td className="py-2.5 px-3 text-zinc-400">{archer.bowType}</td>
              <td className="py-2.5 px-3 text-center font-mono">{calculateTens(archer)}</td>
              <td className="py-2.5 px-3 text-center font-mono">{calculateXs(archer)}</td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400 text-sm">
                {calculateTotalScore(archer)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
