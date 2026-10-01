import type { Holding, HoldingData, PortfolioSummary } from "@/types";
import { getYahooMarketData, getGoogleMarketData } from "../market-data";

export async function calculatePortfolio(holdings: Holding[]): Promise<PortfolioSummary> {
  let totalInvestment = 0;

  // First pass: Calculate initial investment for each holding
  // Investment = Purchase Price * Quantity
  const baseHoldings = holdings.map(holding => {
    const investment = holding.purchasePrice * holding.quantity;
    totalInvestment += investment;
    return { holding, investment };
  });

  let totalPresentValue = 0;
  let totalInvestmentWithPv = 0;
  let missingDataCount = 0;

  // Fetch market data and calculate final values
  const holdingPromises = baseHoldings.map(async ({ holding, investment }) => {
    // Fetch Yahoo (CMP) and Google (PE, EPS) concurrently
    const [yahooData, googleData] = await Promise.all([
      getYahooMarketData(holding),
      getGoogleMarketData(holding)
    ]);

    // Portfolio % = Investment / Total Investment * 100
    const portfolioPercent = totalInvestment > 0 ? (investment / totalInvestment) * 100 : 0;

    let presentValue: number | null = null;
    let gainLoss: number | null = null;

    if (yahooData.cmp !== null) {
      // Present Value = CMP * Quantity
      presentValue = yahooData.cmp * holding.quantity;
      // Gain/Loss = Present Value - Investment
      gainLoss = presentValue - investment;

      totalPresentValue += presentValue;
      totalInvestmentWithPv += investment;
    } else {
      missingDataCount++;
    }

    return {
      ...holding,
      investment,
      portfolioPercent,
      marketData: {
        cmp: yahooData.cmp,
        peRatio: googleData.peRatio,
        latestEarnings: googleData.latestEarnings
      },
      presentValue,
      gainLoss,
    } as HoldingData;
  });

  const holdingDataList = await Promise.all(holdingPromises);

  // Calculate sector summaries
  const sectorMap = new Map<string, { investment: number; pv: number; investmentWithPv: number; missingDataCount: number; count: number }>();
  
  holdingDataList.forEach((h) => {
    const current = sectorMap.get(h.sector) || { investment: 0, pv: 0, investmentWithPv: 0, missingDataCount: 0, count: 0 };
    current.investment += h.investment;
    current.count++;
    
    if (h.presentValue !== null) {
      current.pv += h.presentValue;
      current.investmentWithPv += h.investment;
    } else {
      current.missingDataCount++;
    }
    
    sectorMap.set(h.sector, current);
  });

  const sectorSummaries = Array.from(sectorMap.entries()).map(([sector, data]) => {
    // Only calculate PV and Gain/Loss if at least one holding has data
    const hasAnyPv = data.missingDataCount < data.count;
    const pv = hasAnyPv ? data.pv : null;
    const gainLoss = hasAnyPv ? data.pv - data.investmentWithPv : null;
    
    return {
      sector,
      totalInvestment: data.investment,
      totalPresentValue: pv,
      gainLoss,
      missingDataCount: data.missingDataCount,
    };
  });

  // Calculate final overall totals
  const hasAnyTotalPv = missingDataCount < holdings.length;
  const finalTotalPresentValue = hasAnyTotalPv ? totalPresentValue : null;
  const finalTotalGainLoss = hasAnyTotalPv ? totalPresentValue - totalInvestmentWithPv : null;

  return {
    holdings: holdingDataList,
    sectorSummaries,
    totalInvestment,
    totalPresentValue: finalTotalPresentValue,
    totalGainLoss: finalTotalGainLoss,
    missingDataCount,
  };
}
