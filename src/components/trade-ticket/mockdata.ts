import type { OrderType, TokenOption } from "./types";

export const tradeTokens: TokenOption[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: "3.2845",
    usdPrice: 2331.2,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: "12840.52",
    usdPrice: 1,
  },
  {
    symbol: "fxUSD",
    name: "FX USD",
    balance: "7420.18",
    usdPrice: 1,
  },
  {
    symbol: "ETH",
    name: "Long Ethereum",
    balance: "0.1842",
    usdPrice: 2331.2,
  },
  {
    symbol: "ETH",
    name: "Short Ethereum",
    balance: "0.1268",
    usdPrice: 2331.2,
  },
];

const ethQuoteToken = tradeTokens[0];
const usdcQuoteToken = tradeTokens[1];
const fxUsdQuoteToken = tradeTokens[2];
const longEthToken = tradeTokens[3];
const shortEthToken = tradeTokens[4];

export const depositTokens = [ethQuoteToken, usdcQuoteToken, fxUsdQuoteToken];

export const tradeMockData = {
  account: {
    balanceLabel: "Balance",
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
    currentPrice: 2331.2,
    indexPrice: 2329.74,
    fundingRate: "0.0104% / 8h",
    feeRate: 0.003,
    closeFeeRate: 0.001,
    minOrderUsd: 10,
  },
  risk: {
    // Brake triggers after this share of the adverse move to theoretical liquidation.
    liquidationBrakeDistanceShare: 0.3,
    liquidationBrakeBountyRate: 0.025,
  },
  markets: {
    long: {
      label: "ETH",
      baseToken: longEthToken,
      quoteToken: ethQuoteToken,
      position: {
        size: "0.1842",
        leverage: 6.29,
        liquidationBrake: 2214.85,
        liquidationMovePercent: -4.41,
      },
    },
    short: {
      label: "ETH",
      baseToken: shortEthToken,
      quoteToken: fxUsdQuoteToken,
      position: {
        size: "0.1268",
        leverage: 5.84,
        liquidationBrake: 2446.6,
        liquidationMovePercent: 4.95,
      },
    },
  },
  leverage: {
    min: 1.2,
    max: 7,
    step: 0.1,
    marks: [1.2, 2, 3, 4, 5, 6, 7],
    maxLabel: "Max leverage: 7x",
  },
  orderTypes: [
    { value: "market", label: "Market" },
    { value: "limit", label: "Limit" },
  ] satisfies Array<{ value: OrderType; label: string }>,
};
