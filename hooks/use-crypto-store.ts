"use client";

import { create } from "zustand";
import axios from "axios";
import type { CryptoData } from "@/types/crypto";

const ALL_TIME_RANGES = [1, 7, 30, 365];
const ALL_CRYPTOS = ["bitcoin", "ethereum", "solana", "cardano"] as const;
type CryptoName = (typeof ALL_CRYPTOS)[number];
type Days = (typeof ALL_TIME_RANGES)[number];

const CRYPTOCOMPARE_API_BASE_URL = "https://min-api.cryptocompare.com/data";

const CRYPTOCOMPARE_SYMBOLS: Record<CryptoName, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  cardano: "ADA",
};

const CRYPTOCOMPARE_API_KEY = process.env.NEXT_PUBLIC_CRYPTOCOMPARE_API_KEY;
const apiKeyQuery = CRYPTOCOMPARE_API_KEY
  ? `&api_key=${CRYPTOCOMPARE_API_KEY}`
  : "";

interface CryptoStoreState {
  data: Record<CryptoName, Record<Days, CryptoData[]>>;
  isLoading: boolean;
  fetchAllData: () => Promise<void>;
  addNewPricePoint: (
    crypto: CryptoName,
    days: Days,
    newPoint: CryptoData,
  ) => void;
  /**
   * Fetches only the latest data point for a given crypto and timeframe.
   */
  fetchLatestPrice: (crypto: CryptoName, days: Days) => Promise<void>;
}

export const useCryptoStore = create<CryptoStoreState>((set, get) => ({
  data: {
    bitcoin: { 1: [], 7: [], 30: [], 365: [] },
    ethereum: { 1: [], 7: [], 30: [], 365: [] },
    solana: { 1: [], 7: [], 30: [], 365: [] },
    cardano: { 1: [], 7: [], 30: [], 365: [] },
  },
  isLoading: false,

  fetchAllData: async () => {
    set({ isLoading: true });

    try {
      const requests = ALL_CRYPTOS.flatMap((coin) => {
        const symbol = CRYPTOCOMPARE_SYMBOLS[coin];
        return ALL_TIME_RANGES.map((days) => {
          let endpoint = "";
          if (days === 1) {
            endpoint = `${CRYPTOCOMPARE_API_BASE_URL}/v2/histohour?fsym=${symbol}&tsym=USD&limit=24${apiKeyQuery}`;
          } else {
            endpoint = `${CRYPTOCOMPARE_API_BASE_URL}/v2/histoday?fsym=${symbol}&tsym=USD&limit=${days}${apiKeyQuery}`;
          }

          return axios.get(endpoint).then((res) => ({
            coin,
            days,
            prices: res.data.Data.Data,
          }));
        });
      });

      const results = await Promise.all(requests);

      const newData: Record<CryptoName, Record<Days, CryptoData[]>> = {
        bitcoin: { 1: [], 7: [], 30: [], 365: [] },
        ethereum: { 1: [], 7: [], 30: [], 365: [] },
        solana: { 1: [], 7: [], 30: [], 365: [] },
        cardano: { 1: [], 7: [], 30: [], 365: [] },
      };

      results.forEach(({ coin, days, prices }) => {
        newData[coin][days] = prices.map(
          (entry: { time: number; close: number }) => ({
            timestamp: entry.time * 1000,
            [coin]: entry.close,
          }),
        );
      });

      set({ data: newData, isLoading: false });
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      set({ isLoading: false });
    }
  },

  addNewPricePoint: (crypto, days, newPoint) => {
    set((state) => ({
      data: {
        ...state.data,
        [crypto]: {
          ...state.data[crypto],
          [days]: [...state.data[crypto][days], newPoint],
        },
      },
    }));
  },

  fetchLatestPrice: async (crypto, days) => {
    try {
      const symbol = CRYPTOCOMPARE_SYMBOLS[crypto];
      const res = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD${apiKeyQuery}`,
      );
      const priceValue = res.data.USD;
      const timestamp = Date.now();

      get().addNewPricePoint(crypto, days, {
        timestamp,
        bitcoin: crypto === "bitcoin" ? priceValue : undefined,
        ethereum: crypto === "ethereum" ? priceValue : undefined,
        solana: crypto === "solana" ? priceValue : undefined,
        cardano: crypto === "cardano" ? priceValue : undefined,
      });
    } catch (error) {
      console.error("Error fetching latest price:", error);
    }
  },
}));
