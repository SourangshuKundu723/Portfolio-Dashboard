import { NextResponse } from "next/server";
import type { ApiResponse, PortfolioSummary } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<PortfolioSummary>>> {
  const response: ApiResponse<PortfolioSummary> = {
    success: true,
    data: {
      totalInvestment: 0,
      totalPresentValue: null,
      totalGainLoss: null,
      totalGainLossPercent: null,
      holdingCount: 0,
      sectorCount: 0,
    },
    error: null,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
