'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface PerformanceChartProps {
  data: Array<{
    date: string
    score?: number
    fairways?: number
    gir?: number
    putts?: number
  }>
}

const timeframes = [
  { value: '5', label: 'Last 5' },
  { value: '10', label: 'Last 10' },
  { value: '30', label: 'Last 30' },
  { value: '50', label: 'Last 50' },
]

export function PerformanceChart({ data }: PerformanceChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('10')
  
  // Filter data based on timeframe
  const filteredData = data.slice(-parseInt(selectedTimeframe))
  
  // Stat config for the custom legend
  const [visibleStats, setVisibleStats] = useState({
    score: true,
    fairways: true,
    gir: true,
    putts: true
  })

  const toggleStat = (key: keyof typeof visibleStats) => {
    setVisibleStats(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const statConfig = [
    { key: 'score', label: 'Score', color: 'var(--stat-score)' },
    { key: 'fairways', label: 'Fairways', color: 'var(--stat-fairways)' },
    { key: 'gir', label: 'GIR', color: 'var(--stat-gir)' },
    { key: 'putts', label: 'Putts', color: 'var(--stat-putts)' },
  ] as const
  
  return (
    <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Performance</h3>
          <p className="text-sm text-muted-foreground">Trends over time</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Custom Sleek Legend */}
          <div className="flex items-center gap-3 mr-2">
            {statConfig.map((stat) => (
              <button
                key={stat.key}
                onClick={() => toggleStat(stat.key)}
                className={`flex items-center gap-1.5 text-xs transition-all duration-200 ${
                  visibleStats[stat.key as keyof typeof visibleStats] 
                    ? 'opacity-100' 
                    : 'opacity-40 grayscale hover:opacity-60'
                }`}
              >
                <span 
                  className="w-2.5 h-2.5 rounded-[2px]" 
                  style={{ backgroundColor: stat.color }}
                />
                <span className="text-foreground">{stat.label}</span>
              </button>
            ))}
          </div>

          {/* Shadcn Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground hover:border-brand-700/50 transition-colors focus:outline-none">
              {timeframes.find(t => t.value === selectedTimeframe)?.label}
              <ChevronDown className="w-4 h-4 text-brand-700" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[140px]">
              {timeframes.map((tf) => (
                <DropdownMenuCheckboxItem
                  key={tf.value}
                  checked={selectedTimeframe === tf.value}
                  onCheckedChange={() => setSelectedTimeframe(tf.value)}
                  className="cursor-pointer"
                >
                  {tf.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Chart */}
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={filteredData} 
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                borderColor: 'var(--color-border)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                color: 'var(--color-popover-foreground)',
              }}
              itemStyle={{ color: 'var(--color-popover-foreground)' }}
            />
            
            {/* Score - Premium Green */}
            {visibleStats.score && (
              <Line 
                type="monotone" 
                dataKey="score" 
                name="Score"
                stroke="var(--stat-score)" 
                strokeWidth={3}
                dot={{ r: 4, fill: 'var(--stat-score)', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                animationDuration={300}
              />
            )}
            
            {/* Fairways - Earthy Gold/Bronze */}
            {visibleStats.fairways && (
              <Line 
                type="monotone" 
                dataKey="fairways" 
                name="Fairways %"
                stroke="var(--stat-fairways)" 
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
                animationDuration={300}
              />
            )}
            
            {/* GIR - Deep Blue */}
            {visibleStats.gir && (
              <Line 
                type="monotone" 
                dataKey="gir" 
                name="GIR %"
                stroke="var(--stat-gir)" 
                strokeWidth={2}
                dot={false}
                animationDuration={300}
              />
            )}
            
            {/* Putts - Terracotta/Rose */}
            {visibleStats.putts && (
              <Line 
                type="monotone" 
                dataKey="putts" 
                name="Putts"
                stroke="var(--stat-putts)" 
                strokeWidth={2}
                dot={false}
                animationDuration={300}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
