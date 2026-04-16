"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";
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

function getTokenIconSrc(symbol: string) {
  const normalizedSymbol = symbol.toLowerCase();

  if (normalizedSymbol.includes("eth")) return "/eth.png";
  if (normalizedSymbol === "usdc") return "/usdc.png";
  if (normalizedSymbol === "fxusd") return "/fxusd.png";

  return null;
}

function TokenIcon({ symbol }: { symbol: string }) {
  const src = getTokenIconSrc(symbol);

  if (!src) return null;

  return (
    <Image
      src={src}
      alt=""
      width={20}
      height={20}
      aria-hidden="true"
      className="size-4 shrink-0 rounded-full  object-cover"
    />
  );
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false);

  function handleContainerPointerDown(event: PointerEvent<HTMLDivElement>) {
    const target = event.target;

    if (!(target instanceof HTMLElement)) return;
    if (target.closest("button, input, [role='combobox']")) return;

    event.preventDefault();
    inputRef.current?.focus();
  }

  return (
    <div
      onPointerDown={handleContainerPointerDown}
      className={cx(
        "group rounded-md border border-base-400 bg-base-200 px-5 py-4",
        !tokenSelectorOpen && "hover:border-base-500/40!",
        "focus-within:border-primary focus-within:bg-base-100/40 focus-within:hover:border-primary!",
        tokenSelectorOpen &&
          "border-primary bg-base-100/40 hover:border-primary!",
        error && "border-short",
        className,
      )}
    >
      <div className="mb-1 flex min-h-5 items-center justify-between gap-3">
        {showLabel ? (
          <label className="text-sm font-medium text-base-500">{label}</label>
        ) : (
          <span />
        )}

        <div
          className={cx(
            "invisible flex items-center gap-3 text-sm group-focus-within:visible group-hover:visible",
            tokenSelectorOpen && "visible",
          )}
        >
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
            ref={inputRef}
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
          <Select
            value={selectedToken}
            onValueChange={onTokenChange}
            open={tokenSelectorOpen}
            onOpenChange={setTokenSelectorOpen}
          >
            <SelectTrigger className="h-8! min-w-24 border-none bg-base-300 text-sm font-semibold text-base-600 shadow-none hover:bg-base-400/75 focus-visible:border-primary-soft focus-visible:ring-primary-soft/40">
              <SelectValue>
                <span className="inline-flex items-center gap-1.5">
                  <TokenIcon symbol={token.symbol} />
                  <span>{token.symbol}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              // position="popper"
              className="border-base-400 bg-base-300 text-base-700 ring-base-400 min-w-32! w-32!"
            >
              {tokens.map((item) => (
                <SelectItem
                  key={item.symbol}
                  value={item.symbol}
                  textValue={item.symbol}
                  className="text-base-700 focus:bg-primary-soft focus:text-base-700 text-sm min-w-30! w-30!"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <TokenIcon symbol={item.symbol} />
                    <span className="font-semibold">{item.symbol}</span>
                  </span>
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
