"use client";

import type { CSSProperties } from "react";
import styles from "./LeverageSelector.module.css";

interface PositionReduceSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function PositionReduceSlider({ value, onChange }: PositionReduceSliderProps) {
  const marks = [0, 25, 50, 75, 100];
  const progress = Math.min(100, Math.max(0, value));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-base font-medium text-base-500">Position to reduce</span>
        <span className="text-base font-semibold text-base-700">
          {Math.round(value)}%
        </span>
      </div>
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
      <div className="mt-3 grid grid-cols-5 text-sm font-semibold">
        {marks.map((mark) => (
          <button
            key={mark}
            type="button"
            onClick={() => onChange(mark)}
            className={
              value >= mark
                ? "text-center text-primary-strong transition duration-150 ease-out first:text-left last:text-right"
                : "text-center text-base-500 transition duration-150 ease-out hover:text-base-700 first:text-left last:text-right"
            }
          >
            {mark}%
          </button>
        ))}
      </div>
    </div>
  );
}
