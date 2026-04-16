"use client";

import type { CSSProperties } from "react";
import styles from "./LeverageSelector.module.css";
import { formatLeverage } from "./utils";

interface LeverageSelectorProps {
  value: number;
  min: number;
  max: number;
  step: number;
  marks: number[];
  onChange: (value: number) => void;
}

export function LeverageSelector({
  value,
  min,
  max,
  step,
  marks,
  onChange,
}: LeverageSelectorProps) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-base font-medium text-base-500">Leverage</span>
        <span className="text-base font-semibold text-base-700">
          {formatLeverage(value)}
        </span>
      </div>

      <input
        aria-label="Leverage"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={styles.range}
        style={{ "--leverage-progress": `${progress}%` } as CSSProperties}
      />

      <div className="mt-4 grid grid-cols-7 text-sm font-semibold text-base-500">
        {marks.map((mark) => (
          <span key={mark} className="text-center first:text-left last:text-right">
            {formatLeverage(mark).toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}
