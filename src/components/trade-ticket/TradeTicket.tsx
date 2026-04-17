"use client";

import { useState } from "react";
import { ActionTabs } from "./ActionTabs";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { InfoList } from "./InfoList";
import { LeverageSelector } from "./LeverageSelector";
import {
  calculateLiquidationBrake,
  formatLiquidationBrake,
  LiquidationBrakeLabel,
} from "./LiquidationBrake";
import { LongShortTabs } from "./LongShortTabs";
import { MockTradeDialog } from "./MockTradeDialog";
import { OrderTypeDropdown } from "./OrderTypeDropdown";
import { PositionReduceSlider } from "./PositionReduceSlider";
import { TokenInput } from "./TokenInput";
import { depositTokens, tradeMockData, tradeTokens } from "./mockdata";
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
  const [depositTokenSymbol, setDepositTokenSymbol] = useState("ETH");
  const [reduceAmount, setReduceAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [receiveTokenSymbol, setReceiveTokenSymbol] = useState("ETH");
  const [reducePercent, setReducePercent] = useState(0);
  const [limitPrice, setLimitPrice] = useState(
    tradeMockData.defaults.limitPrice,
  );
  const [leverageInput, setLeverageInput] = useState(
    String(tradeMockData.defaults.leverage),
  );
  const createNewPosition = tradeMockData.defaults.createNewPosition;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [inputOptions, setInputOptions] = useState({
    maxButton: true,
    tokenSelector: true,
    balance: true,
    usdValue: true,
  });

  const sideMarket = tradeMockData.markets[side];
  const leverage = toNumber(leverageInput);
  const depositAsset =
    depositTokens.find((token) => token.symbol === depositTokenSymbol) ??
    depositTokens[0];
  const closeReceiveAsset =
    depositTokens.find((token) => token.symbol === receiveTokenSymbol) ??
    sideMarket.quoteToken;
  const sizeAsset = sideMarket.baseToken;
  const orderPrice =
    orderType === "market"
      ? tradeMockData.market.currentPrice
      : toNumber(limitPrice);
  const depositUsd = toNumber(deposit) * depositAsset.usdPrice;
  const positionUsd = toNumber(size) * sizeAsset.usdPrice;
  const fee = positionUsd * tradeMockData.market.feeRate;
  const closeFee =
    toNumber(receiveAmount) *
    closeReceiveAsset.usdPrice *
    tradeMockData.market.closeFeeRate;
  const minReceived = Math.max(
    0,
    toNumber(receiveAmount) * (1 - tradeMockData.market.closeFeeRate),
  );
  const maxPositionUsd = depositUsd * tradeMockData.leverage.max;
  const maxLeverageError =
    positionUsd > maxPositionUsd && depositUsd > 0
      ? `Size exceeds ${tradeMockData.leverage.max}x collateral.`
      : null;
  const missingCollateralError =
    positionUsd > 0 && depositUsd <= 0 ? "Enter collateral before size." : null;
  const leverageError =
    leverage > tradeMockData.leverage.max
      ? `Max leverage is ${tradeMockData.leverage.max}x.`
      : maxLeverageError;
  const sizeError = missingCollateralError ?? maxLeverageError;
  const maxReduceAmount = toNumber(sideMarket.position.size);
  const maxReceiveAmount =
    closeReceiveAsset.usdPrice > 0
      ? (maxReduceAmount * sizeAsset.usdPrice) / closeReceiveAsset.usdPrice
      : 0;
  const reduceOverAvailableTolerance = amountDisplayTolerance(maxReduceAmount);
  const receiveOverAvailableTolerance =
    amountDisplayTolerance(maxReceiveAmount);
  const reduceInputError =
    toNumber(reduceAmount) > maxReduceAmount + reduceOverAvailableTolerance
      ? `Max available is ${formatAmount(maxReduceAmount)} ${sizeAsset.symbol}.`
      : null;
  const receiveInputError =
    toNumber(receiveAmount) > maxReceiveAmount + receiveOverAvailableTolerance
      ? `Max available is ${formatAmount(maxReceiveAmount)} ${closeReceiveAsset.symbol}.`
      : null;
  const closeInputError = reduceInputError ?? receiveInputError;
  const canSubmit =
    action === "sell-close"
      ? !closeInputError && toNumber(reduceAmount) > 0
      : !sizeError && !leverageError && toNumber(size) > 0;
  const openLiquidationBrakeEstimate = calculateLiquidationBrake({
    leverage,
    price: orderPrice,
    side,
  });
  const closeLiquidationBrakeEstimate = calculateLiquidationBrake({
    leverage: sideMarket.position.leverage,
    price: orderPrice,
    side,
  });
  const openLiquidationBrakeText = formatLiquidationBrake(
    openLiquidationBrakeEstimate,
  );
  const closeLiquidationBrakeText = formatLiquidationBrake(
    closeLiquidationBrakeEstimate,
  );

  const infoItems: InfoItem[] = [
    {
      label: "Execution Price",
      value: orderPrice > 0 ? formatCurrency(orderPrice) : "$0",
    },
    {
      id: "liquidation-brake",
      label: <LiquidationBrakeLabel showTooltip={!previewOpen} />,
      value: openLiquidationBrakeText,
    },
    {
      label: "Fee",
      value: (
        <>
          <span className="text-base-500">
            ({(tradeMockData.market.feeRate * 100).toFixed(1)}%)
          </span>
          <span className="font-semibold text-base-700">
            {formatCurrency(fee)}
          </span>
        </>
      ),
    },
  ];
  const closeInfoItems: InfoItem[] = [
    {
      label: "Position Leverage",
      value: `${sideMarket.position.leverage.toFixed(2)}x`,
    },
    {
      label: "Execution Price",
      value: formatCurrency(orderPrice, { maximumFractionDigits: 1 }),
    },
    {
      id: "liquidation-brake",
      label: <LiquidationBrakeLabel showTooltip={!previewOpen} />,
      value: closeLiquidationBrakeText,
    },
    {
      label: "Fee",
      value: (
        <>
          <span className="font-semibold text-base-700">
            {formatCurrency(closeFee)}
          </span>
          <span className="text-base-500">
            ({(tradeMockData.market.closeFeeRate * 100).toFixed(1)}%)
          </span>
        </>
      ),
    },
    {
      label: "Min Received",
      value: `${formatAmount(minReceived)} ${closeReceiveAsset.symbol}`,
    },
  ];

  function updateInputOption(option: keyof typeof inputOptions) {
    setInputOptions((current) => ({
      ...current,
      [option]: !current[option],
    }));
  }

  function formatAmount(value: number) {
    if (!Number.isFinite(value) || value <= 0) return "";

    return Number(value.toFixed(value >= 1 ? 4 : 6)).toString();
  }

  function amountDisplayTolerance(value: number) {
    return value >= 1 ? 0.00005 : 0.0000005;
  }

  function amountForUsd(usdValue: number, usdPrice: number) {
    return formatAmount(usdPrice > 0 ? usdValue / usdPrice : 0);
  }

  function clampLeverage(value: number) {
    if (!Number.isFinite(value) || value <= 0)
      return tradeMockData.leverage.min;

    return Math.max(tradeMockData.leverage.min, value);
  }

  function quoteAmountForBase(baseAmount: number) {
    const grossUsd = baseAmount * sizeAsset.usdPrice;
    return amountForUsd(grossUsd, closeReceiveAsset.usdPrice);
  }

  function syncSizeFromCollateral(
    nextDeposit: string,
    nextLeverage = leverage,
  ) {
    const nextDepositUsd = toNumber(nextDeposit) * depositAsset.usdPrice;
    setSize(amountForUsd(nextDepositUsd * nextLeverage, sizeAsset.usdPrice));
  }

  function handleDepositChange(nextDeposit: string) {
    setDeposit(nextDeposit);
    syncSizeFromCollateral(nextDeposit);
  }

  function handleDepositTokenChange(nextSymbol: string) {
    const nextDepositAsset =
      depositTokens.find((token) => token.symbol === nextSymbol) ??
      depositTokens[0];

    setDepositTokenSymbol(nextSymbol);
    setSize(
      amountForUsd(
        toNumber(deposit) * nextDepositAsset.usdPrice * leverage,
        sizeAsset.usdPrice,
      ),
    );
  }

  function handleSizeChange(nextSize: string) {
    setSize(nextSize);

    const nextPositionUsd = toNumber(nextSize) * sizeAsset.usdPrice;
    if (depositUsd > 0) {
      setLeverageInput(formatAmount(nextPositionUsd / depositUsd));
    }
  }

  function handleMaxSizeClick() {
    const maxDeposit = depositAsset.balance;
    const maxLeverage = tradeMockData.leverage.max;
    const maxDepositUsd = toNumber(maxDeposit) * depositAsset.usdPrice;

    setDeposit(maxDeposit);
    setLeverageInput(formatAmount(maxLeverage));
    setSize(amountForUsd(maxDepositUsd * maxLeverage, sizeAsset.usdPrice));
  }

  function handleLeverageChange(nextLeverage: number) {
    const clampedLeverage = clampLeverage(nextLeverage);

    setLeverageInput(formatAmount(clampedLeverage));
    setSize(amountForUsd(depositUsd * clampedLeverage, sizeAsset.usdPrice));
  }

  function handleLeverageInputChange(nextLeverageInput: string) {
    setLeverageInput(nextLeverageInput);

    if (nextLeverageInput === "" || nextLeverageInput === ".") {
      setSize("");
      return;
    }

    const nextLeverage = Number(nextLeverageInput);
    if (!Number.isFinite(nextLeverage)) return;

    const clampedLeverage = clampLeverage(nextLeverage);

    setSize(amountForUsd(depositUsd * clampedLeverage, sizeAsset.usdPrice));
  }

  function handleSideChange(nextSide: TradeSide) {
    setSide(nextSide);
    setDepositTokenSymbol(nextSide === "long" ? "ETH" : "fxUSD");
    setReceiveTokenSymbol(nextSide === "long" ? "ETH" : "fxUSD");
    setSize("");
    setReduceAmount("");
    setReceiveAmount("");
    setReducePercent(0);
  }

  function syncReduceFromPercent(nextPercent: number) {
    const positionSize = toNumber(sideMarket.position.size);
    const nextReduceAmount = (positionSize * nextPercent) / 100;

    setReducePercent(nextPercent);
    setReduceAmount(formatAmount(nextReduceAmount));
    setReceiveAmount(quoteAmountForBase(nextReduceAmount));
  }

  function handleReduceAmountChange(nextReduceAmount: string) {
    const positionSize = toNumber(sideMarket.position.size);
    const nextPercent =
      positionSize > 0
        ? Math.min(100, (toNumber(nextReduceAmount) / positionSize) * 100)
        : 0;

    setReduceAmount(nextReduceAmount);
    setReducePercent(nextPercent);
    setReceiveAmount(quoteAmountForBase(toNumber(nextReduceAmount)));
  }

  function handleReceiveAmountChange(nextReceiveAmount: string) {
    const positionSize = toNumber(sideMarket.position.size);
    const grossUsd = toNumber(nextReceiveAmount) * closeReceiveAsset.usdPrice;
    const nextReduceAmount =
      sizeAsset.usdPrice > 0 ? grossUsd / sizeAsset.usdPrice : 0;
    const nextPercent =
      positionSize > 0
        ? Math.min(100, (nextReduceAmount / positionSize) * 100)
        : 0;

    setReceiveAmount(nextReceiveAmount);
    setReduceAmount(formatAmount(nextReduceAmount));
    setReducePercent(nextPercent);
  }

  function handleReceiveTokenChange(nextSymbol: string) {
    const nextReceiveAsset =
      depositTokens.find((token) => token.symbol === nextSymbol) ??
      depositTokens[0];

    setReceiveTokenSymbol(nextSymbol);
    setReceiveAmount(
      amountForUsd(
        toNumber(reduceAmount) * sizeAsset.usdPrice,
        nextReceiveAsset.usdPrice,
      ),
    );
  }

  const limitPriceInput =
    orderType === "limit" ? (
      <TokenInput
        label="Limit Price"
        value={limitPrice}
        selectedToken={
          action === "buy-open" ? depositAsset.symbol : closeReceiveAsset.symbol
        }
        tokens={tradeTokens}
        onValueChange={setLimitPrice}
        onTokenChange={() => undefined}
        showMaxButton={false}
        showTokenSelector={false}
        showBalance
        balanceLabel={
          <span className="inline-flex items-center gap-1.5">
            <span className="text-base-500/70">Market</span>
            <span>{formatCurrency(tradeMockData.market.currentPrice)}</span>
          </span>
        }
        showUsdValue={false}
      />
    ) : null;

  return (
    <>
      <section className="w-full max-w-122 rounded-xl border border-base-400 bg-base-200 p-4 shadow-2xl">
        {/* <IconButton
          label="Trade settings"
          onClick={() => setSettingsOpen(true)}
        >
          <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
            <path
              d="M8.8 2.5h2.4l.4 2 1.6.7 1.7-1.1 1.7 1.7-1.1 1.7.7 1.6 2 .4v2.4l-2 .4-.7 1.6 1.1 1.7-1.7 1.7-1.7-1.1-1.6.7-.4 2H8.8l-.4-2-1.6-.7-1.7 1.1-1.7-1.7 1.1-1.7-.7-1.6-2-.4V9.5l2-.4.7-1.6-1.1-1.7 1.7-1.7 1.7 1.1 1.6-.7.4-2Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <circle
              cx="10"
              cy="10.7"
              r="2.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
        </IconButton> */}
        <div className="mb-4 flex items-center justify-between">
          <div />
          <div className="flex-1">
            <LongShortTabs value={side} onChange={handleSideChange} />
          </div>
        </div>

        <div className="space-y-5">
          <ActionTabs value={action} onChange={setAction} />

          <OrderTypeDropdown
            value={orderType}
            options={tradeMockData.orderTypes}
            onChange={setOrderType}
          />

          {action === "buy-open" ? (
            <>
              <div className="space-y-1">
                <TokenInput
                  label="Deposit"
                  value={deposit}
                  selectedToken={depositAsset.symbol}
                  tokens={depositTokens}
                  onValueChange={handleDepositChange}
                  onTokenChange={handleDepositTokenChange}
                  balanceLabel={`${tradeMockData.account.balanceLabel}: ${depositAsset.balance}`}
                  showMaxButton={inputOptions.maxButton}
                  showTokenSelector={inputOptions.tokenSelector}
                  showBalance={inputOptions.balance}
                  showUsdValue={inputOptions.usdValue}
                  onMaxClick={() => handleDepositChange(depositAsset.balance)}
                />

                <TokenInput
                  label="Size"
                  value={size}
                  selectedToken={sizeAsset.symbol}
                  tokens={[sizeAsset]}
                  onValueChange={handleSizeChange}
                  onTokenChange={() => undefined}
                  showMaxButton={inputOptions.maxButton}
                  showTokenSelector={false}
                  showBalance={false}
                  showUsdValue={inputOptions.usdValue}
                  onMaxClick={handleMaxSizeClick}
                  error={sizeError}
                  displaySymbol="ETH"
                />

                {limitPriceInput}
              </div>
              <LeverageSelector
                value={leverage}
                inputValue={leverageInput}
                min={tradeMockData.leverage.min}
                max={tradeMockData.leverage.max}
                step={tradeMockData.leverage.step}
                marks={tradeMockData.leverage.marks}
                onChange={handleLeverageChange}
                onInputChange={handleLeverageInputChange}
                error={leverageError}
              />

              <InfoList items={infoItems} />
            </>
          ) : (
            <>
              <TokenInput
                label="Reduce"
                value={reduceAmount}
                selectedToken={sizeAsset.symbol}
                tokens={[sizeAsset]}
                onValueChange={handleReduceAmountChange}
                onTokenChange={() => undefined}
                balanceLabel={`Position: ${sideMarket.position.size} ${sizeAsset.symbol}`}
                showMaxButton={inputOptions.maxButton}
                showTokenSelector={false}
                showBalance={inputOptions.balance}
                showUsdValue={inputOptions.usdValue}
                onMaxClick={() => syncReduceFromPercent(100)}
                error={reduceInputError}
                displaySymbol="ETH"
              />

              <PositionReduceSlider
                value={reducePercent}
                onChange={syncReduceFromPercent}
              />

              <TokenInput
                label="Receive"
                value={receiveAmount}
                selectedToken={closeReceiveAsset.symbol}
                tokens={depositTokens}
                onValueChange={handleReceiveAmountChange}
                onTokenChange={handleReceiveTokenChange}
                showMaxButton={false}
                showTokenSelector={inputOptions.tokenSelector}
                showBalance={false}
                showUsdValue={inputOptions.usdValue}
                error={receiveInputError}
              />

              {limitPriceInput}

              <InfoList items={closeInfoItems} />
            </>
          )}

          <Button
            size="lg"
            className="w-full h-14!"
            onClick={() => setPreviewOpen(true)}
            disabled={!canSubmit}
          >
            {action === "sell-close"
              ? reducePercent >= 100
                ? "Close"
                : "Reduce"
              : "Preview"}
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

      <MockTradeDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        action={action}
        side={side}
        orderPrice={orderPrice}
        leverage={leverage}
        createNewPosition={createNewPosition}
        deposit={deposit}
        depositAsset={depositAsset}
        size={size}
        sizeAsset={sizeAsset}
        reduceAmount={reduceAmount}
        receiveAmount={receiveAmount}
        closeReceiveAsset={closeReceiveAsset}
        currentPositionSize={sideMarket.position.size}
        currentPositionLeverage={sideMarket.position.leverage}
        currentLiquidationBrake={sideMarket.position.liquidationBrake}
      />
    </>
  );
}
