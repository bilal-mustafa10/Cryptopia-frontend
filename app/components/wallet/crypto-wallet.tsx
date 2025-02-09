"use client";

import React, { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useCryptoStore } from "@/hooks/use-crypto-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePublicAddress } from "@/hooks/use-public-address";

const portfolio = [
  {
    symbol: "bitcoin",
    displayName: "BTC",
    color: "bg-blue-500",
    costPerCoin: 45000,
    quantity: 0.1,
  },
  {
    symbol: "ethereum",
    displayName: "ETH",
    color: "bg-orange-500",
    costPerCoin: 1500,
    quantity: 2,
  },
  {
    symbol: "solana",
    displayName: "SOL",
    color: "bg-green-500",
    costPerCoin: 20,
    quantity: 25,
  },
  {
    symbol: "cardano",
    displayName: "ADA",
    color: "bg-purple-500",
    costPerCoin: 0.45,
    quantity: 3000,
  },
];

export default function CryptoWallet() {
  const cryptoData = useCryptoStore((state) => state.data);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const items = useMemo(() => {
    return portfolio.map((asset) => {
      //@ts-ignore
      const historyForOneDay = cryptoData[asset.symbol]?.[1] ?? [];
      const lastEntry = historyForOneDay[historyForOneDay.length - 1];
      const currentPrice = lastEntry ? lastEntry[asset.symbol] : 0;

      const totalCost = asset.costPerCoin * asset.quantity;
      const totalValue = currentPrice * asset.quantity;
      const profitLoss = totalValue - totalCost;
      const profitLossPct = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

      return {
        ...asset,
        currentPrice,
        totalCost,
        totalValue,
        profitLoss,
        profitLossPct,
      };
    });
  }, [cryptoData]);

  const publicAddressHook = usePublicAddress();

  useEffect(() => {
    (async () => {
      const pbAddr = (await publicAddressHook.fetchPublicAddress())
        ?.publicAddress;
      setWalletAddress(pbAddr ?? null);
    })();
  }, []);

  const totalPortfolioValue = useMemo(() => {
    return items.reduce((acc, item) => acc + item.totalValue, 0);
  }, [items]);

  const totalPortfolioCost = useMemo(() => {
    return items.reduce((acc, item) => acc + item.totalCost, 0);
  }, [items]);

  const totalProfitLoss = totalPortfolioValue - totalPortfolioCost;
  const totalProfitLossPct =
    totalPortfolioCost > 0 ? (totalProfitLoss / totalPortfolioCost) * 100 : 0;

  const handleOnrampClick = () => {
    const appId = "58a3fa2e-617f-4198-81e7-096f5e498c00";
    const destinationWallets = encodeURIComponent(
      JSON.stringify([
        {
          address: "0x4315d134aCd3221a02dD380ADE3aF39Ce219037c",
          blockchains: ["base"],
        },
      ]),
    );
    const defaultAsset = "ETH";
    const defaultPaymentMethod = "CARD";
    const fiatCurrency = "USD";
    const presetFiatAmount = 10;
    const quoteId = "your-quote-id-here";

    const onrampUrl = `https://pay.coinbase.com/buy/select-asset?appId=${appId}&destinationWallets=${destinationWallets}&defaultAsset=${defaultAsset}&defaultPaymentMethod=${defaultPaymentMethod}&fiatCurrency=${fiatCurrency}&presetFiatAmount=${presetFiatAmount}&quoteId=${quoteId}`;

    window.open(onrampUrl, "_blank");
  };

  return (
    <GlassCard>
      <div className="flex items-center justify-between p-6 border border-white/[0.05]">
        {/* Left side with wallet info */}
        <div className="space-y-2">
          {/* Updated wallet info header */}
          <div className="flex items-center">
            <span className="text-sm text-zinc-400 font-medium">
              Main Wallet
            </span>
            {walletAddress && (
              <span className="ml-1 text-xs text-zinc-300">
                ({walletAddress})
              </span>
            )}
          </div>
          <div className="flex items-center">
            <h1 className="text-2xl 2xl:text-4xl font-bold bg-gradient-to-r from-white to-zinc-200 bg-clip-text text-transparent">
              {totalPortfolioValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              USD
            </h1>
            <div className="ml-4 text-sm text-zinc-300">
              P/L:{" "}
              <span
                className={
                  totalProfitLoss >= 0 ? "text-[#00FFA3]" : "text-red-500"
                }
              >
                {totalProfitLoss.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                {"  "}({totalProfitLossPct.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center justify-center h-8 px-4 text-xs font-medium rounded-full",
              "border border-slate-800",
              "bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)]",
              "bg-[length:200%_100%] text-slate-400 animate-shimmer",
            )}
          >
            Connected to: Base-Sepolia
          </div>

          <Button
            onClick={handleOnrampClick}
            className="text-xs font-medium rounded-full bg-indigo-600 text-white h-8 px-4 hover:bg-[#0045D8]"
          >
            Add Funds
          </Button>
        </div>
      </div>

      {/* ... rest of your component remains unchanged ... */}
      <div className="space-y-4 backdrop-blur-sm bg-white/[0.02] p-6 border border-white/[0.05]">
        <div className="relative h-2 w-full flex overflow-hidden rounded-full">
          {items.map((asset) => {
            const distribution =
              totalPortfolioValue > 0
                ? (asset.totalValue / totalPortfolioValue) * 100
                : 0;

            return (
              <div
                key={asset.symbol}
                className="flex h-full"
                style={{ width: `${distribution}%` }}
              >
                {Array.from({ length: Math.floor(distribution / 3) }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-full",
                        asset.color,
                        "rounded-full backdrop-blur-xl",
                      )}
                      style={{
                        width: `calc(${100 / Math.floor(distribution / 3)}% - 2px)`,
                        marginRight: "2px",
                        opacity: 0.8,
                      }}
                    />
                  ),
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          {items.map((asset) => {
            const percentage =
              totalPortfolioValue > 0
                ? (asset.totalValue / totalPortfolioValue) * 100
                : 0;

            return (
              <div
                key={asset.symbol}
                className="flex items-center space-x-2 min-w-[140px]"
              >
                <span
                  className={cn(
                    "inline-block w-2 h-2 rounded-full opacity-80",
                    asset.color,
                  )}
                />
                <span className="text-zinc-300">
                  {asset.displayName}{" "}
                  <span className="text-zinc-500">
                    {asset.totalValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    {" USD"}
                  </span>{" "}
                  <span className="text-zinc-400">
                    ({percentage.toFixed(1)}%)
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
