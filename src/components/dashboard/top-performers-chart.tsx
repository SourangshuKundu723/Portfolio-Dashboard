"use client";

import type { PortfolioSummary } from "@/types";
import { formatCurrency } from "@/lib/utils/formatting";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Trophy, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TopPerformersChart({ data }: { data: PortfolioSummary }) {
  // Filter holdings with valid gain/loss data
  const validHoldings = data.holdings.filter((h) => h.gainLoss !== null);

  // Get Top Gainers (Gain/Loss > 0), sorted descending
  const gainers = validHoldings
    .filter((h) => (h.gainLoss as number) > 0)
    .sort((a, b) => (b.gainLoss as number) - (a.gainLoss as number))
    .slice(0, 5);

  // Get Top Losers (Gain/Loss < 0), sorted ascending (worst losers first)
  const losers = validHoldings
    .filter((h) => (h.gainLoss as number) < 0)
    .sort((a, b) => (a.gainLoss as number) - (b.gainLoss as number))
    .slice(0, 5);

  const formattedGainers = gainers.map((h) => ({
    name: h.companyName,
    "Gain/Loss": h.gainLoss as number,
  }));

  const formattedLosers = losers.map((h) => ({
    name: h.companyName,
    "Gain/Loss": h.gainLoss as number,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      const isGain = val >= 0;
      return (
        <div className="rounded-lg border bg-background p-3 shadow-sm text-sm">
          <div className="font-semibold mb-1">{label}</div>
          <div className={`font-medium ${isGain ? "text-emerald-500" : "text-red-500"}`}>
            {isGain ? "+" : ""}{formatCurrency(val)}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = (chartData: any[], color: string, emptyMessage: string) => {
    if (chartData.length === 0) {
      return (
        <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
          {emptyMessage}
        </div>
      );
    }
    
    return (
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
            <XAxis 
              type="number" 
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
            <Bar
              dataKey="Gain/Loss"
              radius={[0, 4, 4, 0]}
              maxBarSize={24}
              fill={color}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Top Gainers Card */}
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center gap-4">
          <Trophy className="h-8 w-8 text-emerald-500 opacity-80" />
          <div>
            <CardTitle>Top Winners</CardTitle>
            <CardDescription>Highest gaining stocks</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-4 pt-2">
          {renderChart(formattedGainers, "#10b981", "No gaining stocks currently")}
        </CardContent>
      </Card>

      {/* Top Losers Card */}
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center gap-4">
          <TrendingDown className="h-8 w-8 text-red-500 opacity-80" />
          <div>
            <CardTitle>Top Losers</CardTitle>
            <CardDescription>Lowest performing stocks</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-4 pt-2">
          {renderChart(formattedLosers, "#ef4444", "No losing stocks currently")}
        </CardContent>
      </Card>
    </div>
  );
}
