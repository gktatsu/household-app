// ユーザー関連
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface UserPreferences {
  user_id: string;
  default_currency: 'JPY' | 'USD' | 'EUR';
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

// カテゴリ（既存のまま）
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

// トランザクション
export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: 'JPY' | 'USD' | 'EUR';
  category_id: string;
  categories?: Category;
  description: string;
  date: string;
  exchange_rate_usd: number | null;
  created_at: string;
  updated_at: string;
}

// 為替レート
export interface ExchangeRates {
  USD: number;
  JPY: number;
  EUR: number;
}

export interface ExchangeRate {
  id: string;
  base_currency: string;
  target_currency: string;
  rate: number;
  date: string;
  created_at: string;
}