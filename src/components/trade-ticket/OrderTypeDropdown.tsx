"use client";

import type { OrderType } from "./types";

interface OrderTypeDropdownProps {
  value: OrderType;
  options: Array<{ value: OrderType; label: string }>;
  onChange: (value: OrderType) => void;
}

export function OrderTypeDropdown({
  value,
  options,
  onChange,
}: OrderTypeDropdownProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-base-500">Order type</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as OrderType)}
        className="h-11 w-full rounded-md border border-base-400 bg-base-200 px-3 text-base font-semibold text-base-700 outline-none transition hover:border-primary-soft focus:border-primary-soft"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
