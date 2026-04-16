"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <div>
      <span className="mb-2 block text-sm font-medium text-base-500">
        Order type
      </span>
      <Select
        value={value}
        onValueChange={(nextValue) => onChange(nextValue as OrderType)}
      >
        <SelectTrigger className="h-11 w-full border-base-400 bg-base-200 text-base font-semibold text-base-700 shadow-none hover:border-primary-soft focus-visible:border-primary-soft focus-visible:ring-primary-soft/40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="border-base-400 bg-base-300 text-base-700 ring-base-400"
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-base-700 focus:bg-primary-soft focus:text-base-700 "
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
