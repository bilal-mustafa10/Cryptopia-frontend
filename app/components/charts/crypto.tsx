"use client";

import { useState, useEffect } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { TimeRangeSelector } from "@/app/components/time-range-selector";
import { CryptoChart } from "@/app/components/charts/crypto-chart";
import { CryptoSelector } from "@/app/components/charts/crypto-selector";
import type { CryptoData } from "@/types/crypto";
import { useCryptoStore } from "@/hooks/use-crypto-store";

// Mapping from label to number of days
const timeRangeMapping: Record<string, number> = {
  "1D": 1,
  "7D": 7,
  "1M": 30,
  "1Y": 365,
};

export function Crypto() {
  const { isLoading, fetchAllData, fetchLatestPrice } = useCryptoStore();
  const [selectedCrypto, setSelectedCrypto] =
    useState<keyof Omit<CryptoData, "timestamp">>("bitcoin");
  const [timeRange, setTimeRange] = useState("1D");

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const mappedDays = timeRangeMapping[timeRange] || 1;
  const coinData = useCryptoStore(
    (state) => state.data[selectedCrypto]?.[mappedDays] as CryptoData[],
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchLatestPrice(selectedCrypto, mappedDays);
    }, 60_000);

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedCrypto, mappedDays, fetchLatestPrice]);

  const getPriceChange = () => {
    if (!coinData || coinData.length < 2) return { value: 0, isPositive: true };
    const current = coinData[coinData.length - 1][selectedCrypto];
    const previous = coinData[0][selectedCrypto];
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(change), isPositive: change >= 0 };
  };

  const currentPrice =
    coinData && coinData.length > 0
      ? coinData[coinData.length - 1][selectedCrypto]
      : undefined;
  const priceChange = getPriceChange();

  // Set chart color based on price change:
  // Use mint color if positive, or red if negative.
  const chartColor = priceChange.isPositive
    ? "hsl(159, 100%, 50%)" // Mint
    : "#ef4444"; // Red (Tailwind red-500 is roughly #ef4444)

  return (
    <GlassCard>
      <div className="p-6 space-y-4">
        <span className="text-sm text-zinc-400 font-medium">Charts</span>
        <CryptoSelector
          value={selectedCrypto}
          onValueChange={(value) =>
            setSelectedCrypto(value as keyof Omit<CryptoData, "timestamp">)
          }
        />

        {/* Price Info and Time Range Selector */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="text-3xl font-bold tabular-nums">
              {isLoading ? (
                <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
              ) : (
                `$${currentPrice?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isLoading ? (
                <>
                  <span
                    className={cn(
                      "flex items-center text-sm font-medium",
                      priceChange.isPositive
                        ? "text-[#00FFA3]"
                        : "text-red-500",
                    )}
                  >
                    {priceChange.isPositive ? (
                      <ArrowUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4" />
                    )}
                    {priceChange.value.toFixed(2)}%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Past {timeRange}
                  </span>
                </>
              ) : (
                <div className="h-5 w-20 animate-pulse rounded-md bg-muted" />
              )}
            </div>
          </div>
          <TimeRangeSelector value={timeRange} onValueChange={setTimeRange} />
        </div>

        {/* Crypto Chart */}
        <div className="h-full w-full">
          <CryptoChart
            data={coinData}
            selectedCrypto={selectedCrypto}
            timeRange={timeRange}
            color={chartColor}
          />
        </div>
      </div>
    </GlassCard>
  );
}
