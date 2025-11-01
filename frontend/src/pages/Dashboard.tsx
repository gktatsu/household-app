import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTransactions, getCategories } from '../services/api';
import { Transaction, Category } from '../types';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { CurrencySelector } from '../components/common/CurrencySelector';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { CategoryPieChart } from '../components/dashboard/CategoryPieChart';
import { MonthlyBarChart } from '../components/dashboard/MonthlyBarChart';
import toast from 'react-hot-toast';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export const Dashboard: React.FC = () => {
  const { session } = useAuth();
  const { rates, convertCurrency, lastUpdated, refreshRates, loading: ratesLoading } = useExchangeRates();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCurrency, setDisplayCurrency] = useState<string>('JPY');

  // 今月の日付範囲
  const startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = session?.access_token;
      if (!token) return;

      const [transactionsData, categoriesData] = await Promise.all([
        getTransactions({ startDate, endDate }, token),
        getCategories(token),
      ]);

      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 通貨変換して集計
  const convertedTransactions = transactions.map((t) => ({
    ...t,
    convertedAmount: convertCurrency(t.amount, t.currency, displayCurrency),
  }));

  const totalIncome = convertedTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.convertedAmount, 0);

  const totalExpense = convertedTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.convertedAmount, 0);

  const balance = totalIncome - totalExpense;

  // カテゴリ別集計（支出のみ）
  const expenseByCategory = convertedTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const categoryName = t.categories?.name || 'その他';
      acc[categoryName] = (acc[categoryName] || 0) + t.convertedAmount;
      return acc;
    }, {} as Record<string, number>);

  const handleRefreshRates = async () => {
    try {
      await refreshRates();
      toast.success('為替レートを更新しました');
    } catch (error) {
      toast.error('為替レートの更新に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-2 text-gray-600">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-600 mt-1">
            {format(new Date(), 'yyyy年M月')}の収支状況
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              為替レート更新: {lastUpdated}
            </span>
            <button
              onClick={handleRefreshRates}
              disabled={ratesLoading}
              className="p-1 text-gray-400 hover:text-primary-600 transition-colors disabled:opacity-50"
              title="為替レートを更新"
            >
              <ArrowPathIcon className={`w-4 h-4 ${ratesLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <CurrencySelector
            value={displayCurrency}
            onChange={setDisplayCurrency}
          />
        </div>
      </div>

      {/* サマリーカード */}
      <SummaryCards
        income={totalIncome}
        expense={totalExpense}
        balance={balance}
        currency={displayCurrency}
      />

      {/* グラフエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* カテゴリ別円グラフ */}
        <CategoryPieChart
          data={expenseByCategory}
          currency={displayCurrency}
          categories={categories}
        />

        {/* 月別推移グラフ */}
        <MonthlyBarChart
          transactions={convertedTransactions}
          currency={displayCurrency}
        />
      </div>

      {/* 取引数の表示 */}
      {transactions.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          今月の取引数: {transactions.length}件
        </div>
      )}
    </div>
  );
};