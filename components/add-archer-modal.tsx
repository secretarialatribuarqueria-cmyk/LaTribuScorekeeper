'use client'

import { useState } from 'react'
import { UserPlus, X } from 'lucide-react'
import type { BowType } from '@/lib/types'

interface AddArcherModalProps {
  isOpen: boolean
  onClose: () => void
  onAddArcher: (archer: { name: string; category: string; bowType: BowType; targetNumber?: string }) => void
}

const BOW_TYPES: BowType[] = ['Longbow', 'Tradicional', 'Raso', 'Recurvo', 'Compuesto']

export function AddArcherModal({ isOpen, onClose, onAddArcher }: AddArcherModalProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Senior')
  const [bowType, setBowType] = useState<BowType>('Recurvo')
  const [targetNumber, setTargetNumber] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onAddArcher({
      name: name.trim(),
      category: category.trim(),
      bowType,
      targetNumber: targetNumber.trim() || undefined,
    })

    setName('')
    setTargetNumber('')
    onClose()
  }

  return (
    <div className="fixed inset-[0] z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="flex items-center gap-2 font-display text-base font-bold uppercase">
            <UserPlus className="size-5 text-primary-bright" /> Inscribir Arquero
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="rounded-xl border border-border bg-muted p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-bright"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Categoría
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ej. Senior / Escuela"
                className="rounded-xl border border-border bg-muted p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-bright"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Nº de Diana / Pila
              </label>
              <input
                type="text"
                value={targetNumber}
                onChange={(e) => setTargetNumber(e.target.value)}
                placeholder="Ej. 1A"
                className="rounded-xl border border-border bg-muted p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-bright"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tipo de Arco
            </label>
            <select
              value={bowType}
              onChange={(e) => setBowType(e.target.value as BowType)}
              className="rounded-xl border border-border bg-muted p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-bright"
            >
              {BOW_TYPES.map((type) => (
                <option key={type} value={type}>
                  Arco {type}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary-bright py-3 font-bold text-primary-foreground shadow-lg transition-all active:scale-95"
          >
            Guardar Arquero
          </button>
        </form>
      </div>
    </div>
  )
}
