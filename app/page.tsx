'use client'

import React, { useState } from 'react'
import { SetupForm } from '@/components/setup-form'
import { ScoringScreen } from '@/components/scoring-screen'

export default function Page() {
  const [session, setSession] = useState<any>(null)

  const handleStart = (data: any) => {
    setSession(data)
  }

  const handleReset = () => {
    setSession(null)
  }

  if (!session) {
    return <SetupForm onStart={handleStart} />
  }

  return (
    <main className="min-h-screen bg-[#0a120c] text-white">
      <ScoringScreen 
        session={session} 
        onReset={handleReset} 
        {...session} 
      />
    </main>
  )
}
