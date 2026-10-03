"use client";

import type { PortfolioSummary } from "@/types";
import { formatCurrency } from "@/lib/utils/formatting";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, Landmark } from "lucide-react";

export function HeroMetrics({ data }: { data: PortfolioSummary }) {
  const { totalInvestment, totalPresentValue, totalGainLoss, missingDataCount } = data;

  const isPartial = missingDataCount > 0;
  const star = isPartial ? <span className="text-red-500 text-[12px] align-super">*</span> : null;

  // To calculate the true percentage return for the data we actually fetched,
  // we must derive the partial investment of the successful stocks only.
  const partialInvestment = (totalPresentValue !== null && totalGainLoss !== null)
    ? totalPresentValue - totalGainLoss
    : 0;

  const percentage = (partialInvestment > 0 && totalGainLoss !== null)
    ? (totalGainLoss / partialInvestment) * 100
    : 0;

  const isGain = (totalGainLoss ?? 0) >= 0;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Investment</p>
            <h3 className="text-2xl font-bold">{formatCurrency(totalInvestment)}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-full">
            <Wallet className="h-5 w-5 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardContent className={`p-6 flex items-center justify-between ${isPartial ? 'pb-2' : ''}`}>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Present Value{star}
            </p>
            <h3 className="text-2xl font-bold">
              {totalPresentValue !== null ? formatCurrency(totalPresentValue) : "N/A"}
            </h3>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-full">
            <Landmark className="h-5 w-5 text-indigo-500" />
          </div>
        </CardContent>
        {isPartial && (
          <div className="px-6 pt-0 pb-6 text-xs text-muted-foreground">
            <span className="text-red-500">*</span> Partial - {missingDataCount} holding{missingDataCount > 1 ? "s" : ""} have unavailable market data
          </div>
        )}
      </Card>

      <Card className="flex flex-col">
        <CardContent className={`p-6 flex items-center justify-between ${isPartial ? 'pb-2' : ''}`}>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Total Gain/Loss{star}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className={`text-2xl font-bold ${isGain ? "text-emerald-500" : "text-red-500"}`}>
                {totalGainLoss !== null ? (
                  <>{isGain ? "+" : ""}{formatCurrency(totalGainLoss)}</>
                ) : (
                  "N/A"
                )}
              </h3>
              {totalGainLoss !== null && (
                <span className={`text-sm font-medium ${isGain ? "text-emerald-500/80" : "text-red-500/80"}`}>
                  ({isGain ? "+" : ""}{percentage.toFixed(2)}%)
                </span>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-full ${isGain ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
            {isGain ? (
              <TrendingUp className={`h-5 w-5 ${totalGainLoss !== null ? "text-emerald-500" : "text-muted-foreground"}`} />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
          </div>
        </CardContent>
        {isPartial && (
          <div className="px-6 pt-0 pb-6 text-xs text-muted-foreground">
            <span className="text-red-500">*</span> Partial - {missingDataCount} holding{missingDataCount > 1 ? "s" : ""} have unavailable market data
          </div>
        )}
      </Card>
    </div>
  );
}
