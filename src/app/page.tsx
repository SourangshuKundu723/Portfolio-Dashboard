import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Portfolio Dashboard
          </h1>
          <Badge variant="secondary" className="text-xs">
            v0.1.0
          </Badge>
        </div>
        <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
          A real-time portfolio analytics dashboard that tracks your stock
          holdings, fetches live market data, and calculates gain/loss across
          sectors.
        </p>
      </div>

      <div className="w-full">
        <DashboardContent />
      </div>
    </div>
  );
}
