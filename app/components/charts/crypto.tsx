"use client";

import { useState, useEffect } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
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
  // We'll select the data below via a separate hook call
  // so that the store doesn't re-render everything unnecessarily.

  const [selectedCrypto, setSelectedCrypto] =
    useState<keyof Omit<CryptoData, "timestamp">>("bitcoin");
  const [timeRange, setTimeRange] = useState("1D");

  // On first mount, fetch everything once
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const mappedDays = timeRangeMapping[timeRange] || 1;
  const coinData = useCryptoStore(
    (state) => state.data[selectedCrypto]?.[mappedDays] as CryptoData[],
  );

  // ### Real-time Updates ###
  // Use setInterval to periodically fetch the *latest* price for the currently selected coin/timeframe
  useEffect(() => {
    const intervalId = setInterval(() => {
      // This calls the store's method to fetch the newest data point
      fetchLatestPrice(selectedCrypto, mappedDays);
    }, 60_000); // every 60 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedCrypto, mappedDays, fetchLatestPrice]);

  // Price change calculation
  const getPriceChange = () => {
    if (coinData.length < 2) return { value: 0, isPositive: true };
    const current = coinData[coinData.length - 1][selectedCrypto];
    const previous = coinData[0][selectedCrypto];
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(change), isPositive: change >= 0 };
  };

  const currentPrice = coinData[coinData.length - 1]?.[selectedCrypto];
  const priceChange = getPriceChange();

  return (
    <Card className="overflow-hidden bg-white border rounded-3xl dark:bg-neutral-900 dark:border-neutral-700">
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col gap-6">
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

          <div className="h-full w-full">
            <CryptoChart
              data={coinData}
              selectedCrypto={selectedCrypto}
              timeRange={timeRange}
            />
          </div>

          <CryptoSelector
            value={selectedCrypto}
            onValueChange={(value) =>
              setSelectedCrypto(value as keyof Omit<CryptoData, "timestamp">)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
