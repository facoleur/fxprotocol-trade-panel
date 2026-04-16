"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReactNode } from "react";
import type { TokenOption } from "./types";
import { cx, formatCurrency, sanitizeDecimalInput, toNumber } from "./utils";

interface TokenInputProps {
  label: string;
  value: string;
  selectedToken: string;
  tokens: TokenOption[];
  onValueChange: (value: string) => void;
  onTokenChange: (symbol: string) => void;
  balanceLabel?: ReactNode;
  placeholder?: string;
  showLabel?: boolean;
  showMaxButton?: boolean;
  showTokenSelector?: boolean;
  showBalance?: boolean;
  showUsdValue?: boolean;
  onMaxClick?: () => void;
  className?: string;
  error?: string | null;
  displaySymbol?: string;
}

export function TokenInput({
  label,
  value,
  selectedToken,
  tokens,
  onValueChange,
  onTokenChange,
  balanceLabel,
  placeholder = "0",
  showLabel = true,
  showMaxButton = true,
  showTokenSelector = true,
  showBalance = true,
  showUsdValue = true,
  onMaxClick,
  className,
  error,
  displaySymbol,
}: TokenInputProps) {
  const token =
    tokens.find((item) => item.symbol === selectedToken) ?? tokens[0];
  const usdValue = formatCurrency(toNumber(value) * token.usdPrice);
  const amountDisplay = value || placeholder;
  const inlineSymbol = displaySymbol ?? token.symbol;

  return (
    <div
      className={cx(
        "group rounded-md border border-base-400 bg-base-200 px-5 py-4 hover:border-base-500/50!",
        "focus-within:border-primary focus-within:bg-base-100/40",
        error && "border-short",
        className,
      )}
    >
      <div className="mb-3 flex min-h-5 items-center justify-between gap-3">
        {showLabel ? (
          <label className="text-sm font-medium text-base-500">{label}</label>
        ) : (
          <span />
        )}

        <div className="invisible flex items-center gap-3 text-sm group-focus-within:visible group-hover:visible">
          {showBalance && balanceLabel ? (
            <span className="text-base-500">{balanceLabel}</span>
          ) : null}
          {showMaxButton && onMaxClick ? (
            <button
              type="button"
              onClick={onMaxClick}
              className="rounded px-2 py-1 font-semibold text-base-600 transition duration-150 ease-out hover:bg-base-300 hover:text-base-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong"
            >
              MAX
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-0 flex min-w-0 items-center overflow-hidden text-2xl font-semibold">
            <span className={value ? "text-base-700" : "text-base-500"}>
              {amountDisplay}
            </span>
            <span className="ml-2 truncate text-base-500">{inlineSymbol}</span>
          </div>

          <input
            inputMode="decimal"
            value={value}
            aria-label={label}
            placeholder={placeholder}
            onChange={(event) =>
              onValueChange(sanitizeDecimalInput(event.target.value))
            }
            className="relative z-10 w-full min-w-0 bg-transparent text-2xl font-semibold text-transparent caret-base-700 outline-none placeholder:text-transparent"
          />
        </div>

        {showTokenSelector ? (
          <Select value={selectedToken} onValueChange={onTokenChange}>
            <SelectTrigger className="h-10 min-w-24 border-base-400 bg-base-300 text-sm font-semibold text-base-600 shadow-none hover:border-primary-soft focus-visible:border-primary-soft focus-visible:ring-primary-soft/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="border-base-400 bg-base-300 text-base-700 ring-base-400 min-w-24! w-24!"
            >
              {tokens.map((item) => (
                <SelectItem
                  key={item.symbol}
                  value={item.symbol}
                  textValue={item.symbol}
                  className="text-base-700 focus:bg-primary-soft focus:text-base-700 text-xs  min-w-22! w-22!"
                >
                  <span className="font-semibold">{item.symbol}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>

      {showUsdValue ? (
        <div className="mt-2 text-xs font-medium text-base-500">{usdValue}</div>
      ) : null}

      {error ? (
        <div className="mt-2 text-xs font-semibold text-short">{error}</div>
      ) : null}
    </div>
  );
}
