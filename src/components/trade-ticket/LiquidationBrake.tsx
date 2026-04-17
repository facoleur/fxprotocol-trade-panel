"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ReactNode } from "react";
import { tradeMockData } from "./mockdata";
import type { TradeSide } from "./types";
import { formatCurrency } from "./utils";

export interface LiquidationBrakeEstimate {
  price: number;
  movePercent: number;
}

export function calculateLiquidationBrake({
  leverage,
  price,
  side,
}: {
  leverage: number;
  price: number;
  side: TradeSide;
}): LiquidationBrakeEstimate | null {
  if (!Number.isFinite(leverage) || leverage <= 0 || price <= 0) return null;

  const adverseMove =
    tradeMockData.risk.liquidationBrakeDistanceShare / leverage;
  const signedMove = side === "long" ? -adverseMove : adverseMove;

  return {
    price: price * (1 + signedMove),
    movePercent: signedMove * 100,
  };
}

export function formatLiquidationBrake(
  brake: LiquidationBrakeEstimate | null,
): ReactNode {
  if (!brake) return "-";

  const move = `${brake.movePercent >= 0 ? "+" : ""}${brake.movePercent.toFixed(
    2,
  )}%`;

  return (
    <>
      <span className="text-base-500">({move})</span>
      <span className="font-semibold text-base-700">
        {formatCurrency(brake.price)}
      </span>
    </>
  );
}

export function LiquidationBrakeLabel({
  showTooltip = true,
}: {
  showTooltip?: boolean;
}) {
  if (!showTooltip) return <span>Liquidation Brake</span>;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="underline decoration-base-500/70 decoration-dotted underline-offset-4"
          >
            Liquidation Brake
          </button>
        </TooltipTrigger>
        <TooltipContent className="text-sm border-base-400 bg-base-200 text-base-700">
          Automatic rebalance trigger before liquidation. If triggered, f(x)
          Protocol rebalances your position and pays a 2.5% bounty charged on
          the rebalanced position value.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
