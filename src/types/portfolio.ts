export interface Holding {
  companyName: string;
  purchasePrice: number;
  quantity: number;
  sector: string;
  exchange: "NSE" | "BSE";
  exchangeCode: string;
}

export interface MarketData {
  cmp: number | null;
  peRatio: number | null;
  latestEarnings: number | null;
}

export interface HoldingData extends Holding {
  investment: number;
  portfolioPercent: number;
  marketData: MarketData;
  presentValue: number | null;
  gainLoss: number | null;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number | null;
  gainLoss: number | null;
}