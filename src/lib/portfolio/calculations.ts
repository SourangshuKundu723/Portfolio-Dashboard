import type { Holding, HoldingData, PortfolioSummary } from "@/types";
import { getYahooMarketData } from "../market-data";

export async function calculatePortfolio(holdings: Holding[]): Promise<PortfolioSummary> {
  let totalInvestment = 0;

  // Investment = Purchase Price * Quantity
  const baseHoldings = holdings.map(holding => {
    const investment = holding.purchasePrice * holding.quantity;
    totalInvestment += investment;
    return { holding, investment };
  });

  let totalPresentValue: number | null = 0;
  let hasMissingData = false;

  // Fetch market data and calculate final values
  const holdingPromises = baseHoldings.map(async ({ holding, investment }) => {
    const marketData = await getYahooMarketData(holding);

    // Portfolio % = Investment / Total Investment * 100
    const portfolioPercent = totalInvestment > 0 ? (investment / totalInvestment) * 100 : 0;

    let presentValue: number | null = null;
    let gainLoss: number | null = null;

    if (marketData.cmp !== null) {
      // Present Value = CMP * Quantity
      presentValue = marketData.cmp * holding.quantity;
      // Gain/Loss = Present Value - Investment
      gainLoss = presentValue - investment;

      if (!hasMissingData && totalPresentValue !== null) {
        totalPresentValue += presentValue;
      }
    } else {
      hasMissingData = true;
      totalPresentValue = null;
    }

    return {
      ...holding,
      investment,
      portfolioPercent,
      marketData,
      presentValue,
      gainLoss,
    } as HoldingData;
  });

  const holdingDataList = await Promise.all(holdingPromises);

  const totalGainLoss = totalPresentValue !== null ? totalPresentValue - totalInvestment : null;

  return {
    holdings: holdingDataList,
    totalInvestment,
    totalPresentValue,
    totalGainLoss,
  };
}
