"use client";

import type { TradeAction } from "./types";
import { cx } from "./utils";

interface ActionTabsProps {
  value: TradeAction;
  onChange: (value: TradeAction) => void;
}

export function ActionTabs({ value, onChange }: ActionTabsProps) {
  const options: Array<{ value: TradeAction; label: string }> = [
    { value: "buy-open", label: "Buy / Open" },
    { value: "sell-close", label: "Sell / Close" },
  ];

  return (
    <div className="grid grid-cols-2 rounded-md bg-primary-soft p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cx(
            "h-10 rounded-[5px] text-sm font-semibold transition",
            value === option.value
              ? "bg-primary text-base-700"
              : "text-base-500 hover:text-base-700",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
