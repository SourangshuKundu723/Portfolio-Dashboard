import type { Holding, MarketData } from "@/types";
import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

// This map converts numeric BSE codes to their Yahoo-compatible ticker symbols.
const BSE_CODE_TO_TICKER: Record<string, string> = {
  "532174": "ICICIBANK",
  "544252": "BAJAJHFL",
  "511577": "SAVANIFIN",
  "542651": "KPITTECH",
  "544028": "TATATECH",
  "544107": "BLSE",
  "532790": "TANLA",
  "532540": "TATACONSUM",
  "500331": "PIDILITIND",
  "500400": "TATAPOWER",
  "542323": "KPIGREEN",
  "532667": "SUZLON",
  "542851": "GENSOL",
  "543517": "HARIOMPIPE",
  "542652": "POLYCAB",
  "543318": "CLEAN",
  "506401": "DEEPAKNTR",
  "541557": "FINEORG",
  "533282": "GRAVITA",
  "540719": "SBILIFE",
};

function getYahooSymbol(holding: Holding): string {
  if (holding.exchange === "NSE") {
    return `${holding.exchangeCode}.NS`;
  }

  const ticker = BSE_CODE_TO_TICKER[holding.exchangeCode];
  if (ticker) {
    return `${ticker}.BO`;
  }

  // Fallback: try using the BSE code directly
  return `${holding.exchangeCode}.BO`;
}

export async function getYahooMarketData(holding: Holding): Promise<MarketData> {
  const yahooSymbol = getYahooSymbol(holding);

  try {
    const result = await yf.quote(yahooSymbol);

    if (!result || result.regularMarketPrice == null) {
      console.error(
        `[Yahoo Finance] No data for ${holding.companyName} (${yahooSymbol})`
      );
      return { cmp: null, peRatio: null, latestEarnings: null };
    }

    return {
      cmp: result.regularMarketPrice,
      peRatio: null,
      latestEarnings: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(
      `[Yahoo Finance] Failed for ${holding.companyName} (${yahooSymbol}): ${message}`
    );
    return { cmp: null, peRatio: null, latestEarnings: null };
  }
}
