"use client";

import { SectorSummary } from "@/types";
import { formatCurrency } from "@/lib/utils/formatting";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SectorPerformanceChartProps {
  sectorSummaries: SectorSummary[];
}

export function SectorPerformanceChart({
  sectorSummaries,
}: SectorPerformanceChartProps) {
  // Prepare data for the bar chart
  const data = sectorSummaries
    .filter((s) => s.totalInvestment > 0)
    .map((s) => ({
      name: s.missingDataCount > 0 ? `${s.sector}*` : s.sector,
      Investment: s.totalInvestment,
      "Present Value": s.totalPresentValue !== null ? s.totalPresentValue : 0,
      isPartial: s.missingDataCount > 0,
    }))
    .sort((a, b) => b.Investment - a.Investment); // Sort by highest investment

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <BarChart3 className="h-8 w-8 text-muted-foreground" />
        <div>
          <CardTitle>Sector Performance</CardTitle>
          <CardDescription>Compare investment vs present value across sectors</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {data.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value) || 0)}
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar
                  dataKey="Investment"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="Present Value"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
      {data.some(d => d.isPartial) && (
        <div className="px-6 pb-4 text-xs text-muted-foreground">
          * Indicates sectors with partial Present Value due to missing market data.
        </div>
      )}
    </Card>
  );
}
