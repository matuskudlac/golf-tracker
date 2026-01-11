'use client'

import { Plus } from 'lucide-react'

interface Round {
  id: string
  date: string
  courseName: string
  score: number
  par: number
}

interface RecentRoundsListProps {
  rounds: Round[]
  onLogNewRound: () => void
}

export function RecentRoundsList({ rounds, onLogNewRound }: RecentRoundsListProps) {
  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Header */}
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Rounds</h3>
      
      {/* Rounds List */}
      <div className="space-y-3">
        {rounds.map((round) => {
          const vsPar = round.score - round.par
          const vsParText = vsPar > 0 ? `+${vsPar}` : vsPar === 0 ? 'E' : `${vsPar}`
          const vsParColor = vsPar > 0 ? 'text-negative-600' : vsPar === 0 ? 'text-slate-600' : 'text-brand-700'
          
          return (
            <div
              key={round.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <p className="font-medium text-slate-900">{round.courseName}</p>
                <p className="text-sm text-slate-500">{round.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{round.score}</p>
                  <p className={`text-sm font-medium ${vsParColor}`}>{vsParText}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Log New Round Button */}
      <button
        onClick={onLogNewRound}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-700 hover:bg-brand-900 text-white font-medium rounded-lg transition-colors"
      >
        <Plus className="h-5 w-5" />
        Log New Round
      </button>
    </div>
  )
}
