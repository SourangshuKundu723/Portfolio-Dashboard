"use client";

import React, { useState, useEffect } from "react";
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

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPartial = data.isPartial;
    const star = isPartial ? <span className="text-red-500">*</span> : null;

    return (
      <div className="rounded-lg border bg-background p-3 shadow-sm text-sm min-w-[200px]">
        <div className="font-semibold mb-2">{label}</div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#94a3b8]" />
              <span className="text-muted-foreground">Investment</span>
            </div>
            <span className="font-medium">{formatCurrency(data.Investment)}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#10b981]" />
              <span className="text-muted-foreground">Present Value{star}</span>
            </div>
            <span className="font-medium">{formatCurrency(data["Present Value"])}</span>
          </div>
          <div className="flex justify-between items-center gap-4 mt-1 pt-1.5 border-t">
            <span className="text-muted-foreground">Gain/Loss{star}</span>
            <span className={`font-medium ${data["Gain/Loss"] >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              {data["Gain/Loss"] > 0 ? "+" : ""}{formatCurrency(data["Gain/Loss"])}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function SectorPerformanceChart({
  sectorSummaries,
}: SectorPerformanceChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // Prepare data for the bar chart
  const data = sectorSummaries
    .filter((s) => s.totalInvestment > 0)
    .map((s) => ({
      name: s.missingDataCount > 0 ? `${s.sector}*` : s.sector,
      Investment: s.totalInvestment,
      "Present Value": s.totalPresentValue !== null ? s.totalPresentValue : 0,
      "Gain/Loss": s.gainLoss !== null ? s.gainLoss : 0,
      isPartial: s.missingDataCount > 0,
    }))
    .sort((a, b) => b.Investment - a.Investment); // Sort by highest investment

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <BarChart3 className="h-8 w-8 text-violet-500" />
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
                  bottom: isMobile ? 35 : 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  interval={isMobile ? 0 : "preserveEnd"}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  tick={{ fontSize: 12, fill: "currentColor" }}
                  dy={isMobile ? 0 : 10}
                  dx={isMobile ? -5 : 0}
                />
                <YAxis
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  content={<CustomTooltip />}
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
