"use client";

import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";
import styles from "./LeverageSelector.module.css";

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

  return (
    <div>
      <div className="flex items-center gap-3">
        <input
          aria-label="Position percentage to reduce"
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className={styles.range}
          style={{ "--leverage-progress": `${progress}%` } as CSSProperties}
        />
        <span className="text-base font-semibold text-base-700">
          {Math.round(value)}%
        </span>
      </div>
      <div className="mt-4 grid grid-cols-5 text-sm font-semibold">
        {marks.map((mark) => (
          <button
            key={mark}
            type="button"
            onClick={() => onChange(mark)}
            className={cn(
              value >= mark
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
