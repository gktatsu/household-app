import { useState, useEffect } from 'react';
import { getExchangeRates } from '../services/api';

export interface ExchangeRates {
  USD: number;
  JPY: number;
  EUR: number;
}

export const useExchangeRates = () => {
  const [rates, setRates] = useState<ExchangeRates>({
    USD: 1,
    JPY: 160,
    EUR: 0.91,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const data = await getExchangeRates();
      setRates(data.rates);
      setLastUpdated(data.date);
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertCurrency = (
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): number => {
    if (fromCurrency === toCurrency) return amount;

    // USD経由で変換
    const usdAmount =
      fromCurrency === 'USD' 
        ? amount 
        : amount / rates[fromCurrency as keyof ExchangeRates];

    const convertedAmount =
      toCurrency === 'USD'
        ? usdAmount
        : usdAmount * rates[toCurrency as keyof ExchangeRates];

    // 小数点以下2桁に丸める
    return Math.round(convertedAmount * 100) / 100;
  };

  return { 
    rates, 
    loading, 
    lastUpdated, 
    convertCurrency, 
    refreshRates: fetchRates 
  };
};