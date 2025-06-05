"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDataForTimeframe } from "@/lib/golf-data";

const timeframeOptions = [
  { value: "5", label: "Last 5 rounds" },
  { value: "10", label: "Last 10 rounds" },
  { value: "30", label: "Last 30 rounds" },
  { value: "50", label: "Last 50 rounds" },
];

interface ChartCardProps {
  title: string;
  description: string;
  statistic: string;
  color: string;
  unit?: string;
}

function ChartCard({
  title,
  description,
  statistic,
  color,
  unit = "",
}: ChartCardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("10");

  const chartData = getDataForTimeframe(selectedTimeframe, statistic);

  const chartConfig = {
    value: {
      label: title,
      color: color,
    },
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
          <Select
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {timeframeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toString()}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(label) => `Date: ${label}`}
                  formatter={(value) => [`${value}${unit}`]}
                />
              }
            />
            <Area
              dataKey="value"
              type="natural"
              fill="var(--color-value)"
              fillOpacity={0.4}
              stroke="var(--color-value)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function InteractiveCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <ChartCard
        title="Scoring Average"
        description="Your average score per round over time"
        statistic="scoringAverage"
        color="hsl(var(--chart-1))"
      />
      <ChartCard
        title="Strokes Gained"
        description="Strokes gained vs professional players"
        statistic="strokesGained"
        color="hsl(var(--chart-2))"
      />
      <ChartCard
        title="Fairways Hit"
        description="Number of fairways hit per round"
        statistic="fairwaysHit"
        color="hsl(var(--chart-3))"
      />
      <ChartCard
        title="Greens in Regulation"
        description="Number of greens hit in regulation per round"
        statistic="greensInRegulation"
        color="hsl(var(--chart-4))"
      />
      <ChartCard
        title="Up & Down Percentage"
        description="Percentage of successful up and downs"
        statistic="upAndDownPercentage"
        color="hsl(var(--chart-5))"
        unit="%"
      />
      <ChartCard
        title="Putts per Round"
        description="Average number of putts per round"
        statistic="puttsPerRound"
        color="hsl(var(--chart-1))"
      />
    </div>
  );
}
