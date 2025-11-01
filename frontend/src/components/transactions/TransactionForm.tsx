import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createTransaction, updateTransaction } from '../../services/api';
import { Category, Transaction } from '../../types';
import toast from 'react-hot-toast';

interface TransactionFormProps {
  transaction?: Transaction;
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

type TransactionType = 'income' | 'expense';
type Currency = 'JPY' | 'USD' | 'EUR';

interface FormData {
  type: TransactionType;
  amount: string;
  currency: Currency;
  category_id: string;
  description: string;
  date: string;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  categories,
  onSuccess,
  onCancel,
}) => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    type: transaction?.type || 'expense',
    amount: transaction?.amount?.toString() || '',
    currency: transaction?.currency || 'JPY',
    category_id: transaction?.category_id ? String(transaction.category_id) : '',
    description: transaction?.description || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // カテゴリをtypeでフィルタリング
  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.type
  );

  useEffect(() => {
    // typeが変わったらcategory_idをリセット
    if (!filteredCategories.find((cat) => String(cat.id) === formData.category_id)) {
      setFormData((prev) => ({ ...prev, category_id: '' }));
    }
  }, [formData.type, filteredCategories]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = '金額を正しく入力してください';
    }

    // 通貨別の最小値チェック
    if (formData.currency === 'JPY' && Number(formData.amount) < 0) {
      newErrors.amount = '金額は0円以上である必要があります';
    } else if (
      (formData.currency === 'USD' || formData.currency === 'EUR') &&
      Number(formData.amount) < 0.01
    ) {
      newErrors.amount = '金額は0.01以上である必要があります';
    }

    // 最大値チェック
    if (Number(formData.amount) > 999999999) {
      newErrors.amount = '金額は999,999,999以下である必要があります';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'カテゴリを選択してください';
    }

    if (!formData.date) {
      newErrors.date = '日付を入力してください';
    }

    // 日付の範囲チェック（100年前から未来まで）
    const selectedDate = new Date(formData.date);
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);

    if (selectedDate < hundredYearsAgo) {
      newErrors.date = '日付は100年前以降である必要があります';
    }

    if (formData.description && formData.description.length > 100) {
      newErrors.description = '説明は100文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const token = session?.access_token;
      if (!token) throw new Error('認証エラー');

      const payload = {
        ...formData,
        amount: Number(formData.amount),
      };

      if (transaction) {
        await updateTransaction(transaction.id, payload, token);
        toast.success('取引を更新しました');
      } else {
        await createTransaction(payload, token);
        toast.success('取引を登録しました');
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message || '取引の保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: TransactionType) => {
    setFormData({ ...formData, type });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, amount: e.target.value });
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currency = e.target.value as Currency;
    setFormData({ ...formData, currency });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, category_id: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, description: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 取引タイプ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          タイプ <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              formData.type === 'expense'
                ? 'bg-expense text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            支出
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              formData.type === 'income'
                ? 'bg-income text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            収入
          </button>
        </div>
      </div>

      {/* 金額と通貨 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            金額 <span className="text-red-500">*</span>
          </label>
          <input
            id="amount"
            type="number"
            step={formData.currency === 'JPY' ? '1' : '0.01'}
            value={formData.amount}
            onChange={handleAmountChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="1000"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
          )}
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
            通貨 <span className="text-red-500">*</span>
          </label>
          <select
            id="currency"
            value={formData.currency}
            onChange={handleCurrencyChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="JPY">JPY (¥)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>

      {/* カテゴリ */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          カテゴリ <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={formData.category_id}
          onChange={handleCategoryChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.category_id ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">カテゴリを選択</option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>
        )}
      </div>

      {/* 日付 */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          日付 <span className="text-red-500">*</span>
        </label>
        <input
          id="date"
          type="date"
          value={formData.date}
          onChange={handleDateChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.date ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-500">{errors.date}</p>
        )}
      </div>

      {/* 説明 */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          説明（任意）
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleDescriptionChange}
          rows={3}
          maxLength={100}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="例: スーパーで食材購入"
        />
        <div className="mt-1 flex justify-between text-sm text-gray-500">
          <span className="text-red-500">{errors.description || ''}</span>
          <span>{formData.description.length}/100</span>
        </div>
      </div>

      {/* ボタン */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '保存中...' : transaction ? '更新' : '登録'}
        </button>
      </div>
    </form>
  );
};