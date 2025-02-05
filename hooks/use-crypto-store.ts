"use client";

import { create } from "zustand";
import axios from "axios";
import type { CryptoData } from "@/types/crypto";

const API_BASE_URL = "https://api.coingecko.com/api/v3/coins";

// Matches the "days" values you need:
const ALL_TIME_RANGES = [1, 7, 30, 365];

// Matches all of the coins you need:
const ALL_CRYPTOS = ["bitcoin", "ethereum", "solana", "cardano"] as const;

type CryptoName = (typeof ALL_CRYPTOS)[number];
type Days = (typeof ALL_TIME_RANGES)[number];

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
   * NEW: A function to fetch only the latest data point
   * for a given crypto and timeframe (days).
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

  // 1) Fetch *all* data for all cryptos & time ranges once
  fetchAllData: async () => {
    set({ isLoading: true });

    try {
      const requests = ALL_CRYPTOS.flatMap((coin) =>
        ALL_TIME_RANGES.map((days) =>
          axios
            .get(
              `${API_BASE_URL}/${coin}/market_chart?vs_currency=usd&days=${days}&x_cg_demo_api_key=CG-d2b5Ap4BeKBSanwBJwEskmES`,
            )
            .then((res) => ({
              coin,
              days,
              prices: res.data.prices,
            })),
        ),
      );

      const results = await Promise.all(requests);

      const newData: Record<CryptoName, Record<Days, CryptoData[]>> = {
        bitcoin: { 1: [], 7: [], 30: [], 365: [] },
        ethereum: { 1: [], 7: [], 30: [], 365: [] },
        solana: { 1: [], 7: [], 30: [], 365: [] },
        cardano: { 1: [], 7: [], 30: [], 365: [] },
      };

      results.forEach(({ coin, days, prices }) => {
        newData[coin][days] = prices.map((entry: [number, number]) => ({
          timestamp: entry[0],
          [coin]: entry[1],
        }));
      });

      set({ data: newData, isLoading: false });
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      set({ isLoading: false });
    }
  },

  // 2) Append new data point to the store (used for real-time updates)
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

  // 3) Fetch only the *latest* price, and add it to the existing data array
  fetchLatestPrice: async (crypto, days) => {
    try {
      // Option A: a simpler approach is to fetch the entire set of historical data again
      // but with "days" = 1 or your target. Then take the last element from the returned prices.
      // We do this so we don't have to figure out a "range" based on timestamps.

      const res = await axios.get(
        `${API_BASE_URL}/${crypto}/market_chart?vs_currency=usd&days=${days}&x_cg_demo_api_key=${process.env.NEXT_PUBLIC_CG_DEMO_API_KEY}`,
      );

      // get the last data point
      const prices = res.data.prices; // => [[timestamp, price], [timestamp, price], ...]
      if (!prices || !prices.length) return;

      const lastPrice = prices[prices.length - 1]; // e.g. [1675359384000, 23985.123]
      const timestamp = lastPrice[0];
      const priceValue = lastPrice[1];

      // Add it to Zustand
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
