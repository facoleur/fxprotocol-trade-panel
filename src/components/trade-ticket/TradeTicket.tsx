"use client";

import { useMemo, useState } from "react";
import { ActionTabs } from "./ActionTabs";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { IconButton } from "./IconButton";
import { InfoList } from "./InfoList";
import { LeverageSelector } from "./LeverageSelector";
import { LongShortTabs } from "./LongShortTabs";
import { OrderTypeDropdown } from "./OrderTypeDropdown";
import { TokenInput } from "./TokenInput";
import { tradeMockData, tradeTokens } from "./mockdata";
import type { InfoItem, OrderType, TradeAction, TradeSide } from "./types";
import { formatCurrency, toNumber } from "./utils";

export function TradeTicket() {
  const [side, setSide] = useState<TradeSide>("long");
  const [action, setAction] = useState<TradeAction>("buy-open");
  const [orderType, setOrderType] = useState<OrderType>(
    tradeMockData.defaults.orderType,
  );
  const [deposit, setDeposit] = useState(tradeMockData.defaults.deposit);
  const [size, setSize] = useState(tradeMockData.defaults.size);
  const [limitPrice, setLimitPrice] = useState(tradeMockData.defaults.limitPrice);
  const [depositToken, setDepositToken] = useState(tradeTokens[0].symbol);
  const [sizeToken, setSizeToken] = useState(tradeTokens[0].symbol);
  const [leverage, setLeverage] = useState(tradeMockData.defaults.leverage);
  const [createNewPosition, setCreateNewPosition] = useState(
    tradeMockData.defaults.createNewPosition,
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [inputOptions, setInputOptions] = useState({
    maxButton: true,
    tokenSelector: true,
    balance: true,
    usdValue: false,
  });

  const depositAsset =
    tradeTokens.find((token) => token.symbol === depositToken) ?? tradeTokens[0];
  const orderPrice =
    orderType === "market" ? tradeMockData.market.currentPrice : toNumber(limitPrice);
  const depositUsd = toNumber(deposit) * depositAsset.usdPrice;
  const derivedPositionUsd = depositUsd * leverage;
  const positionUsd = toNumber(size) > 0 ? toNumber(size) * depositAsset.usdPrice : derivedPositionUsd;
  const fee = positionUsd * tradeMockData.market.feeRate;

  const infoItems: InfoItem[] = useMemo(
    () => [
      {
        label: "Execution Price",
        value: orderPrice > 0 ? formatCurrency(orderPrice) : "$0",
      },
      {
        label: "Fee",
        value: (
          <>
            <span className="font-semibold text-base-700">{formatCurrency(fee)}</span>
            <span className="text-base-500">
              ({(tradeMockData.market.feeRate * 100).toFixed(1)}%)
            </span>
          </>
        ),
      },
      {
        label: "Index Price",
        value: formatCurrency(tradeMockData.market.indexPrice),
      },
      {
        label: "Funding",
        value: tradeMockData.market.fundingRate,
      },
    ],
    [fee, orderPrice],
  );

  function updateInputOption(option: keyof typeof inputOptions) {
    setInputOptions((current) => ({
      ...current,
      [option]: !current[option],
    }));
  }

  return (
    <>
      <section className="w-full max-w-[490px] rounded-lg border border-base-400 bg-base-200 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="w-9" />
          <div className="flex-1">
            <LongShortTabs value={side} onChange={setSide} />
          </div>
          <IconButton label="Trade settings" onClick={() => setSettingsOpen(true)}>
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
              <path
                d="M8.8 2.5h2.4l.4 2 1.6.7 1.7-1.1 1.7 1.7-1.1 1.7.7 1.6 2 .4v2.4l-2 .4-.7 1.6 1.1 1.7-1.7 1.7-1.7-1.1-1.6.7-.4 2H8.8l-.4-2-1.6-.7-1.7 1.1-1.7-1.7 1.1-1.7-.7-1.6-2-.4V9.5l2-.4.7-1.6-1.1-1.7 1.7-1.7 1.7 1.1 1.6-.7.4-2Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="10.7" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </IconButton>
        </div>

        <div className="space-y-5">
          <ActionTabs value={action} onChange={setAction} />

          <OrderTypeDropdown
            value={orderType}
            options={tradeMockData.orderTypes}
            onChange={setOrderType}
          />

          {orderType === "limit" ? (
            <TokenInput
              label="Limit Price"
              value={limitPrice}
              selectedToken="USDC"
              tokens={tradeTokens}
              onValueChange={setLimitPrice}
              onTokenChange={() => undefined}
              showMaxButton={false}
              showTokenSelector={false}
              showBalance={false}
              showUsdValue={false}
            />
          ) : null}

          <TokenInput
            label="Deposit: $-"
            value={deposit}
            selectedToken={depositToken}
            tokens={tradeTokens}
            onValueChange={setDeposit}
            onTokenChange={setDepositToken}
            balanceLabel={tradeMockData.account.balanceLabel}
            showMaxButton={inputOptions.maxButton}
            showTokenSelector={inputOptions.tokenSelector}
            showBalance={inputOptions.balance}
            showUsdValue={inputOptions.usdValue}
            onMaxClick={() => setDeposit(depositAsset.balance)}
          />

          <TokenInput
            label="Size: $-"
            value={size}
            selectedToken={sizeToken}
            tokens={tradeTokens}
            onValueChange={setSize}
            onTokenChange={setSizeToken}
            showMaxButton={false}
            showTokenSelector={inputOptions.tokenSelector}
            showBalance={false}
            showUsdValue={inputOptions.usdValue}
          />

          <LeverageSelector
            value={leverage}
            min={tradeMockData.leverage.min}
            max={tradeMockData.leverage.max}
            step={tradeMockData.leverage.step}
            marks={tradeMockData.leverage.marks}
            onChange={setLeverage}
          />

          <InfoList items={infoItems} />

          <label className="flex items-center justify-between gap-4 text-base font-medium text-base-500">
            <span>Create a New Position</span>
            <input
              type="checkbox"
              checked={createNewPosition}
              onChange={(event) => setCreateNewPosition(event.target.checked)}
              className="peer sr-only"
            />
            <span className="relative h-6 w-12 rounded-full bg-base-400 transition after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-base-700 after:transition peer-checked:bg-primary peer-checked:after:translate-x-6" />
          </label>

          <Button
            size="lg"
            className="w-full"
            onClick={() => setPreviewOpen(true)}
          >
            Preview
          </Button>
        </div>
      </section>

      <Dialog
        open={settingsOpen}
        title="Trade settings"
        onClose={() => setSettingsOpen(false)}
      >
        <div className="space-y-3">
          {(
            [
              ["maxButton", "Show MAX button"],
              ["tokenSelector", "Show token selector"],
              ["balance", "Show balance"],
              ["usdValue", "Show USD estimate"],
            ] as Array<[keyof typeof inputOptions, string]>
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-md bg-base-300 px-4 py-3 text-sm font-medium text-base-700"
            >
              {label}
              <input
                type="checkbox"
                checked={inputOptions[key]}
                onChange={() => updateInputOption(key)}
                className="size-4 accent-primary"
              />
            </label>
          ))}
        </div>
      </Dialog>

      <Dialog open={previewOpen} title="Order preview" onClose={() => setPreviewOpen(false)}>
        <div className="space-y-5">
          <InfoList
            items={[
              { label: "Direction", value: side === "long" ? "Long" : "Short" },
              { label: "Action", value: action === "buy-open" ? "Buy / Open" : "Sell / Close" },
              { label: "Order Type", value: orderType === "market" ? "Market" : "Limit" },
              {
                label: "Position Size",
                value: positionUsd > 0 ? formatCurrency(positionUsd) : "$0",
              },
              { label: "Leverage", value: `${leverage.toFixed(2)}x` },
              ...infoItems,
            ]}
          />
          <Button className="w-full" onClick={() => setPreviewOpen(false)}>
            Confirm mock trade
          </Button>
        </div>
      </Dialog>
    </>
  );
}
