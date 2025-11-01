import axios from 'axios';
import { supabase } from '../utils/supabase';
import { ExchangeRates } from '../types';

const EXCHANGE_API_KEY = process.env.EXCHANGE_API_KEY;
const BASE_CURRENCY = 'USD';

export const getExchangeRates = async (): Promise<ExchangeRates> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // キャッシュチェック
    const { data: cachedRates, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .eq('date', today)
      .eq('base_currency', BASE_CURRENCY);

    if (!error && cachedRates && cachedRates.length > 0) {
      const rates: ExchangeRates = { USD: 1, JPY: 160, EUR: 0.91 };
      cachedRates.forEach(rate => {
        rates[rate.target_currency as keyof ExchangeRates] = rate.rate;
      });
      return rates;
    }

    // APIから取得
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/${BASE_CURRENCY}`
    );

    const apiRates = response.data.conversion_rates;

    // DBに保存
    const ratesToInsert = ['JPY', 'EUR'].map(currency => ({
      base_currency: BASE_CURRENCY,
      target_currency: currency,
      rate: apiRates[currency],
      date: today,
    }));

    await supabase
      .from('exchange_rates')
      .upsert(ratesToInsert, {
        onConflict: 'base_currency,target_currency,date',
      });

    return {
      USD: 1,
      JPY: apiRates.JPY,
      EUR: apiRates.EUR,
    };
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // フォールバック
    return {
      USD: 1,
      JPY: 160,
      EUR: 0.91,
    };
  }
};

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  const usdAmount = fromCurrency === 'USD' 
    ? amount 
    : amount / rates[fromCurrency as keyof ExchangeRates];
    
  const convertedAmount = toCurrency === 'USD'
    ? usdAmount
    : usdAmount * rates[toCurrency as keyof ExchangeRates];

  return Math.round(convertedAmount * 100) / 100;
};