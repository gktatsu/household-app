import React from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';

interface SummaryCardsProps {
  income: number;
  expense: number;
  balance: number;
  currency: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  income,
  expense,
  balance,
  currency,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 収入 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">収入</p>
            <p className="text-2xl font-bold text-income mt-2">
              {formatCurrency(income, currency)}
            </p>
          </div>
          <div className="w-12 h-12 bg-income-light rounded-full flex items-center justify-center">
            <ArrowUpIcon className="w-6 h-6 text-income" />
          </div>
        </div>
      </div>

      {/* 支出 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">支出</p>
            <p className="text-2xl font-bold text-expense mt-2">
              {formatCurrency(expense, currency)}
            </p>
          </div>
          <div className="w-12 h-12 bg-expense-light rounded-full flex items-center justify-center">
            <ArrowDownIcon className="w-6 h-6 text-expense" />
          </div>
        </div>
      </div>

      {/* 収支 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">収支</p>
            <p
              className={`text-2xl font-bold mt-2 ${
                balance >= 0 ? 'text-income' : 'text-expense'
              }`}
            >
              {balance >= 0 ? '+' : '-'}
              {formatCurrency(Math.abs(balance), currency)}
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              balance >= 0 ? 'bg-income-light' : 'bg-expense-light'
            }`}
          >
            <BanknotesIcon
              className={`w-6 h-6 ${
                balance >= 0 ? 'text-income' : 'text-expense'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};