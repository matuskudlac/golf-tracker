import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change = 0,
  changeLabel = "from previous rounds",
  className,
}: StatCardProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="px-4 py-0">
        <div className="flex flex-col space-y-1">
          <p className="text-s font-medium text-muted-foreground truncate">
            {title}
          </p>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold tracking-tight">{value}</h2>
            <div
              className={cn(
                "flex items-center text-xs font-medium",
                isPositive
                  ? "text-green-500"
                  : isNeutral
                  ? "text-muted-foreground"
                  : "text-red-500"
              )}
            >
              <span className="flex items-center mr-1">
                {isPositive ? (
                  <ArrowUp className="h-3 w-3" />
                ) : isNeutral ? (
                  <Minus className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
              </span>
              <span>
                {isPositive ? "+" : ""}
                {change}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {changeLabel}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
