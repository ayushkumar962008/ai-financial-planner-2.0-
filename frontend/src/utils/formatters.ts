import { Currency } from '../types/finance';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
};

const CURRENCY_RATES: Record<Currency, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  INR: 84.10,
  JPY: 151.20,
};

export const formatCurrency = (
  amountUSD: number,
  currency: Currency = 'USD',
  compact: boolean = false
): string => {
  const rate = CURRENCY_RATES[currency] || 1.0;
  const converted = amountUSD * rate;
  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  if (compact && Math.abs(converted) >= 1_000_000) {
    return `${symbol}${(converted / 1_000_000).toFixed(2)}M`;
  }
  if (compact && Math.abs(converted) >= 1_000) {
    return `${symbol}${(converted / 1_000).toFixed(1)}k`;
  }

  return `${symbol}${converted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatPercent = (value: number, includeSign: boolean = true): string => {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};
