"use client";

import type { TradeSide } from "./types";
import { cx } from "./utils";

interface LongShortTabsProps {
  value: TradeSide;
  onChange: (value: TradeSide) => void;
}

export function LongShortTabs({ value, onChange }: LongShortTabsProps) {
  const options: Array<{ value: TradeSide; label: string; color: string }> = [
    { value: "long", label: "Long", color: "text-long" },
    { value: "short", label: "Short", color: "text-short" },
  ];

  return (
    <div className="grid grid-cols-2 border-b border-base-400">
      {options.map((option) => {
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cx(
              "relative h-12 text-sm font-semibold transition hover:text-base-700",
              active ? option.color : "text-base-500",
              active &&
                "after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:bg-current",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
