'use client'

import { useState } from 'react'

interface Point {
  x: number
  y: number
  score: number | string
}

interface InteractiveTargetProps {
  onScoreSelect?: (score: number | string, x: number, y: number) => void
  shots?: Point[]
}

export function InteractiveTarget({ onScoreSelect, shots = [] }: InteractiveTargetProps) {
  const [currentShots, setCurrentShots] = useState<Point[]>(shots)

  // Manejar el toque/clic en la diana
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const radius = Math.sqrt(x * x + y * y)
    
    // Normalizar radio a escala 0 - 100
    const normRadius = (radius / (rect.width / 2)) * 100

    // Calcular puntaje según la distancia al centro
    let score: number | string = 0
    if (normRadius <= 5) score = 'X'
    else if (normRadius <= 10) score = 10
    else if (normRadius <= 20) score = 9
    else if (normRadius <= 30) score = 8
    else if (normRadius <= 40) score = 7
    else if (normRadius <= 50) score = 6
    else if (normRadius <= 60) score = 5
    else if (normRadius <= 70) score = 4
    else if (normRadius <= 80) score = 3
    else if (normRadius <= 90) score = 2
    else if (normRadius <= 100) score = 1
    else score = 'M' // Miss / Cero

    const newPoint = { x, y, score }
    setCurrentShots((prev) => [...prev, newPoint])
    if (onScoreSelect) onScoreSelect(score, x, y)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative size-72 sm:size-80">
        <svg
          viewBox="-100 -100 200 200"
          className="size-full cursor-pointer touch-none rounded-full shadow-lg"
          onClick={handleClick}
        >
          {/* Anillos de la Diana (Indoor/Outdoor FITA) */}
          <circle cx="0" cy="0" r="100" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
          <circle cx="0" cy="0" r="90" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
          <circle cx="0" cy="0" r="80" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
          <circle cx="0" cy="0" r="70" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
          <circle cx="0" cy="0" r="60" fill="#38bdf8" stroke="#1e293b" strokeWidth="1" />
          <circle cx="0" cy="0" r="50" fill="#38bdf8" stroke="#1e293b" strokeWidth="1" />
          <circle cx="0" cy="0" r="40" fill="#ef4444" stroke="#1e293b" strokeWidth="1" />
          <circle cx="0" cy="0" r="30" fill="#ef4444" stroke="#1e293b" strokeWidth="1" />
          <circle cx="0" cy="0" r="20" fill="#facc15" stroke="#1e293b" strokeWidth="1" />
          <circle cx="0" cy="0" r="10" fill="#facc15" stroke="#1e293b" strokeWidth="1" />
          {/* Anillo X */}
          <circle cx="0" cy="0" r="5" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="1 1" />
          <path d="M -2 0 L 2 0 M 0 -2 L 0 2" stroke="#1e293b" strokeWidth="0.8" />

          {/* Marcadores de Flechas Impactadas */}
          {currentShots.map((shot, idx) => (
            <g key={idx}>
              <circle
                cx={shot.x}
                cy={shot.y}
                r="3.5"
                fill="#22c55e"
                stroke="#ffffff"
                strokeWidth="1"
              />
              <text
                x={shot.x}
                y={shot.y - 5}
                fontSize="6"
                fontWeight="bold"
                fill="#ffffff"
                textAnchor="middle"
                className="drop-shadow-md select-none"
              >
                {shot.score}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <button
        type="button"
        onClick={() => setCurrentShots([])}
        className="text-xs text-muted-foreground hover:text-destructive underline"
      >
        Limpiar impactos
      </button>
    </div>
  )
}
