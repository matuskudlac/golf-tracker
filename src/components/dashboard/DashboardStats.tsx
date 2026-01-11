import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts'

interface DashboardStatsProps {
  scoringAverage: number
  trend: number // positive or negative change
  chartData: Array<{ value: number }>
}

export function DashboardStats({ scoringAverage, trend, chartData }: DashboardStatsProps) {
  const isImproving = trend < 0 // Lower scores are better in golf
  
  // Calculate min/max for better scale visualization
  const values = chartData.map(d => d.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  // Add some padding to the range for better visualization
  const padding = (maxValue - minValue) * 0.2 || 5
  // Type coercion to prevent NaN if calc fails, though padding fallback handles most cases
  const yMin = Math.floor(minValue - padding)
  const yMax = Math.ceil(maxValue + padding)
  
  return (
    <div className="p-4 bg-card rounded-xl border border-border shadow-sm">
      {/* Header */}
      <p className="text-sm font-medium text-muted-foreground mb-3">Scoring Average</p>
      
      {/* Big Number - Left aligned */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-3xl font-bold text-foreground">
          {scoringAverage.toFixed(1)}
        </h2>
        <div className={`px-2 py-0.5 rounded text-xs font-medium ${
          isImproving 
            ? 'bg-accent-50 text-brand-700 dark:bg-accent-950 dark:text-accent-300' 
            : 'bg-negative-50 text-negative-600 dark:bg-negative-950 dark:text-negative-400'
        }`}>
          {isImproving ? '↓' : '↑'} {Math.abs(trend).toFixed(1)}
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="sparkColorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--stat-score)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--stat-score)" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <YAxis domain={[yMin, yMax]} hide />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="var(--stat-score)" 
              strokeWidth={2}
              fill="url(#sparkColorValue)" 
              animationDuration={800}
            />
        </AreaChart>
        </ResponsiveContainer>
        {/* <p className="text-xs text-muted-foreground mt-2">Last 10 rounds</p> */}
      </div>
    </div>
  )
}
