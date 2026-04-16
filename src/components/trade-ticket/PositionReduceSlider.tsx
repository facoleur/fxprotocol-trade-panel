"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";
import styles from "./LeverageSelector.module.css";
import { sanitizeDecimalInput } from "./utils";

interface PositionReduceSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function PositionReduceSlider({
  value,
  onChange,
}: PositionReduceSliderProps) {
  const marks = [0, 25, 50, 75, 100];
  const progress = Math.min(100, Math.max(0, value));
  const inputValue = Math.round(progress).toString();

  function handleInputChange(nextValue: string) {
    if (nextValue === "") {
      onChange(0);
      return;
    }

    const numericValue = Number(nextValue);
    const clampedValue = Math.min(100, Math.max(0, numericValue));

    onChange(clampedValue);
  }

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between gap-3">
        <span className="text-base font-medium text-base-500">Position</span>
        <label className="relative block w-20">
          <Input
            aria-label="Position percentage to reduce"
            inputMode="decimal"
            value={inputValue}
            onChange={(event) =>
              handleInputChange(sanitizeDecimalInput(event.target.value))
            }
            className="h-9 rounded-md border-base-400 bg-base-200 pr-6 text-right text-sm font-semibold text-base-700 shadow-none transition duration-150 ease-out focus-visible:border-primary focus-visible:bg-base-100/40 focus-visible:ring-0"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold text-base-500">
            %
          </span>
        </label>
      </div>

      <input
        aria-label="Position percentage to reduce"
        type="range"
        min={0}
        max={100}
        step={1}
        value={progress}
        onChange={(event) => onChange(Number(event.target.value))}
        className={styles.range}
        style={{ "--leverage-progress": `${progress}%` } as CSSProperties}
      />

      <div className="mt-4 grid grid-cols-5 text-sm font-semibold">
        {marks.map((mark) => (
          <button
            key={mark}
            type="button"
            onClick={() => onChange(mark)}
            className={cn(
              progress >= mark
                ? "text-center text-base-700 transition duration-150 ease-out"
                : "text-center text-base-500 transition duration-150 ease-out",
              "rounded-sm hover:bg-base-300",
            )}
          >
            {mark}%
          </button>
        ))}
      </div>
    </div>
  );
}
