"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  CodeIcon,
} from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/GlassCard";

interface Transaction {
  id: string;
  type: "receive" | "send" | "contract" | "swap";
  amount: string;
  token: string;
  address: string;
  timestamp: string;
  hash: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    type: "receive",
    amount: "+0.45",
    token: "ETH",
    address: "0x1234...5678",
    timestamp: "3 Jan 15:41",
    hash: "0xabc...def",
  },
  {
    id: "2",
    type: "contract",
    amount: "-0.12",
    token: "ETH",
    address: "UniswapV3",
    timestamp: "2 Jan 20:53",
    hash: "0x123...789",
  },
  {
    id: "3",
    type: "send",
    amount: "-1250",
    token: "USDT",
    address: "0x8765...4321",
    timestamp: "1 Jan 11:09",
    hash: "0xdef...abc",
  },
];

// Create a mapping for each transaction type to its icon and custom bg color.
const transactionStyles = {
  receive: {
    icon: <ArrowDownIcon className="h-4 w-4 text-emerald-500" />,
    bg: "bg-emerald-500/20", // Custom background color for receive
  },
  send: {
    icon: <ArrowUpIcon className="h-4 w-4 text-red-500" />,
    bg: "bg-red-500/20", // Custom background color for send
  },
  contract: {
    icon: <CodeIcon className="h-4 w-4 text-blue-500" />,
    bg: "bg-blue-500/20", // Custom background color for contract
  },
  swap: {
    icon: <ArrowRightIcon className="h-4 w-4 text-purple-500" />,
    bg: "bg-purple-500/20", // Custom background color for swap
  },
};

export default function CryptoTransactions() {
  return (
    <GlassCard>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-zinc-100">Transactions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {transactions.map((transaction) => {
          // Extract the corresponding icon and background color from our mapping
          const { icon, bg } = transactionStyles[transaction.type];

          return (
            <div
              key={transaction.id}
              className="grid grid-cols-[25px_1fr_auto] items-center gap-4"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-md ${bg}`}
              >
                {icon}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none text-zinc-100">
                  {transaction.address}
                </p>
                <p className="text-xs text-zinc-400">Tx: {transaction.hash}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p
                  className={`text-sm font-medium ${
                    transaction.amount.startsWith("+")
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {transaction.amount} {transaction.token}
                </p>
                <p className="text-xs text-zinc-400">{transaction.timestamp}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </GlassCard>
  );
}
