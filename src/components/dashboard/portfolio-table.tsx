"use client";
import { useState } from "react";
import { Search, TrendingUp, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
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

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  align?: "left" | "right";
  currentSort: { key: string; direction: "asc" | "desc" } | null;
  onRequestSort: (key: string) => void;
}

const SortableHeader = ({ label, sortKey, align = "left", currentSort, onRequestSort }: SortableHeaderProps) => {
  return (
    <TableHead className={align === "right" ? "text-right" : ""}>
      <div
        onClick={() => onRequestSort(sortKey)}
        className={`group flex items-center gap-1 cursor-pointer hover:text-foreground select-none ${align === "right" ? "justify-end" : "justify-start"}`}
        title={`Sort by ${label}`}
      >
        {label}
        {currentSort?.key === sortKey ? (
          currentSort.direction === "asc" ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
        )}
      </div>
    </TableHead>
  );
};

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
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const filteredHoldings = data.holdings.filter((h) =>
    h.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedHoldings = [...filteredHoldings].sort((a, b) => {
    if (!sortConfig) return 0;

    let aValue: any;
    let bValue: any;

    switch (sortConfig.key) {
      case "companyName": aValue = a.companyName; bValue = b.companyName; break;
      case "purchasePrice": aValue = a.purchasePrice; bValue = b.purchasePrice; break;
      case "quantity": aValue = a.quantity; bValue = b.quantity; break;
      case "investment": aValue = a.investment; bValue = b.investment; break;
      case "portfolioPercent": aValue = a.portfolioPercent; bValue = b.portfolioPercent; break;
      case "exchange": aValue = a.exchange; bValue = b.exchange; break;
      case "cmp": aValue = a.marketData.cmp ?? -Infinity; bValue = b.marketData.cmp ?? -Infinity; break;
      case "presentValue": aValue = a.presentValue ?? -Infinity; bValue = b.presentValue ?? -Infinity; break;
      case "gainLoss": aValue = a.gainLoss ?? -Infinity; bValue = b.gainLoss ?? -Infinity; break;
      case "peRatio": aValue = a.marketData.peRatio ?? -Infinity; bValue = b.marketData.peRatio ?? -Infinity; break;
      case "eps": aValue = a.marketData.latestEarnings ?? -Infinity; bValue = b.marketData.latestEarnings ?? -Infinity; break;
      default: return 0;
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const requestSort = (key: string) => {
    if (sortConfig && sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        setSortConfig({ key, direction: "desc" });
      } else {
        setSortConfig(null);
      }
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <TrendingUp className="h-8 w-8 text-teal-500" />
          <div>
            <CardTitle>Portfolio Holdings</CardTitle>
            <CardDescription>
              Real-time snapshot of your investments.
            </CardDescription>
          </div>
        </div>
        {data.missingDataCount > 0 && (
          <Badge variant="destructive" className="sm:ml-4 whitespace-normal text-center w-fit">
            {data.missingDataCount} {data.missingDataCount === 1 ? "holding" : "holdings"} missing market data
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="-mt-1 mb-3 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
          <div className="relative w-full sm:mt-2.5 sm:w-64 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search particulars..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center mt-2.5">
            {isRefreshing ? (
              <div className="relative inline-flex overflow-hidden rounded-full p-[1px]">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#10b981_0%,transparent_50%,#10b981_100%)]" />
                <Badge variant="outline" className="relative inline-flex h-full w-full items-center justify-center rounded-full bg-background px-3 py-1 font-semibold backdrop-blur-3xl border-0 gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Updating...
                </Badge>
              </div>
            ) : (
              <Badge variant="ghost" className="font-semibold text-sm text-muted-foreground px-4 py-1.5 rounded-full border-0 bg-transparent hover:bg-transparent">
                Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : ""}
              </Badge>
            )}
          </div>
        </div>
        <div className="rounded-md border pl-1 [&>div]:max-h-[425px] [&>div]:overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
              <TableRow>
                <SortableHeader label="Particulars" sortKey="companyName" currentSort={sortConfig} onRequestSort={requestSort} />
                <SortableHeader label="Purchase Price" sortKey="purchasePrice" align="right" currentSort={sortConfig} onRequestSort={requestSort} />
                <SortableHeader label="Quantity" sortKey="quantity" align="right" currentSort={sortConfig} onRequestSort={requestSort} />
                <SortableHeader label="Investment" sortKey="investment" align="right" currentSort={sortConfig} onRequestSort={requestSort} />
                <SortableHeader label="Portfolio %" sortKey="portfolioPercent" align="right" currentSort={sortConfig} onRequestSort={requestSort} />
                <SortableHeader label="NSE/BSE" sortKey="exchange" align="right" currentSort={sortConfig} onRequestSort={requestSort} />
                <SortableHeader label="CMP" sortKey="cmp" align="right" currentSort={sortConfig} onRequestSort={requestSort} />
                <SortableHeader label="Present Value" sortKey="presentValue" align="right" currentSort={sortConfig} onRequestSort={requestSort} />
                <SortableHeader label="Gain/Loss" sortKey="gainLoss" align="right" currentSort={sortConfig} onRequestSort={requestSort} />
                <SortableHeader label="P/E Ratio" sortKey="peRatio" align="right" currentSort={sortConfig} onRequestSort={requestSort} />
                <SortableHeader label="EPS" sortKey="eps" align="right" currentSort={sortConfig} onRequestSort={requestSort} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHoldings.map((h) => {
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
