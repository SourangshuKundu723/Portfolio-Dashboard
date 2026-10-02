"use client";

import { useEffect, useState } from "react";
import type { ApiResponse, PortfolioSummary } from "@/types";
import { PortfolioTable } from "./portfolio-table";
import { PortfolioAllocationChart } from "./portfolio-allocation-chart";
import { SectorPerformanceChart } from "./sector-performance-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, PieChart as PieChartIcon, BarChart3, TrendingUp } from "lucide-react";

export function DashboardContent() {
  const [data, setData] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPortfolio = async (isBackground = false) => {
    if (isBackground) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

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
      setLastUpdated(new Date());
      // Clear any previous background errors if successful
      if (isBackground) setError(null);
    } catch (err) {
      if (!isBackground) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } else {
        // Just log background errors, don't break the UI
        console.error("Refresh failed:", err);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isRefreshing && !loading) {
        fetchPortfolio(true);
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, [isRefreshing, loading]);

  if (loading) {
    return (
      <div className="space-y-6 w-full">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <PieChartIcon className="h-8 w-8 text-muted-foreground" />
              <div>
                <CardTitle>Portfolio Allocation</CardTitle>
                <CardDescription>Investment distribution by sector</CardDescription>
              </div>
            </CardHeader>
            <CardContent><Skeleton className="h-[250px] w-full" /></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
              <div>
                <CardTitle>Sector Performance</CardTitle>
                <CardDescription>Compare investment vs present value across sectors</CardDescription>
              </div>
            </CardHeader>
            <CardContent><Skeleton className="h-[250px] w-full" /></CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
            <div>
              <CardTitle>Portfolio Holdings</CardTitle>
              <CardDescription>Fetching live market data...</CardDescription>
            </div>
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
      </div>
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
    <div className="space-y-8 w-full">


      <div className="grid gap-6 md:grid-cols-2">
        <PortfolioAllocationChart
          sectorSummaries={data.sectorSummaries}
          totalInvestment={data.totalInvestment}
        />
        <SectorPerformanceChart
          sectorSummaries={data.sectorSummaries}
        />
      </div>

      <PortfolioTable data={data} isRefreshing={isRefreshing} lastUpdated={lastUpdated} />
    </div>
  );
}
