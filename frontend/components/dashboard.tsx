import { StatCard } from "./stat-card";

export function Dashboard() {
  return (
    <div className="p-6 pr-2 sm:pr-8 md:pr-16 lg:pr-24 xl:pr-32 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-baseline">
        <StatCard title="Scoring Average" value="72.68" change={0.22} />
        <StatCard title="Fairways Hit" value="12.24" change={0.26} />
        <StatCard title="Greens in Regulation" value="14.24" change={0.48} />
        <StatCard title="Up and Down" value="64%" change={2.1} />
        <StatCard title="Putts per Round" value="32.1" change={0.2} />
        <StatCard
          title="Strokes Gained vs Pro"
          value="-3.6"
          change={0.8}
          changeLabel="strokes gained this month"
        />
      </div>
    </div>
  );
}
