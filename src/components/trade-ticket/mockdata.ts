import type { OrderType, TokenOption } from "./types";

export const tradeTokens: TokenOption[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: "3.2845",
    usdPrice: 3247.92,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: "18420.00",
    usdPrice: 1,
  },
];

export const tradeMockData = {
  account: {
    balanceLabel: "Balance: 0",
  },
  defaults: {
    side: "long",
    action: "buy-open",
    orderType: "market" as OrderType,
    deposit: "",
    size: "",
    limitPrice: "3247.92",
    leverage: 6.15,
    createNewPosition: false,
  },
  market: {
    currentPrice: 3247.92,
    indexPrice: 3245.18,
    fundingRate: "0.0104% / 8h",
    feeRate: 0.003,
    minOrderUsd: 10,
  },
  leverage: {
    min: 1.2,
    max: 7,
    step: 0.05,
    marks: [1.2, 2, 3, 4, 5, 6, 7],
    maxLabel: "Max leverage: 7x",
  },
  orderTypes: [
    { value: "market", label: "Market" },
    { value: "limit", label: "Limit" },
  ] satisfies Array<{ value: OrderType; label: string }>,
};
