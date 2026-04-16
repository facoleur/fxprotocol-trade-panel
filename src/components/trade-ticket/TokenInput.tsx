"use client";

import type { TokenOption } from "./types";
import { cx, formatCurrency, sanitizeDecimalInput, toNumber } from "./utils";

interface TokenInputProps {
  label: string;
  value: string;
  selectedToken: string;
  tokens: TokenOption[];
  onValueChange: (value: string) => void;
  onTokenChange: (symbol: string) => void;
  balanceLabel?: string;
  placeholder?: string;
  showLabel?: boolean;
  showMaxButton?: boolean;
  showTokenSelector?: boolean;
  showBalance?: boolean;
  showUsdValue?: boolean;
  onMaxClick?: () => void;
  className?: string;
}

export function TokenInput({
  label,
  value,
  selectedToken,
  tokens,
  onValueChange,
  onTokenChange,
  balanceLabel,
  placeholder = "-",
  showLabel = true,
  showMaxButton = true,
  showTokenSelector = true,
  showBalance = true,
  showUsdValue = false,
  onMaxClick,
  className,
}: TokenInputProps) {
  const token = tokens.find((item) => item.symbol === selectedToken) ?? tokens[0];
  const usdValue = formatCurrency(toNumber(value) * token.usdPrice);

  return (
    <div
      className={cx(
        "rounded-md border border-base-400 bg-base-200 px-5 py-4",
        "focus-within:border-primary-soft focus-within:bg-base-300/50",
        className,
      )}
    >
      <div className="mb-3 flex min-h-5 items-center justify-between gap-3">
        {showLabel ? (
          <label className="text-sm font-medium text-base-500">{label}</label>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3 text-sm">
          {showBalance && balanceLabel ? (
            <span className="text-base-500">{balanceLabel}</span>
          ) : null}
          {showMaxButton && onMaxClick ? (
            <button
              type="button"
              onClick={onMaxClick}
              className="font-semibold text-primary-strong hover:text-base-700"
            >
              MAX
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onValueChange(sanitizeDecimalInput(event.target.value))}
          className="min-w-0 flex-1 bg-transparent text-2xl font-semibold text-base-700 outline-none placeholder:text-base-500"
        />

        {showTokenSelector ? (
          <select
            value={selectedToken}
            onChange={(event) => onTokenChange(event.target.value)}
            className="h-10 rounded-md border border-base-400 bg-base-300 px-3 text-sm font-semibold text-base-600 outline-none transition hover:border-primary-soft focus:border-primary-soft"
          >
            {tokens.map((item) => (
              <option key={item.symbol} value={item.symbol}>
                {item.symbol}
              </option>
            ))}
          </select>
        ) : (
          <span className="rounded-md bg-base-300 px-3 py-2 text-sm font-semibold text-base-600">
            {selectedToken}
          </span>
        )}
      </div>

      {showUsdValue ? (
        <div className="mt-2 text-xs font-medium text-base-500">{usdValue}</div>
      ) : null}
    </div>
  );
}
