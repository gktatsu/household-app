import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, startOfMonth, subMonths } from 'date-fns';
import { ja } from 'date-fns/locale';
import { formatCurrency } from '../../utils/formatCurrency';

interface MonthlyBarChartProps {
  transactions: Array<{
    date: string;
    type: string;
    convertedAmount: number;
  }>;
  currency: string;
}

export const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({
  transactions,
  currency,
}) => {
  // 直近6ヶ月のデータを生成
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(startOfMonth(new Date()), 5 - i);
    return {
      month: format(date, 'M月', { locale: ja }),
      startDate: format(date, 'yyyy-MM-dd'),
      endDate: format(
        new Date(date.getFullYear(), date.getMonth() + 1, 0),
        'yyyy-MM-dd'
      ),
    };
  });

  const chartData = months.map(({ month, startDate, endDate }) => {
    const monthTransactions = transactions.filter(
      (t) => t.date >= startDate && t.date <= endDate
    );

    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.convertedAmount, 0);

    const expense = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.convertedAmount, 0);

    return { 
      month, 
      収入: Math.round(income), 
      支出: Math.round(expense) 
    };
  });

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      color: string;
      name: string;
      value: number;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-4">
              <span className="text-sm" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="text-sm font-medium">
                {formatCurrency(entry.value, currency)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        月別収支推移
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            stroke="#888"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#888"
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '14px' }}
            iconType="rect"
          />
          <Bar 
            dataKey="収入" 
            fill="#6fb0c2" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="支出" 
            fill="#e8a76f" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};