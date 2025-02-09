"use client";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CryptoWidgetProps {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  iconPath: string;
  iconColor: string;
}

export function CryptoWidget({
  symbol,
  name,
  price,
  change24h,
  iconPath,
  iconColor,
}: CryptoWidgetProps) {
  const isPositive = change24h >= 0;

  return (
    <div className="flex items-center justify-between p-4 w-full max-w-md animate-shimmer border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,65%,#000103)] bg-[length:200%_100%] px-4 font-medium text-slate-400 transition-colors rounded-lg">
      <div className="flex items-center gap-3">
        <div className={cn("flex items-center justify-center", iconColor)}>
          <Image
            src={iconPath || "/placeholder.svg"}
            alt={name}
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-sm text-muted-foreground">({symbol})</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-medium tabular-nums">${price}</span>
        <span
          className={cn(
            "flex items-center text-sm font-medium gap-0.5",
            isPositive ? "text-[#00FFA3]" : "text-red-500",
          )}
        >
          {isPositive ? (
            <ArrowUpIcon className="h-3 w-3" />
          ) : (
            <ArrowDownIcon className="h-3 w-3" />
          )}
          {Math.abs(change24h).toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
