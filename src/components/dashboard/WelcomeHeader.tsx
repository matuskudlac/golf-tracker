'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface WelcomeHeaderProps {
  userName: string
  roundsThisYear: number
  onLogRound: () => void
}

export function WelcomeHeader({ userName, roundsThisYear, onLogRound }: WelcomeHeaderProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Welcome back, {userName}!
          </h1>
          <p className="text-md text-slate-600">
            You've played {roundsThisYear} {roundsThisYear === 1 ? 'round' : 'rounds'} this year
          </p>
        </div>
        <Button 
          onClick={onLogRound}
          className="bg-brand-700 hover:bg-brand-800 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Log Round
        </Button>
      </div>
    </div>
  )
}
