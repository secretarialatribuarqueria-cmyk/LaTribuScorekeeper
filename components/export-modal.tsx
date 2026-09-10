'use client'

import { useRef, useState } from 'react'
import { Download, Share2, FileText, Image as ImageIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DISCIPLINES } from '@/lib/disciplines'
import { computeStats, endTotal } from '@/lib/scoring'
import type { Archer, DisciplineId } from '@/lib/types'

interface ExportModalProps {
  archer: Archer
  disciplineId: DisciplineId
  isOpen: boolean
  onClose: () => void
}

export function ExportModal({ archer, disciplineId, isOpen, onClose }: ExportModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const config = DISCIPLINES[disciplineId]
  const stats = computeStats(config, archer)

  if (!isOpen) return null

  // 1. Descargar Tarjeta en Formato Imagen (PNG) usando Canvas nativo
  const exportAsImage = async () => {
    if (!cardRef.current) return
    setIsGenerating(true)

    try {
      const element = cardRef.current
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      const width = element.offsetWidth * 2 // Escala HD
      const height = element.offsetHeight * 2
      canvas.width = width
      canvas.height = height

      if (ctx) {
        ctx.scale(2, 2)
        // Fondo oscuro estilizado
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, 0, width, height)

        // Dibujar borde dorado
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 3
        ctx.strokeRect(10, 10, width / 2 - 20, height / 2 - 20)

        // Textos principales
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 20px sans-serif'
        ctx.fillText('LA TRIBU ARQUERÍA', 24, 45)

        ctx.font = '14px sans-serif'
        ctx.fillStyle = '#94a3b8'
        ctx.fillText(`${archer.name.toUpperCase()}`, 24, 70)
        ctx.fillText(`${archer.category || 'General'} · ${archer.bowType}`, 24, 90)

        // Puntajes
        ctx.font = 'bold 36px sans-serif'
        ctx.fillStyle = '#f59e0b'
        ctx.fillText(`${stats.total} PTS`, 24, 140)

        ctx.font = '12px sans-serif'
        ctx.fillStyle = '#cbd5e1'
        ctx.fillText(`Promedio: ${stats.average.toFixed(2)} / flecha`, 24, 165)
        ctx.fillText(`Total 10s + Xs: ${stats.countX + stats.count10}`, 24, 185)

        // Convertir a descarga
        const image = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = image
        link.download = `Tarjeta_${archer.name.replace(/\s+/g, '_')}.png`
        link.click()
      }
    } catch (err) {
      console.error('Error generando imagen:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  // 2. Exportar / Imprimir Planilla Oficial en PDF (Apertura de diálogo de impresión optimizado)
  const exportAsPDF = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const endsRows = archer.ends
      .map((end, idx) => {
        const total = endTotal(config, end)
        return `
        <tr>
          <td style="padding:6px;border:1px solid #ccc;text-align:center;"><b>Tanda ${idx + 1}</b></td>
          ${end.map((arrow) => `<td style="padding:6px;border:1px solid #ccc;text-align:center;">${arrow || '-'}</td>`).join('')}
          <td style="padding:6px;border:1px solid #ccc;text-align:center;font-weight:bold;">${total}</td>
        </tr>
      `
      })
      .join('')

    printWindow.document.write(`
      <html>
        <head>
          <title>Planilla Oficial - ${archer.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
            h1 { font-size: 20px; margin-bottom: 5px; text-transform: uppercase; }
            .header { margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { background-color: #f2f2f2; padding: 8px; border: 1px solid #ccc; font-size: 12px; }
            .footer { margin-top: 30px; display: flex; justify-content: space-between; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LA TRIBU ARQUERÍA - PLANILLA OFICIAL</h1>
            <p><b>Arquero:</b> ${archer.name} | <b>Categoría:</b> ${archer.category || 'General'} | <b>Arco:</b> ${archer.bowType}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Tanda</th>
                <th colspan="${config.arrowsPerEnd}">Flechas</th>
                <th>Total Tanda</th>
              </tr>
            </thead>
            <tbody>
              ${endsRows}
            </tbody>
          </table>
          <div class="footer">
            <p><b>TOTAL GENERAL:</b> ${stats.total} Puntos</p>
            <p><b>Promedio:</b> ${stats.average.toFixed(2)} pts/flecha</p>
            <p><b>Firma Arquero:</b> _______________</p>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </button>

        <h3 className="mb-4 font-display text-lg font-bold uppercase tracking-wide">
          Exportar Resultados
        </h3>

        {/* Vista previa de la tarjeta para redes */}
        <div
          ref={cardRef}
          className="mb-6 rounded-xl border border-amber-500/40 bg-slate-900 p-5 text-white shadow-inner"
        >
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                La Tribu Arquería
              </span>
              <h4 className="font-display text-base font-bold uppercase">{archer.name}</h4>
            </div>
            <span className="text-xs text-slate-400">{archer.bowType}</span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase text-slate-400">Puntaje Final</span>
              <p className="font-display text-3xl font-black text-amber-400">{stats.total} PTS</p>
            </div>
            <div className="text-right text-xs text-slate-300">
              <p>Prom: <strong className="text-white">{stats.average.toFixed(2)}</strong></p>
              <p>10s/Xs: <strong className="text-white">{stats.countX + stats.count10}</strong></p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            onClick={exportAsImage}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 bg-amber-500 text-black hover:bg-amber-400"
          >
            <ImageIcon className="size-4" />
            Descargar Tarjeta (Imagen PNG)
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={exportAsPDF}
            className="flex items-center justify-center gap-2"
          >
            <FileText className="size-4" />
            Imprimir / Guardar PDF Oficial
          </Button>
        </div>
      </div>
    </div>
  )
}
