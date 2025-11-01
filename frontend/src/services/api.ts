import axios from 'axios';
import type { Transaction, Category } from '../types';

export type TransactionFilters = {
  startDate?: string;
  endDate?: string;
  type?: '' | 'income' | 'expense';
  category?: string;
  currency?: '' | 'JPY' | 'USD' | 'EUR';
};

export type TransactionPayload = {
  type: 'income' | 'expense';
  amount: number;
  currency: 'JPY' | 'USD' | 'EUR';
  category_id: string;
  description: string;
  date: string;
};

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Transactions
export const getTransactions = async (
  filters: TransactionFilters,
  token: string
) => {
  const response = await api.get('/api/transactions', {
    params: filters,
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data as Transaction[];
};

export const createTransaction = async (
  data: TransactionPayload,
  token: string
) => {
  const response = await api.post('/api/transactions', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data as Transaction;
};

export const updateTransaction = async (
  id: string,
  data: TransactionPayload,
  token: string
) => {
  const response = await api.put(`/api/transactions/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data as Transaction;
};

export const deleteTransaction = async (id: string, token: string) => {
  await api.delete(`/api/transactions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Categories
export const getCategories = async (token: string) => {
  const response = await api.get('/api/categories', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data as Category[];
};

// Exchange Rates
export const getExchangeRates = async () => {
  const response = await api.get('/api/exchange-rates');
  return response.data;
};