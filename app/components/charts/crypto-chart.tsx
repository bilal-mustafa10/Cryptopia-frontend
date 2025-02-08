"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { CryptoData } from "@/types/crypto";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface CryptoChartProps {
  data: CryptoData[];
  selectedCrypto: keyof Omit<CryptoData, "timestamp">;
  timeRange: string;
}

export function CryptoChart({
  data,
  selectedCrypto,
  timeRange,
}: CryptoChartProps) {
  const color = "hsl(159, 100%, 50%)"; // Mint color

  // Format date based on time range
  const formatDate = (timestamp: number, format: "axis" | "tooltip") => {
    const date = new Date(timestamp);

    switch (timeRange) {
      case "1D":
        return format === "axis"
          ? `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`
          : date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
      case "7D":
        return format === "axis"
          ? date.toLocaleDateString("en-US", { weekday: "short" })
          : date.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });
      case "1M":
        return format === "axis"
          ? date.toLocaleDateString("en-US", { day: "numeric" })
          : date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
      case "1Y":
        return format === "axis"
          ? date.toLocaleDateString("en-US", { month: "short" })
          : date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
      default:
        return format === "axis"
          ? date.toLocaleDateString("en-US", { month: "short" })
          : date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
    }
  };

  return (
    <ChartContainer
      config={{
        [selectedCrypto]: {
          label:
            selectedCrypto.charAt(0).toUpperCase() + selectedCrypto.slice(1),
          color: color,
        },
      }}
      className="h-[400px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id={`gradient-${selectedCrypto}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity={0.1} />
              <stop offset="100%" stopColor={color} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => formatDate(value, "axis")}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            minTickGap={30}
          />
          <YAxis
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            width={80}
            domain={["dataMin", "dataMax"]}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(
                  value: number | string | (number | string)[],
                  // name, entry, index
                ) => {
                  // Safely handle possible array input
                  const raw = Array.isArray(value) ? value[0] : value;
                  const numericValue = Number(raw);

                  return `$${numericValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`;
                }}
                labelFormatter={(label: number) => formatDate(label, "tooltip")}
              />
            }
          />
          <Area
            type="monotone"
            dataKey={selectedCrypto}
            stroke={color}
            fill={`url(#gradient-${selectedCrypto})`}
            strokeWidth={2}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
