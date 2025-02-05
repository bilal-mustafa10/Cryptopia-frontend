"use client";
import { cn } from "@/lib/utils";

const cryptos = [
  {
    value: "bitcoin",
    label: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    color: "text-[#F7931A]",
  },
  {
    value: "ethereum",
    label: "Ethereum",
    symbol: "ETH",
    icon: "Ξ",
    color: "text-[#627EEA]",
  },
  {
    value: "solana",
    label: "Solana",
    symbol: "SOL",
    icon: "◎",
    color: "text-[#00FFA3]",
  },
  {
    value: "cardano",
    label: "Cardano",
    symbol: "ADA",
    icon: "₳",
    color: "text-[#0033AD]",
  },
];

interface CryptoSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function CryptoSelector({ value, onValueChange }: CryptoSelectorProps) {
  return (
    <div className="flex gap-2">
      {cryptos.map((crypto) => (
        <button
          key={crypto.value}
          onClick={() => onValueChange(crypto.value)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
            value === crypto.value
              ? "bg-primary/10 text-primary"
              : "hover:bg-muted text-muted-foreground hover:text-foreground",
          )}
        >
          <span className={cn("text-lg font-medium", crypto.color)}>
            {crypto.icon}
          </span>
          <span className="font-medium">{crypto.symbol}</span>
        </button>
      ))}
    </div>
  );
}
