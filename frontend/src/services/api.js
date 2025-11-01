"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExchangeRates = exports.getCategories = exports.deleteTransaction = exports.updateTransaction = exports.createTransaction = exports.getTransactions = void 0;
const axios_1 = __importDefault(require("axios"));
const API_URL = import.meta.env.VITE_API_URL;
const api = axios_1.default.create({
    baseURL: API_URL,
});
// Transactions
const getTransactions = async (filters, token) => {
    const response = await api.get('/api/transactions', {
        params: filters,
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
exports.getTransactions = getTransactions;
const createTransaction = async (data, token) => {
    const response = await api.post('/api/transactions', data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
exports.createTransaction = createTransaction;
const updateTransaction = async (id, data, token) => {
    const response = await api.put(`/api/transactions/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (id, token) => {
    await api.delete(`/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
exports.deleteTransaction = deleteTransaction;
// Categories
const getCategories = async (token) => {
    const response = await api.get('/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
exports.getCategories = getCategories;
// Exchange Rates
const getExchangeRates = async () => {
    const response = await api.get('/api/exchange-rates');
    return response.data;
};
exports.getExchangeRates = getExchangeRates;
