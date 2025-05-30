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

// Mock data for different statistics and time periods
const generateMockData = (statistic: string, timeframe: string) => {
  const getDataPoints = () => {
    switch (timeframe) {
      case "7d":
        return 7;
      case "30d":
        return 30;
      case "90d":
        return 90;
      case "1y":
        return 12;
      default:
        return 30;
    }
  };

  const dataPoints = getDataPoints();
  const data = [];

  for (let i = 0; i < dataPoints; i++) {
    let value: number;
    let date: string;

    // Generate realistic values based on statistic type
    switch (statistic) {
      case "scoring":
        value = Math.round(70 + Math.random() * 10 + Math.sin(i * 0.3) * 3);
        break;
      case "fairways":
        value = Math.round(8 + Math.random() * 4 + Math.sin(i * 0.2) * 2);
        break;
      case "gir":
        value = Math.round(10 + Math.random() * 8 + Math.sin(i * 0.25) * 2);
        break;
      case "updown":
        value = 50 + Math.random() * 30 + Math.sin(i * 0.15) * 10;
        break;
      case "putts":
        value = Math.round(26 + Math.random() * 6 + Math.sin(i * 0.35) * 2);
        break;
      case "strokes":
        value = -3 + Math.random() * 2 + Math.sin(i * 0.4) * 2;
        break;
      default:
        value = Math.random() * 100;
    }

    // Generate date labels based on timeframe
    if (timeframe === "1y") {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      date = monthNames[i];
    } else {
      const daysAgo = dataPoints - i - 1;
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() - daysAgo);
      if (timeframe === "7d") {
        date = dateObj.toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
        });
      } else {
        date = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    }

    data.push({
      date,
      value: Math.round(value * 100) / 100,
    });
  }

  return data;
};

const timeframeOptions = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last year" },
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
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");

  const chartData = generateMockData(statistic, selectedTimeframe);

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
        statistic="scoring"
        color="hsl(var(--chart-1))"
      />
      <ChartCard
        title="Strokes Gained"
        description="Strokes gained vs professional players"
        statistic="strokes"
        color="hsl(var(--chart-2))"
      />
      <ChartCard
        title="Fairways Hit"
        description="Number of fairways hit per round"
        statistic="fairways"
        color="hsl(var(--chart-3))"
      />
      <ChartCard
        title="Greens in Regulation"
        description="Number of greens hit in regulation per round"
        statistic="gir"
        color="hsl(var(--chart-4))"
      />
      <ChartCard
        title="Up & Down Percentage"
        description="Percentage of successful up and downs"
        statistic="updown"
        color="hsl(var(--chart-5))"
        unit="%"
      />
      <ChartCard
        title="Putts per Round"
        description="Average number of putts per round"
        statistic="putts"
        color="hsl(var(--chart-1))"
      />
    </div>
  );
}
