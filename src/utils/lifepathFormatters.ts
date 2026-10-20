export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
};

// Base currency is USD
export const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
};

/**
 * Format currency with compact or standard notation
 */
export function formatCurrency(
  amountInUSD: number,
  currency: Currency = 'USD',
  isPrivate: boolean = false,
  compact: boolean = false
): string {
  if (isPrivate) {
    return '••••••';
  }

  const rate = EXCHANGE_RATES[currency] || 1.0;
  const converted = amountInUSD * rate;
  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  if (compact) {
    if (Math.abs(converted) >= 1_000_000_000) {
      return `${symbol}${(converted / 1_000_000_000).toFixed(2)}B`;
    }
    if (Math.abs(converted) >= 1_000_000) {
      return `${symbol}${(converted / 1_000_000).toFixed(2)}M`;
    }
    if (Math.abs(converted) >= 1_000) {
      return `${symbol}${(converted / 1_000).toFixed(1)}k`;
    }
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  }

  if (currency === 'INR') {
    return `${symbol}${Math.round(converted).toLocaleString('en-IN')}`;
  }

  return `${symbol}${Math.round(converted).toLocaleString('en-US')}`;
}

export function formatFullUSD(amount: number): string {
  return '$' + Math.round(amount).toLocaleString('en-US');
}

export function formatCompactUSD(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}k`;
  }
  return `$${Math.round(amount).toLocaleString('en-US')}`;
}
