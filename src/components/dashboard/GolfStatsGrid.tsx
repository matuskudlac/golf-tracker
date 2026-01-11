'use client'

interface StatCardProps {
  label: string
  value: string
  trend: number
  suffix?: string
  lowerIsBetter?: boolean // For stats like putts where lower is better
}

function StatCard({ label, value, trend, suffix = '%', lowerIsBetter = false }: StatCardProps) {
  // Arrow direction shows actual trend (up/down)
  const isIncreasing = trend > 0
  
  // Color shows if it's good or bad
  // For most stats (FIRs, GIRs, Up&Downs), positive trend is good
  // For putts, negative trend (fewer putts) is good
  const isGood = lowerIsBetter ? trend < 0 : trend > 0
  
  return (
    <div className="p-3 bg-card rounded-lg border border-border shadow-sm">
      <div className="flex items-baseline justify-between">
        <span className="text-s text-muted-foreground">{label}</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-foreground">{value}</span>
          <span className="text-s text-muted-foreground">{suffix}</span>
          <div className={`flex items-center gap-0.5 text-xs font-medium ${
            isGood 
              ? 'text-brand-700 dark:text-brand-400' 
              : 'text-negative-600 dark:text-negative-400'
          }`}>
            <span>{isIncreasing ? '↑' : '↓'}</span>
            <span>{Math.abs(trend).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface GolfStatsGridProps {
  fairwaysHit: number
  fairwaysTrend: number
  greensInReg: number
  girTrend: number
  puttsPerRound: number
  puttsTrend: number
  upAndDowns: number
  upAndDownsTrend: number
}

export function GolfStatsGrid({
  fairwaysHit,
  fairwaysTrend,
  greensInReg,
  girTrend,
  puttsPerRound,
  puttsTrend,
  upAndDowns,
  upAndDownsTrend,
}: GolfStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <StatCard
        label="FIRs"
        value={fairwaysHit.toFixed(0)}
        trend={fairwaysTrend}
        suffix="%"
      />
      <StatCard
        label="GIRs"
        value={greensInReg.toFixed(0)}
        trend={girTrend}
        suffix="%"
      />
      <StatCard
        label="Putts"
        value={puttsPerRound.toFixed(1)}
        trend={puttsTrend}
        suffix=""
        lowerIsBetter={true}
      />
      <StatCard
        label="Up&Downs"
        value={upAndDowns.toFixed(0)}
        trend={upAndDownsTrend}
        suffix="%"
      />
    </div>
  )
}
