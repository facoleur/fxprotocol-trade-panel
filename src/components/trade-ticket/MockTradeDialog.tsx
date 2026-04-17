"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import {
  calculateLiquidationBrake,
  LiquidationBrakeLabel,
} from "./LiquidationBrake";
import { tradeMockData } from "./mockdata";
import type { TokenOption, TradeAction, TradeSide } from "./types";
import { formatCurrency, toNumber } from "./utils";

interface MockTradeDialogProps {
  open: boolean;
  onClose: () => void;
  action: TradeAction;
  side: TradeSide;
  orderPrice: number;
  leverage: number;
  createNewPosition: boolean;
  deposit: string;
  depositAsset: TokenOption;
  size: string;
  sizeAsset: TokenOption;
  reduceAmount: string;
  receiveAmount: string;
  closeReceiveAsset: TokenOption;
  currentPositionSize: string;
  currentPositionLeverage: number;
  currentLiquidationBrake: number;
}

function getTokenIconSrc(symbol: string) {
  const normalizedSymbol = symbol.toLowerCase();

  if (normalizedSymbol.includes("eth")) return "/eth.png";
  if (normalizedSymbol === "usdc") return "/usdc.png";
  if (normalizedSymbol === "fxusd") return "/fxusd.png";

  return null;
}

function PreviewTokenIcon({ symbol }: { symbol: string }) {
  const src = getTokenIconSrc(symbol);

  if (!src) return null;

  return (
    <Image
      src={src}
      alt=""
      width={20}
      height={20}
      aria-hidden="true"
      className="size-5 shrink-0 rounded-full object-cover"
    />
  );
}

function PreviewAmountBlock({
  label,
  amount,
  symbol,
  usdValue,
}: {
  label: string;
  amount: string;
  symbol: string;
  usdValue: number;
}) {
  return (
    <div className="rounded-md border border-base-400 bg-base-200 px-4 py-4 flex flex-col gap-2">
      <div className=" flex items-center justify-between ">
        <div className="text-sm font-medium text-base-500">{label}</div>
        <div className="shrink-0 text-sm font-medium text-base-500">
          {formatCurrency(usdValue)}
        </div>
      </div>
      <div className="flex min-w-0 items-center gap-2 text-2xl font-semibold text-base-700">
        <PreviewTokenIcon symbol={symbol} />
        <span className="min-w-0 truncate">
          {amount || "0"} <span className="text-base-500">{symbol}</span>
        </span>
      </div>
    </div>
  );
}

function FxProtocolRouteIcon() {
  return (
    <Image
      src="/fx.png"
      width={24}
      height={24}
      alt=""
      aria-hidden="true"
      className="size-5 shrink-0 rounded-full object-contain"
    />
  );
}

function PreviewInfoValue({ children }: { children: ReactNode }) {
  return (
    <dd className="min-w-0 text-right text-base font-semibold text-base-700">
      {children}
    </dd>
  );
}

function PreviewInfoRow({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-base w-48 font-medium text-base-500">{label}</dt>
      <PreviewInfoValue>{children}</PreviewInfoValue>
    </div>
  );
}

function TransitionValue({ from, to }: { from: string; to: string }) {
  return (
    <span className="grid w-84 max-w-full grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)] items-baseline gap-1 whitespace-nowrap text-right tabular-nums">
      <span className="truncate text-base-500" title={from}>
        {from}
      </span>
      <span className="text-center text-base-500">-&gt;</span>
      <span className="truncate" title={to}>
        {to}
      </span>
    </span>
  );
}

function FeeValue({ fee, feeRate }: { fee: number; feeRate: number }) {
  return (
    <span className="inline-flex items-baseline justify-end gap-1">
      <span className="text-base-500">({(feeRate * 100).toFixed(1)}%)</span>
      <span>{formatCurrency(fee)}</span>
    </span>
  );
}

function ShowMoreButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-base-400" />
      <button
        type="button"
        onClick={onClick}
        className="inline-flex shrink-0 items-center gap-1.5 rounded px-2 py-1 text-sm font-semibold text-base-500 transition duration-150 ease-out hover:bg-base-300 hover:text-base-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong"
      >
        {open ? "Show less" : "Show more"}
        <svg
          viewBox="0 0 16 16"
          className={open ? "size-4 rotate-180" : "size-4"}
          aria-hidden="true"
        >
          <path
            d="m4 6 4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
        </svg>
      </button>
      <div className="h-px flex-1 bg-base-400" />
    </div>
  );
}

export function MockTradeDialog({
  open,
  onClose,
  action,
  side,
  orderPrice,
  leverage,
  createNewPosition,
  deposit,
  depositAsset,
  size,
  sizeAsset,
  reduceAmount,
  receiveAmount,
  closeReceiveAsset,
  currentPositionSize,
  currentPositionLeverage,
  currentLiquidationBrake,
}: MockTradeDialogProps) {
  const [showMore, setShowMore] = useState(false);
  const depositUsd = toNumber(deposit) * depositAsset.usdPrice;
  const positionUsd = toNumber(size) * sizeAsset.usdPrice;
  const reduceUsd = toNumber(reduceAmount) * sizeAsset.usdPrice;
  const receiveUsd = toNumber(receiveAmount) * closeReceiveAsset.usdPrice;
  const currentPositionUsd = toNumber(currentPositionSize) * sizeAsset.usdPrice;
  const nextOpenPositionUsd = positionUsd;
  const nextClosePositionUsd = Math.max(0, currentPositionUsd - reduceUsd);
  const fee =
    action === "buy-open"
      ? positionUsd * tradeMockData.market.feeRate
      : receiveUsd * tradeMockData.market.closeFeeRate;
  const feeRate =
    action === "buy-open"
      ? tradeMockData.market.feeRate
      : tradeMockData.market.closeFeeRate;
  const openLiquidationBrakeEstimate = calculateLiquidationBrake({
    leverage,
    price: orderPrice,
    side,
  });
  const closeLiquidationBrakeEstimate = calculateLiquidationBrake({
    leverage: currentPositionLeverage,
    price: orderPrice,
    side,
  });
  const positionSizeTransition =
    action === "buy-open"
      ? {
          from: "$0",
          to: formatCurrency(nextOpenPositionUsd),
        }
      : {
          from: formatCurrency(currentPositionUsd),
          to: formatCurrency(nextClosePositionUsd),
        };
  const liquidationBrakeTransition =
    action === "buy-open"
      ? {
          from: "$0",
          to: openLiquidationBrakeEstimate
            ? formatCurrency(openLiquidationBrakeEstimate.price)
            : "-",
        }
      : {
          from: formatCurrency(currentLiquidationBrake),
          to: closeLiquidationBrakeEstimate
            ? formatCurrency(closeLiquidationBrakeEstimate.price)
            : "-",
        };
  const previewPrimaryBlocks =
    action === "buy-open"
      ? [
          {
            label: "Deposit",
            amount: deposit,
            symbol: depositAsset.symbol,
            usdValue: depositUsd,
          },
          {
            label: createNewPosition ? "Open Position" : "Add to Position",
            amount: size,
            symbol: sizeAsset.symbol,
            usdValue: positionUsd,
          },
        ]
      : [
          {
            label: "Reduce",
            amount: reduceAmount,
            symbol: sizeAsset.symbol,
            usdValue: reduceUsd,
          },
          {
            label: "Receive",
            amount: receiveAmount,
            symbol: closeReceiveAsset.symbol,
            usdValue: receiveUsd,
          },
        ];

  return (
    <Dialog open={open} title="Trade summary" onClose={onClose}>
      <div className="space-y-4">
        <div className="space-y-1">
          {previewPrimaryBlocks.map((block) => (
            <PreviewAmountBlock
              key={block.label}
              label={block.label}
              amount={block.amount}
              symbol={block.symbol}
              usdValue={block.usdValue}
            />
          ))}
        </div>

        <ShowMoreButton
          open={showMore}
          onClick={() => setShowMore((current) => !current)}
        />

        <dl className="space-y-3">
          <PreviewInfoRow label="Position Size">
            <TransitionValue
              from={positionSizeTransition.from}
              to={positionSizeTransition.to}
            />
          </PreviewInfoRow>
          <PreviewInfoRow label={<LiquidationBrakeLabel showTooltip={false} />}>
            <TransitionValue
              from={liquidationBrakeTransition.from}
              to={liquidationBrakeTransition.to}
            />
          </PreviewInfoRow>
          <PreviewInfoRow label="Position Leverage">
            {action === "buy-open"
              ? leverage.toFixed(2)
              : currentPositionLeverage.toFixed(2)}
          </PreviewInfoRow>
        </dl>

        {showMore ? (
          <>
            <dl className="space-y-3">
              <PreviewInfoRow label="Execution Price">
                {orderPrice > 0 ? formatCurrency(orderPrice) : "$0"}
              </PreviewInfoRow>
            </dl>

            <div className="border-t border-base-400" />

            <dl className="space-y-3">
              <PreviewInfoRow label="Route">
                <span className="inline-flex items-center justify-end gap-2">
                  <FxProtocolRouteIcon />
                  <span>fxprotocol</span>
                </span>
              </PreviewInfoRow>
              <PreviewInfoRow label="Slippage">0.3%</PreviewInfoRow>
              <PreviewInfoRow label="Fee">
                <FeeValue fee={fee} feeRate={feeRate} />
              </PreviewInfoRow>
            </dl>
          </>
        ) : null}

        <Button size="lg" className="h-16! w-full" onClick={onClose}>
          Confirm mock trade
        </Button>
      </div>
    </Dialog>
  );
}
