"use client";

import { SectorSummary } from "@/types";
import { formatCurrency } from "@/lib/utils/formatting";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PortfolioAllocationChartProps {
  sectorSummaries: SectorSummary[];
  totalInvestment: number;
}

const COLORS = [
  "#0ea5e9", // sky-500
  "#8b5cf6", // violet-500
  "#f59e0b", // amber-500
  "#10b981", // emerald-500
  "#f43f5e", // rose-500
  "#6366f1", // indigo-500
  "#ec4899", // pink-500
  "#14b8a6", // teal-500
  "#f97316", // orange-500
  "#84cc16", // lime-500
];

export function PortfolioAllocationChart({
  sectorSummaries,
  totalInvestment,
}: PortfolioAllocationChartProps) {
  // Prepare data for the pie chart
  const data = sectorSummaries
    .filter((s) => s.totalInvestment > 0)
    .map((s) => ({
      name: s.sector,
      value: s.totalInvestment,
      percentage: ((s.totalInvestment / totalInvestment) * 100).toFixed(2),
    }))
    .sort((a, b) => b.value - a.value); // Sort largest to smallest

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Portfolio Allocation</CardTitle>
        <CardDescription>Investment distribution by sector</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value) || 0)}
                  labelFormatter={(name) => `Sector: ${name}`}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
