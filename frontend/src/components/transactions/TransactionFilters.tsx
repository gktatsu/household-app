import React from 'react';
import { Category } from '../../types';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TransactionFiltersProps {
  filters: {
    startDate: string;
    endDate: string;
    type: string;
    category: string;
    currency: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  categories: Category[];
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  setFilters,
  categories,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleReset = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: '',
      category: '',
      currency: '',
    });
  };

  const hasActiveFilters = 
    filters.startDate || 
    filters.endDate || 
    filters.type || 
    filters.category || 
    filters.currency;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      {/* ヘッダー */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
        >
          <FunnelIcon className="w-5 h-5" />
          フィルタ
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              適用中
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <XMarkIcon className="w-4 h-4" />
            リセット
          </button>
        )}
      </div>

      {/* フィルタ内容 */}
      {isOpen && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* 開始日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                開始日
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

            {/* 終了日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                終了日
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

            {/* タイプ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイプ
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="">すべて</option>
                <option value="income">収入</option>
                <option value="expense">支出</option>
              </select>
            </div>

            {/* カテゴリ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="">すべて</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 通貨 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                通貨
              </label>
              <select
                value={filters.currency}
                onChange={(e) =>
                  setFilters({ ...filters, currency: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="">すべて</option>
                <option value="JPY">JPY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};