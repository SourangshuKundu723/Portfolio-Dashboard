import { NextResponse } from "next/server";
import { holdings } from "@/data/holdings";
import { calculatePortfolio } from "@/lib/portfolio";
import type { ApiResponse, PortfolioSummary } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<PortfolioSummary>>> {
  try {
    const portfolioSummary = await calculatePortfolio(holdings);

    return NextResponse.json({
      success: true,
      data: portfolioSummary,
      error: null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    
    return NextResponse.json({
      success: false,
      data: null,
      error: message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
