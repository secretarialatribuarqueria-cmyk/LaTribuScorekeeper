'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/app-header'
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

  return (
    <main className="min-h-screen bg-[#0a120c]">
      {!session ? (
        <SetupForm onStart={handleStart} />
      ) : (
        <div className="p-4 text-white">
          <AppHeader onReset={handleReset} />
          <ScoringScreen session={session} onReset={handleReset} />
        </div>
      )}
    </main>
  )
}
