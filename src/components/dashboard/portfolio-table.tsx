"use client";

import { useEffect, useState } from "react";
import type { ApiResponse, PortfolioSummary } from "@/types";
import { formatCurrency, formatPercent } from "@/lib/utils/formatting";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export function PortfolioTable() {
  const [data, setData] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch("/api/portfolio");
        if (!res.ok) {
          throw new Error(`Failed to fetch data (status ${res.status})`);
        }
        
        const json = (await res.json()) as ApiResponse<PortfolioSummary>;
        if (!json.success || !json.data) {
          throw new Error(json.error || "Failed to load portfolio data");
        }
        
        setData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Holdings</CardTitle>
          <CardDescription>Fetching live market data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading portfolio</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Holdings</CardTitle>
        <CardDescription>
          Real-time snapshot of your investments. Total Investment: {formatCurrency(data.totalInvestment)}
          {data.totalPresentValue !== null && ` | Present Value: ${formatCurrency(data.totalPresentValue)}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Particulars</TableHead>
                <TableHead className="text-right">Purchase Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Investment</TableHead>
                <TableHead className="text-right">Portfolio %</TableHead>
                <TableHead className="text-right">NSE/BSE</TableHead>
                <TableHead className="text-right">CMP</TableHead>
                <TableHead className="text-right">Present Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.holdings.map((h) => {
                const isGain = h.gainLoss !== null && h.gainLoss > 0;
                const isLoss = h.gainLoss !== null && h.gainLoss < 0;
                
                return (
                  <TableRow key={`${h.exchange}-${h.exchangeCode}`}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{h.companyName}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">{h.sector}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(h.purchasePrice)}</TableCell>
                    <TableCell className="text-right">{h.quantity}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(h.investment)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {h.portfolioPercent.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-[10px]">
                        {h.exchange}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {h.marketData.cmp !== null ? formatCurrency(h.marketData.cmp) : "N/A"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {h.presentValue !== null ? formatCurrency(h.presentValue) : "N/A"}
                    </TableCell>
                    <TableCell 
                      className={`text-right font-medium ${isGain ? 'text-emerald-500' : isLoss ? 'text-red-500' : ''}`}
                    >
                      {h.gainLoss !== null 
                        ? (h.gainLoss > 0 ? "+" : "") + formatCurrency(h.gainLoss)
                        : "N/A"
                      }
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
