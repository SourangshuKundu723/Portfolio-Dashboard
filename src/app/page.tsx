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

export default function DashboardPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-16">
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

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon={<Wallet className="h-5 w-5" />}
          title="Holdings Tracker"
          description="View all portfolio holdings with investment details and real-time valuations."
        />
        <FeatureCard
          icon={<TrendingUp className="h-5 w-5" />}
          title="Live Market Data"
          description="CMP from Yahoo Finance and P/E ratios from Google Finance, refreshed periodically."
        />
        <FeatureCard
          icon={<PieChart className="h-5 w-5" />}
          title="Sector Analysis"
          description="Holdings grouped by sector with aggregated investment and gain/loss metrics."
        />
        <FeatureCard
          icon={<BarChart3 className="h-5 w-5" />}
          title="Visual Analytics"
          description="Interactive charts for portfolio distribution, sector breakdown, and performance."
        />
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="transition-colors hover:bg-accent/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            {icon}
          </div>
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-xs leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
