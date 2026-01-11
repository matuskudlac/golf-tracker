'use client'

import { Progress } from '@/components/ui/progress'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface HeroStatsCardProps {
  scoringAverage: number
  trend: number
  handicap: number
  handicapTrend: number
  fairwaysHit: number
  greensInReg: number
  puttsPerRound: number
  scrambling: number
}

export function HeroStatsCard({
  scoringAverage,
  trend,
  handicap,
  handicapTrend,
  fairwaysHit,
  greensInReg,
  puttsPerRound,
  scrambling,
}: HeroStatsCardProps) {
  const isImproving = trend < 0 // Lower scores are better in golf
  const isHandicapImproving = handicapTrend < 0 // Lower handicap is better
  
  // Convert putts to a percentage (assuming 36 putts = 0%, 27 putts = 100%)
  const puttsPercentage = Math.max(0, Math.min(100, ((36 - puttsPerRound) / 9) * 100))
  
  const stats = [
    { label: 'Fairways Hit', value: fairwaysHit, unit: '%' },
    { label: 'Greens in Regulation', value: greensInReg, unit: '%' },
    { label: 'Scrambling', value: scrambling, unit: '%' },
    { label: 'Putts per Round', value: puttsPerRound, unit: '', percentage: puttsPercentage },
  ]
  
  return (
    <div className="p-4 bg-brand-700 rounded-xl shadow-lg">
      {/* Hero Metrics - Two Column Layout */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-white/20">
        {/* Scoring Average */}
        <div>
          <p className="text-xs font-medium text-slate-200 mb-1">Scoring Average</p>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-white">
              {scoringAverage.toFixed(1)}
            </h2>
            <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${
              isImproving 
                ? 'bg-white/20 text-white' 
                : 'bg-red-500/20 text-red-200'
            }`}>
              <span>{isImproving ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}</span>
              <span>{Math.abs(trend).toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        {/* Handicap Index */}
        <div>
          <p className="text-xs font-medium text-slate-200 mb-1">Handicap Index</p>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-white">
              {handicap.toFixed(1)}
            </h2>
            <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${
              isHandicapImproving 
                ? 'bg-white/20 text-white' 
                : 'bg-red-500/20 text-red-200'
            }`}>
              <span>{isHandicapImproving ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}</span>
              <span>{Math.abs(handicapTrend).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Bars */}
      <div className="space-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-200">{stat.label}</span>
              <span className="font-semibold text-white">
                {stat.value.toFixed(stat.unit === '%' ? 0 : 1)}{stat.unit}
              </span>
            </div>
            <Progress 
              value={stat.percentage ?? stat.value} 
              className="h-1.5 bg-white/20"
              style={{
                ['--progress-background' as string]: 'rgba(255, 255, 255, 0.9)',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
