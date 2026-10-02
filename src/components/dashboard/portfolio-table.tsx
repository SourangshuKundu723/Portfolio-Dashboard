"use client";
import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import type { PortfolioSummary } from "@/types";
import { formatCurrency } from "@/lib/utils/formatting";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
export function PortfolioTable({
  data,
  isRefreshing = false,
  lastUpdated = null
}: {
  data: PortfolioSummary;
  isRefreshing?: boolean;
  lastUpdated?: Date | null;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHoldings = data.holdings.filter((h) =>
    h.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-center gap-4">
          <TrendingUp className="h-8 w-8 text-muted-foreground" />
          <div>
            <CardTitle>Portfolio Holdings</CardTitle>
            <CardDescription>
              Real-time snapshot of your investments. Total Investment: {formatCurrency(data.totalInvestment)}
            </CardDescription>
          </div>
        </div>
        {data.missingDataCount > 0 && (
          <Badge variant="destructive" className="ml-4 shrink-0">
            {data.missingDataCount} {data.missingDataCount === 1 ? "holding" : "holdings"} missing market data
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="-mt-4 mb-3 flex items-center justify-between text-sm text-muted-foreground">
          <div className="relative mt-2.5 w-64 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search particulars..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {isRefreshing ? (
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Updating...
              </span>
            ) : (
              <span>
                Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : ""}
              </span>
            )}
          </div>
        </div>
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
                <TableHead className="text-right">P/E Ratio</TableHead>
                <TableHead className="text-right">EPS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHoldings.map((h) => {
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
                    <TableCell className="text-right">
                      {h.marketData.peRatio !== null ? h.marketData.peRatio.toFixed(2) : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {h.marketData.latestEarnings !== null ? h.marketData.latestEarnings.toFixed(2) : "N/A"}
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
