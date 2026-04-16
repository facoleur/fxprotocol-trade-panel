"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";
import styles from "./LeverageSelector.module.css";
import { formatLeverage, sanitizeDecimalInput } from "./utils";

interface LeverageSelectorProps {
  value: number;
  inputValue: string;
  min: number;
  max: number;
  step: number;
  marks: number[];
  onChange: (value: number) => void;
  onInputChange: (value: string) => void;
  error?: string | null;
}

export function LeverageSelector({
  value,
  inputValue,
  min,
  max,
  step,
  marks,
  onChange,
  onInputChange,
  error,
}: LeverageSelectorProps) {
  const rangeValue = Math.min(max, Math.max(min, value || min));
  const progress = ((rangeValue - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="text-base font-medium text-base-500">Leverage</span>
        <label className="relative block w-20">
          <Input
            aria-label="Leverage value"
            inputMode="decimal"
            value={inputValue}
            onChange={(event) =>
              onInputChange(sanitizeDecimalInput(event.target.value))
            }
            className="h-9 rounded-md border-base-400 bg-base-200 pr-6 text-right text-sm font-semibold text-base-700 shadow-none transition duration-150 ease-out focus-visible:border-primary focus-visible:bg-base-100/40 focus-visible:ring-0"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold text-base-500">
            x
          </span>
        </label>
      </div>

      <input
        aria-label="Leverage"
        type="range"
        min={min}
        max={max}
        step={step}
        value={rangeValue}
        onChange={(event) => onChange(Number(event.target.value))}
        className={styles.range}
        style={{ "--leverage-progress": `${progress}%` } as CSSProperties}
      />

      <div className="relative mt-4 h-5 text-sm font-semibold">
        {marks.map((mark) => (
          <button
            key={mark}
            type="button"
            onClick={() => onChange(mark)}
            className={cn(
              "absolute top-0 -translate-x-1/2 rounded-sm px-1 hover:bg-base-300",
              mark === min && "translate-x-0",
              mark === max && "-translate-x-full",
              rangeValue >= mark
                ? "text-base-700 transition duration-150 ease-out"
                : "text-base-500 transition duration-150 ease-out",
            )}
            style={{
              left: `${((mark - min) / (max - min)) * 100}%`,
            }}
          >
            {formatLeverage(mark).toUpperCase()}
          </button>
        ))}
      </div>

      {error ? (
        <div className="mt-2 text-xs font-semibold text-short">{error}</div>
      ) : null}
    </div>
  );
}
