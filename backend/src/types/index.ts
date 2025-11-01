export interface Transaction {
  id?: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: 'JPY' | 'USD' | 'EUR';
  category_id: string;
  description?: string;
  date: string;
  exchange_rate_usd?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  is_system: boolean;
  user_id: string | null;
  created_at: string;
}

export interface ExchangeRates {
  USD: number;
  JPY: number;
  EUR: number;
}