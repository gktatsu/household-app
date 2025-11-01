import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTransactions, deleteTransaction, getCategories } from '../services/api';
import { Transaction, Category } from '../types';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionList } from '../components/transactions/TransactionList';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { CurrencySelector } from '../components/common/CurrencySelector';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/outline';

export const Transactions: React.FC = () => {
  const { session } = useAuth();
  const { convertCurrency } = useExchangeRates();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [displayCurrency, setDisplayCurrency] = useState<string>('JPY');

  // フィルタ状態
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    category: '',
    currency: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const token = session?.access_token;
      if (!token) return;

      const data = await getCategories(token);
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('カテゴリの取得に失敗しました');
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = session?.access_token;
      if (!token) return;

      const data = await getTransactions(filters, token);
      setTransactions(data);
    } catch (error) {
      toast.error('取引の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('この取引を削除してもよろしいですか？')) {
      return;
    }

    try {
      const token = session?.access_token;
      if (!token) return;

      await deleteTransaction(id, token);
      toast.success('取引を削除しました');
      fetchTransactions();
    } catch (error) {
      toast.error('取引の削除に失敗しました');
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
    fetchTransactions();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">取引履歴</h1>
        <div className="flex items-center gap-4">
          <CurrencySelector
            value={displayCurrency}
            onChange={setDisplayCurrency}
          />
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <PlusIcon className="w-5 h-5" />
            新規登録
          </button>
        </div>
      </div>

      {/* フィルタ */}
      <TransactionFilters
        filters={filters}
        setFilters={setFilters}
        categories={categories}
      />

      {/* 取引一覧 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      ) : (
        <TransactionList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          displayCurrency={displayCurrency}
          convertAmount={convertCurrency}
        />
      )}

      {/* フォームモーダル */}
      <Dialog
        open={isFormOpen}
        onClose={handleFormCancel}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6">
              {editingTransaction ? '取引を編集' : '新規取引を登録'}
            </Dialog.Title>

            <TransactionForm
              transaction={editingTransaction}
              categories={categories}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};