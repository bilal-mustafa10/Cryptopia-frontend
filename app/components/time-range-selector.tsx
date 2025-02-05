"use client";

import { cn } from "@/lib/utils";

const timeRanges = [
  { value: "1D", label: "1D" },
  { value: "7D", label: "7D" },
  { value: "1M", label: "1M" },
  { value: "1Y", label: "1Y" },
];

interface TimeRangeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function TimeRangeSelector({
  value,
  onValueChange,
}: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-1">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onValueChange(range.value)}
          className={cn(
            "px-3 py-1 text-sm font-medium rounded-md transition-colors",
            value === range.value
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
