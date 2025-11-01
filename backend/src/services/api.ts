import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Transactions
export const getTransactions = async (filters: any, token: string) => {
  const response = await api.get('/api/transactions', {
    params: filters,
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createTransaction = async (data: any, token: string) => {
  const response = await api.post('/api/transactions', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateTransaction = async (id: string, data: any, token: string) => {
  const response = await api.put(`/api/transactions/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
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
  return response.data;
};

// Exchange Rates
export const getExchangeRates = async () => {
  const response = await api.get('/api/exchange-rates');
  return response.data;
};