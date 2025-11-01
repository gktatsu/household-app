import React from 'react';
import { Transaction } from '../../types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { formatCurrency } from '../../utils/formatCurrency';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  displayCurrency?: string;
  convertAmount?: (amount: number, fromCurrency: string, toCurrency: string) => number;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
  displayCurrency,
  convertAmount,
}) => {
  // 日付でグループ化
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const getDisplayAmount = (transaction: Transaction): string => {
    if (displayCurrency && convertAmount) {
      const converted = convertAmount(
        transaction.amount,
        transaction.currency,
        displayCurrency
      );
      return formatCurrency(converted, displayCurrency);
    }
    return formatCurrency(transaction.amount, transaction.currency);
  };

  const getDisplayCurrency = (transaction: Transaction): string => {
    return displayCurrency || transaction.currency;
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">取引がありません</p>
        <p className="text-sm text-gray-400 mt-2">
          新規登録ボタンから取引を追加してください
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedTransactions)
        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
        .map(([date, items]) => (
          <div key={date} className="bg-white rounded-lg shadow overflow-hidden">
            {/* 日付ヘッダー */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">
                {format(new Date(date), 'yyyy年M月d日(E)', { locale: ja })}
              </h3>
            </div>

            {/* 取引リスト */}
            <div className="divide-y divide-gray-200">
              {items.map((transaction) => (
                <div
                  key={transaction.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    {/* 左側: カテゴリと説明 */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: `${transaction.categories?.color}20` }}
                      >
                        {transaction.categories?.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900">
                          {transaction.categories?.name}
                        </p>
                        {transaction.description && (
                          <p className="text-sm text-gray-500 truncate">
                            {transaction.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 右側: 金額とアクション */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.type === 'income'
                              ? 'text-income'
                              : 'text-expense'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {getDisplayAmount(transaction)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getDisplayCurrency(transaction)}
                        </p>
                      </div>

                      {/* アクションボタン */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(transaction)}
                          className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                          title="編集"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(transaction.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="削除"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};