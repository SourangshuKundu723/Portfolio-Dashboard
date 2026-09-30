import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { ApiResponse, MarketData } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<MarketData>>> {
  const symbol = request.nextUrl.searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "Missing required query parameter: symbol",
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }

  const response: ApiResponse<MarketData> = {
    success: true,
    data: {
      cmp: null,
      peRatio: null,
      latestEarnings: null,
    },
    error: null,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
