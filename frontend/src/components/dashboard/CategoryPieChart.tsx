import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  type PieLabelRenderProps,
} from 'recharts';
import { Category } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';

interface CategoryPieChartProps {
  data: Record<string, number>;
  currency: string;
  categories: Category[];
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  data,
  currency,
  categories,
}) => {
  const chartData = Object.entries(data)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      color: categories.find((c) => c.name === name)?.color || '#e8a76f',
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number }>;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {formatCurrency(payload[0].value, currency)}
          </p>
          <p className="text-xs text-gray-500">
            {((payload[0].value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (props: PieLabelRenderProps) => {
    const {
      cx = 0,
      cy = 0,
      midAngle = 0,
      innerRadius = 0,
      outerRadius = 0,
      percent = 0,
    } = props;
    const RADIAN = Math.PI / 180;
    const numericInnerRadius = Number(innerRadius);
    const numericOuterRadius = Number(outerRadius);
    const radius = numericInnerRadius + (numericOuterRadius - numericInnerRadius) * 0.5;
    const midAngleValue = typeof midAngle === 'number' ? midAngle : Number(midAngle);
    const percentValue = typeof percent === 'number' ? percent : Number(percent);
    const cxNumber = Number(cx);
    const cyNumber = Number(cy);
    const x = cxNumber + radius * Math.cos(-midAngleValue * RADIAN);
    const y = cyNumber + radius * Math.sin(-midAngleValue * RADIAN);

    if (percentValue < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
  textAnchor={x > cxNumber ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
  {`${(percentValue * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          カテゴリ別支出
        </h3>
        <div className="text-center py-12 text-gray-500">
          データがありません
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        カテゴリ別支出
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-sm text-gray-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};