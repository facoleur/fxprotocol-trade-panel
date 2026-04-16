import type { ReactNode } from "react";

export type TradeSide = "long" | "short";
export type TradeAction = "buy-open" | "sell-close";
export type OrderType = "market" | "limit";

export interface TokenOption {
  symbol: string;
  name: string;
  balance: string;
  usdPrice: number;
}

export interface InfoItem {
  id?: string;
  label: ReactNode | string;
  value: ReactNode | string | number | null | undefined;
  helper?: string;
  hidden?: boolean;
}
