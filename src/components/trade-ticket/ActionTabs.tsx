"use client";

import type { TradeAction } from "./types";
import { cx } from "./utils";

interface ActionTabsProps {
  value: TradeAction;
  onChange: (value: TradeAction) => void;
}

export function ActionTabs({ value, onChange }: ActionTabsProps) {
  const options: Array<{ value: TradeAction; label1: string; label2: string }> =
    [
      { value: "buy-open", label1: "Buy", label2: "Open" },
      { value: "sell-close", label1: "Sell", label2: "Close" },
    ];
  const activeIndex = options.findIndex((option) => option.value === value);

  return (
    <div className="relative grid grid-cols-2 overflow-hidden rounded-lg bg-primary-soft p-0.5 font-medium">
      <div
        aria-hidden="true"
        className={cx(
          "absolute left-0.5 top-0.5 h-[calc(100%-4px)] w-[calc(50%-2px)] rounded-md bg-primary transition-transform duration-150 ease-out",
          activeIndex === 1 && "translate-x-full",
        )}
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cx(
            "relative z-10 h-9 rounded-md text-sm font-medium! transition-colors duration-150 ease-out",
            value === option.value
              ? "text-base-700"
              : "text-base-500 hover:text-base-700",
          )}
        >
          <span className="mr-1">{option.label1}</span>
          <span className="opacity-50">{option.label2}</span>
        </button>
      ))}
    </div>
  );
}
