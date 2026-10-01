import type { Holding, MarketData } from "@/types";
import axios from "axios";
import * as cheerio from "cheerio";
import { marketDataCache } from "./cache";

function getGoogleFinanceUrl(holding: Holding): string {
  if (holding.exchange === "NSE") {
    // NSE format: TICKER:NSE
    return `https://www.google.com/finance/quote/${holding.exchangeCode}:NSE`;
  } else {
    // BSE format: CODE:BOM
    return `https://www.google.com/finance/quote/${holding.exchangeCode}:BOM`;
  }
}

export async function getGoogleMarketData(
  holding: Holding
): Promise<{ peRatio: number | null; latestEarnings: number | null }> {
  const url = getGoogleFinanceUrl(holding);
  
  return marketDataCache.getOrFetch(`google_${holding.exchangeCode}`, 300, async () => {
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      const $ = cheerio.load(response.data);

      let peRatio: number | null = null;
      let latestEarnings: number | null = null;

      // 1. Extract P/E Ratio
      $("div").each((_, el) => {
        if ($(el).text().trim() === "P/E ratio") {
          const parent = $(el).parent();
          const valStr = parent.find("div").last().text().trim();
          if (valStr && valStr !== "-") {
            const parsed = parseFloat(valStr.replace(/,/g, ""));
            if (!isNaN(parsed)) {
              peRatio = parsed;
            }
          }
        }
      });

      // 2. Extract EPS (Trailing Twelve Months)
      $("div").each((_, el) => {
        if ($(el).text().trim() === "EPS") {
          const parent = $(el).parent();
          const valStr = parent.find("div").last().text().trim();
          if (valStr && valStr !== "-") {
            // Remove currency symbols (like ₹, $) and commas
            const parsed = parseFloat(valStr.replace(/[^\d.-]/g, ""));
            if (!isNaN(parsed)) {
              latestEarnings = parsed;
            }
          }
        }
      });

      return {
        peRatio,
        latestEarnings,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(
        `[Google Finance] Failed for ${holding.companyName} (${holding.exchangeCode}): ${message}`
      );
      return {
        peRatio: null,
        latestEarnings: null,
      };
    }
  });
}
