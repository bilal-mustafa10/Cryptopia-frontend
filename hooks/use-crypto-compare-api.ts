"use client";

import axios from "axios";

const BASE_URL = "https://min-api.cryptocompare.com";
const API_KEY = process.env.NEXT_PUBLIC_CRYPTO_COMPARE_API_KEY;

const headers = {
  Accept: "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

/**
 * A generic function that makes a request to the CryptoCompare API.
 *
 * @param endpoint - The API endpoint (without BASE_URL)
 * @param options - Optional parameters including query params, HTTP method and JSON payload.
 * @returns The API response data.
 */
const makeRequest = async (
  endpoint: string,
  options?: {
    params?: Record<string, any>;
    method?: "GET" | "POST";
    jsonData?: Record<string, any>;
  },
): Promise<any> => {
  const url = `${BASE_URL}/${endpoint}`;
  const method = options?.method || "GET";
  try {
    const response = await axios.request({
      url,
      method,
      headers,
      params: options?.params,
      data: options?.jsonData,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

/**
 * A hook that returns functions for fetching various cryptocurrency data from the CryptoCompare API.
 *
 * Usage example:
 * ```tsx
 * const { fetchPrice, fetchTradingSignals } = useCryptoCompareData();
 *
 * useEffect(() => {
 *   (async () => {
 *     const priceData = await fetchPrice("BTC", ["USD", "EUR"]);
 *     console.log("Price Data:", priceData);
 *
 *     const signals = await fetchTradingSignals("BTC");
 *     console.log("Trading Signals:", signals);
 *   })();
 * }, []);
 * ```
 */
export const useCryptoCompareData = () => {
  /**
   * Fetch current price for a cryptocurrency in multiple currencies.
   *
   * @param fromSymbol - The base cryptocurrency symbol (e.g., "BTC", "ETH")
   * @param toSymbols - An array of target currency symbols (e.g., ["USD", "EUR", "JPY"])
   * @returns Price data for the requested symbols.
   */
  const fetchPrice = async (
    fromSymbol: string,
    toSymbols: string[],
  ): Promise<any> => {
    const endpoint = "data/price";
    const params = {
      fsym: fromSymbol.toUpperCase(),
      tsyms: toSymbols.map((s) => s.toUpperCase()).join(","),
    };
    return await makeRequest(endpoint, { params });
  };

  /**
   * Fetch the latest trading signals from IntoTheBlock.
   *
   * @param fromSymbol - The cryptocurrency symbol (e.g., "BTC")
   * @returns Trading signals and market indicators.
   */
  const fetchTradingSignals = async (fromSymbol: string): Promise<any> => {
    const endpoint = "data/tradingsignals/intotheblock/latest";
    const params = {
      fsym: fromSymbol.toUpperCase(),
    };
    return await makeRequest(endpoint, { params });
  };

  /**
   * Fetch top cryptocurrencies by market capitalization.
   *
   * @param limit - The number of top cryptocurrencies to return (default is 10)
   * @param toSymbol - The quote currency symbol for market cap calculation (default is "USD")
   * @returns Detailed market cap data.
   */
  const fetchTopMarketCap = async (
    limit: number = 10,
    toSymbol: string = "USD",
  ): Promise<any> => {
    const endpoint = "data/top/mktcapfull";
    const params = {
      limit,
      tsym: toSymbol.toUpperCase(),
    };
    return await makeRequest(endpoint, { params });
  };

  /**
   * Fetch the top exchanges for a cryptocurrency pair.
   *
   * @param fromSymbol - The base cryptocurrency symbol (e.g., "BTC")
   * @param toSymbol - The quote currency symbol (default is "USD")
   * @returns Data for the top exchanges.
   */
  const fetchTopExchanges = async (
    fromSymbol: string,
    toSymbol: string = "USD",
  ): Promise<any> => {
    const endpoint = "data/top/exchanges";
    const params = {
      fsym: fromSymbol.toUpperCase(),
      tsym: toSymbol.toUpperCase(),
    };
    return await makeRequest(endpoint, { params });
  };

  /**
   * Fetch top cryptocurrencies by trading volume.
   *
   * @param limit - The number of cryptocurrencies to return (default is 10)
   * @param toSymbol - The quote currency symbol for volume calculation (default is "USD")
   * @returns Trading volume data.
   */
  const fetchTopVolume = async (
    limit: number = 10,
    toSymbol: string = "USD",
  ): Promise<any> => {
    const endpoint = "data/top/totalvolfull";
    const params = {
      limit,
      tsym: toSymbol.toUpperCase(),
    };
    return await makeRequest(endpoint, { params });
  };

  /**
   * Fetch news articles for a specific token.
   *
   * @param token - The token symbol to fetch news for (e.g., "BTC", "ETH", "SOL")
   * @param timestamp - Unix timestamp to search for news (optional, defaults to current time)
   * @returns News data.
   */
  const fetchNews = async (token: string, timestamp?: number): Promise<any> => {
    const ts = timestamp || Math.floor(Date.now() / 1000);
    const endpoint = "data/v2/news/";
    const params = {
      lang: "EN",
      lTs: ts,
      categories: token,
      sign: "true",
    };
    return await makeRequest(endpoint, { params });
  };

  return {
    fetchPrice,
    fetchTradingSignals,
    fetchTopMarketCap,
    fetchTopExchanges,
    fetchTopVolume,
    fetchNews,
  };
};
